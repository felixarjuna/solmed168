import { DateTime } from "luxon";
import { Badge } from "~/components/ui/badge";
import { buttonVariants } from "~/components/ui/button";
import { cn, formatDate, toRp } from "~/lib/utils";
import BackButton from "../_components/back-button";
import { getExpenses } from "./_actions/expense-actions";
import AddExpenseDrawer from "./_components/add-expense-drawer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import type { Viewport } from "next";
import { Suspense } from "react";
import PageLoader from "../_components/loading";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function Expense() {
  const expenses = await getExpenses();

  const monthlyExpense = expenses.reduce(
    (total, { amount }) => total + amount,
    0,
  );

  const monthName = DateTime.now().setLocale("id").toFormat("MMMM");

  return (
    <Suspense fallback={<PageLoader />}>
      <section className="flex min-h-screen flex-col p-8">
        <BackButton />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold">Expenses</h1>
            <div
              className={cn(
                buttonVariants({ variant: "outline" }),
                "flex h-fit w-1/2 flex-col items-start",
              )}
            >
              <div className="flex w-full items-center justify-between">
                <p className="text-xs opacity-90">Expenses</p>
                <Badge className="bg-[#b9f4d8] text-neutral-900">+1,2%</Badge>
              </div>
              <div>
                <p className="text-xl">{toRp(monthlyExpense)}</p>
              </div>
            </div>
            <AddExpenseDrawer />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="font-bold">Overview</h1>
            <div className="grid gap-3">
              {expenses.length > 0 ? (
                expenses.map((e, i) => (
                  <div key={i} className="grid grid-cols-12 items-center">
                    <span className="mt-[6px] inline-flex h-3 w-3 items-center justify-center self-start rounded-full bg-neutral-800">
                      <span className="inline-flex h-1 w-1 rounded-full bg-neutral-50"></span>
                    </span>

                    <div className="col-span-7">
                      <h3 className="text-normal font-semibold">{e.name}</h3>
                      <p className="text-sm opacity-50">{formatDate(e.date)}</p>
                    </div>
                    <p className="col-span-4 text-right text-sm font-semibold">
                      {toRp(e.amount)}
                    </p>
                  </div>
                ))
              ) : (
                <div>
                  <p>Belum ada pengeluaran di bulan {monthName}.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Suspense>
  );
}

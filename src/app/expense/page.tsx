import { formatDate, toRp } from "~/lib/utils";
import BackButton from "../_components/back-button";
import { getExpenses } from "./_actions/expense-actions";
import AddExpenseDrawer from "./_components/add-expense-drawer";

export default async function Expense() {
  const expenses = await getExpenses();

  return (
    <section className="flex h-screen flex-col p-8">
      <BackButton />

      <div className="flex w-full flex-col gap-2">
        <h1 className="font-bold">Expenses</h1>
        <AddExpenseDrawer />

        <h1 className="font-bold">Overview</h1>
        <div className="grid gap-3">
          {expenses.map((e, i) => (
            <div key={i} className="grid grid-cols-12 items-center">
              <span className="mt-[6px] inline-flex h-3 w-3 items-center justify-center self-start rounded-full bg-neutral-800">
                <span className="inline-flex h-1 w-1 rounded-full bg-neutral-50"></span>
              </span>

              <div className="col-span-8">
                <h3 className="text-normal font-semibold">{e.name}</h3>
                <p className="text-sm opacity-50">{formatDate(e.date)}</p>
              </div>
              <p className="col-span-3 text-right text-sm font-semibold">
                {toRp(e.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

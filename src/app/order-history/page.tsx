import { and, eq, gt, lt, type SQLWrapper } from "drizzle-orm";
import { Loader2, PiggyBank } from "lucide-react";
import { DateTime } from "luxon";
import { Suspense } from "react";
import { Separator } from "~/components/ui/separator";
import { formatDate, toRp, today } from "~/lib/utils";
import { db } from "~/server/db";
import { orders } from "~/server/db/schema";
import BackButton from "../_components/back-button";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** method to return all today orders */
async function getOrders(isActive: boolean) {
  const startOfDay = DateTime.now().startOf("day");
  const startOfTomorrow = startOfDay.plus({ day: 1 });

  const filters: SQLWrapper[] = [
    gt(orders.orderDate, startOfDay.toJSDate()),
    lt(orders.orderDate, startOfTomorrow.toJSDate()),
  ];

  if (isActive) filters.push(eq(orders.paid, false));
  else filters.push(eq(orders.paid, true));

  const query = db
    .select()
    .from(orders)
    .where(and(...filters));

  return await query;
}

export default async function Page(
  searchParams: Record<"searchParams", { active: string }>,
) {
  // active order only
  const isActive = searchParams.searchParams.active === "true";
  const orders = await getOrders(isActive);
  const total = orders.reduce((total, order) => total + order.totalAmount, 0);

  function getTextForEmptyOrder() {
    if (isActive) return "Belum ada pesanan aktif tercatat hari ini";
    return "Belum ada pesanan terbayar hari ini";
  }

  return (
    <div className="flex min-h-screen flex-col gap-4 p-8 pb-20">
      <BackButton />
      <h1 className="font-bold">Riwayat Pesanan</h1>
      <Suspense fallback={<Loader2 />}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div className="font-mono text-sm" key={order.orderId}>
              <h3>Order Id #{order.orderId}</h3>
              <p>{formatDate(order.orderDate)}</p>
              <div className="my-4">
                {order.products.map(({ product }) => (
                  <div className="grid grid-cols-10 gap-2" key={product.id}>
                    <p className="col-span-1">{product.amount}x</p>
                    <div className="col-span-6 flex flex-col gap-x-2">
                      <p>{product.name}</p>
                      <p className="text-xs">{toRp(product.price)}</p>
                    </div>
                    <p className="col-span-3 text-right">
                      {toRp(product.price * product.amount)}
                    </p>
                  </div>
                ))}
                <p className="text-right font-bold">
                  {toRp(order.totalAmount)}
                </p>
              </div>

              <Separator className="mt-3" />
            </div>
          ))
        ) : (
          <div>
            <p>{getTextForEmptyOrder()}</p>
          </div>
        )}

        <section className="fixed bottom-0 -mx-8 flex w-full items-center justify-between bg-neutral-100 p-4">
          <div className="relative flex items-center gap-2">
            <div className="rounded-full border bg-neutral-100 p-2">
              <PiggyBank />
            </div>
            <div>
              <p className="text-sm">
                Total: <span className="font-bold">{toRp(total)}</span>
              </p>
              <p className="text-xs">{today()}</p>
            </div>
          </div>
        </section>
      </Suspense>
    </div>
  );
}

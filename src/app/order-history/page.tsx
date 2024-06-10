import { db } from "~/server/db";
import BackButton from "../_components/back-button";
import { Suspense } from "react";
import { Loader2, PiggyBank, ShoppingBag } from "lucide-react";
import { formatDate, toRp, today } from "~/lib/utils";
import { orders } from "~/server/db/schema";
import { and, gt, lt } from "drizzle-orm";
import { DateTime } from "luxon";
import { Separator } from "~/components/ui/separator";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** method to return all today orders */
async function getOrders() {
  const startOfDay = DateTime.now().startOf("day");
  const startOfTomorrow = startOfDay.plus({ day: 1 });

  return await db
    .select()
    .from(orders)
    .where(
      and(
        gt(orders.orderDate, startOfDay.toJSDate()),
        lt(orders.orderDate, startOfTomorrow.toJSDate()),
      ),
    );
}

export default async function Page() {
  const orders = await getOrders();
  const total = orders.reduce((total, order) => total + order.totalAmount, 0);

  return (
    <div className="flex min-h-screen flex-col gap-4 p-8 pb-20">
      <BackButton />
      <h1 className="font-bold">Riwayat Pesanan</h1>
      <Suspense fallback={<Loader2 />}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div className="font-mono text-sm" key={order.orderId}>
              <h3>Order Id #{order.orderId}</h3>
              <p>{formatDate(order.orderDate!)}</p>
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
            <p>Belum ada pesanan tercatat di hari ini.</p>
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

import {
  AlertCircle,
  CheckCircle,
  Loader2,
  MoreHorizontal,
  PiggyBank,
  User,
  Utensils,
} from "lucide-react";
import { Suspense } from "react";
import { Badge } from "~/components/ui/badge";
import { buttonVariants } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import { formatDate, toRp, today } from "~/lib/utils";
import BackButton from "../_components/back-button";
import PaymentMethodDrawer from "../_components/payment-method-drawer";
import { getOrders } from "./_actions/action";
import EditOrderButton from "./_components/edit-order-button";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page(
  searchParams: Record<"searchParams", { active: string }>,
) {
  // active order only
  const isActive = searchParams.searchParams.active === "true";
  const orders = await getOrders(isActive);
  const total = orders.reduce((total, order) => total + order.totalAmount, 0);

  function getTextForEmptyOrder() {
    if (isActive) return "Belum ada pesanan aktif tercatat hari ini.";
    return "Belum ada pesanan terbayar hari ini.";
  }

  function renderBadge() {
    if (isActive)
      return (
        <Badge className="flex animate-pulse items-center gap-1 bg-yellow-200 text-black">
          <AlertCircle className="h-3 w-3" />
          <p>Unpaid</p>
        </Badge>
      );
    else
      return (
        <Badge className="flex items-center gap-1 bg-green-200 text-black">
          <CheckCircle className="h-3 w-3" />
          <p>Paid</p>
        </Badge>
      );
  }

  return (
    <div className="flex min-h-screen flex-col gap-4 p-8 pb-20">
      <BackButton />
      <h1 className="font-bold">Riwayat Pesanan</h1>
      <Suspense fallback={<Loader2 />}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div className="font-mono text-sm" key={order.orderId}>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3>Order Id #{order.orderId}</h3>
                      {renderBadge()}
                    </div>

                    <p>{formatDate(order.orderDate)}</p>
                  </div>
                </div>

                {isActive ? (
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger
                      aria-haspopup
                      className={buttonVariants({
                        size: "icon",
                        variant: "ghost",
                      })}
                      asChild
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <EditOrderButton orderId={order.orderId} />
                      </DropdownMenuItem>

                      <PaymentMethodDrawer order={order} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null}
              </div>

              <div className="my-4 flex gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="rounded-full bg-neutral-100 p-1">
                    <Utensils className="h-3 w-3" />
                  </div>
                  <p>No. Meja: {order.tableId}</p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <div className="w-fit rounded-full bg-neutral-100 p-1">
                    <User className="h-3 w-3" />
                  </div>
                  <p>Waiter: {order.waiter}</p>
                </div>
              </div>

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

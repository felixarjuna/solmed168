"use client";

import {
  HandPlatter,
  PrinterIcon,
  ShoppingBag,
  Ticket,
  User,
  Utensils,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { cn, orderItemsToCartItems, today, toRp } from "~/lib/utils";
import type {
  OrderWithDetails,
  ServingMethodType,
  Table,
  Waiter,
} from "~/server/db/schema";
import { getTables } from "../_actions/table-actions";
import { getWaiters } from "../_actions/waiter-actions";
import BackButton from "../_components/back-button";
import { InvoiceContent } from "../_components/invoice";
import PageLoader from "../_components/loading";
import { getOrderById } from "../order-history/_actions/action";
import AddOrderButton from "./_components/add-order-button";
import UpdateOrderButton from "./_components/update-order-button";
import { getDerivedServingMethod, useCart } from "./_hooks/useCart";
import { useClientState } from "./_hooks/useClientState";
import { usePrintReceipt } from "./_hooks/usePrintReceipt";

export default function Page() {
  const { items, cartTotal, syncCart } = useCart();
  const numberOfItems = items.reduce(
    (total, { product }) => total + product.amount,
    0
  );

  const getTextFromServingMethod = (method: ServingMethodType) => {
    if (method === "dine_in") {
      return "Dine in";
    }
    if (method === "takeaway") {
      return "Takeaway";
    }
  };

  /** handle update order by using order id */
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  /** local state for order (edit mode). */
  const [order, setOrder] = React.useState<OrderWithDetails | null>(null);
  const [selectedTableId, setSelectedTableId] = React.useState<number>(1);
  const [selectedWaiterName, setSelectedWaiterName] =
    React.useState<string>("Lia");

  const [tableList, setTableList] = React.useState<Table[]>([]);
  const [waiterList, setWaiterList] = React.useState<Waiter[]>([]);

  /** fetch table and waiter list. */
  React.useEffect(() => {
    const fetchData = async () => {
      const [tables, waiters] = await Promise.all([getTables(), getWaiters()]);
      setTableList(tables);
      setWaiterList(waiters);
    };
    fetchData();
  }, []);

  /** fetch order data when editing */
  React.useEffect(() => {
    const fetchOrder = async (id: number) => {
      const fetchedOrder = await getOrderById(id);
      if (fetchedOrder !== undefined) {
        setOrder(fetchedOrder);
        setSelectedTableId(fetchedOrder.tableId ?? 1);
        setSelectedWaiterName(fetchedOrder.waiter?.name ?? "Lia");
        const cartItems = orderItemsToCartItems(fetchedOrder.orderItems);
        syncCart(cartItems);
      }
    };

    if (orderId) {
      fetchOrder(+orderId);
    }
  }, [orderId]);

  const { servingMethod } = useClientState();
  const derivedServingMethod = getDerivedServingMethod(items);

  /**
   * Stamp the global serving method on items that don't have one yet.
   * This applies to newly added items (from the homepage) that haven't been
   * assigned a serving method. Items from an existing order or items that the
   * user has already toggled keep their serving method.
   *
   * syncCart will also trigger syncTakeawayBoxes inside the cart store.
   */
  React.useEffect(() => {
    // In edit mode, wait for order data before stamping
    if (orderId !== null && order === null) return;
    if (items.length === 0) return;

    let hasChanges = false;
    const updated = items.map((item) => {
      // Skip takeaway boxes — they're managed by the cart
      if (item.product.name === "Takeaway Box") return item;
      // Skip items that already have a serving method (from DB or user toggle)
      if (item.product.servingMethod !== undefined) return item;

      hasChanges = true;
      return {
        ...item,
        product: { ...item.product, servingMethod },
      };
    });

    if (hasChanges) {
      syncCart(updated);
    }
  }, [items, servingMethod, orderId, order, syncCart]);

  const { device, onPrintInternalReceipt } = usePrintReceipt(items);

  const receiptOrderDetails = {
    tableId: selectedTableId,
    waiterName: selectedWaiterName,
    servingMethod: derivedServingMethod,
  };

  return (
    <Suspense fallback={<PageLoader />}>
      <main className="min-h-svh pb-20">
        <section className="m-4 flex flex-col gap-6 p-4">
          <BackButton />

          <div className="flex flex-col gap-2">
            {orderId ? (
              <div className="flex items-center gap-4">
                <div className="w-fit rounded-full bg-neutral-100 p-2">
                  <Ticket className="h-4 w-4" />
                </div>
                <div className="-space-y-1 flex flex-col">
                  <p className="text-sm">Order Id</p>
                  <p className="font-bold text-xs">#{orderId}</p>
                </div>
              </div>
            ) : null}

            <div className="flex items-center gap-4">
              <div className="w-fit rounded-full bg-neutral-100 p-2">
                <HandPlatter className="h-4 w-4" />
              </div>
              <div className="-space-y-1 flex flex-col">
                <p className="text-sm">
                  {derivedServingMethod
                    ? getTextFromServingMethod(derivedServingMethod)
                    : getTextFromServingMethod(servingMethod)}
                  .
                </p>
                <p className="font-bold text-xs">{today()}</p>
              </div>
            </div>

            {(derivedServingMethod ?? servingMethod) === "dine_in" ? (
              <div className="flex items-center gap-4">
                <div className="w-fit rounded-full bg-neutral-100 p-2">
                  <Utensils className="h-4 w-4" />
                </div>
                <div className="flex w-full items-center justify-between">
                  <p className="text-sm">No. Meja</p>
                  <Select
                    disabled={orderId !== null}
                    onValueChange={(value) => setSelectedTableId(+value)}
                    value={selectedTableId.toString()}
                  >
                    <SelectTrigger className="max-w-24">
                      <SelectValue placeholder="Meja 1" />
                    </SelectTrigger>
                    <SelectContent>
                      {tableList.map((table) => (
                        <SelectItem
                          key={table.tableId}
                          value={`${table.tableNumber}`}
                        >
                          {`Meja ${table.tableNumber}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : null}

            <div className="flex items-center gap-4">
              <div className="w-fit rounded-full bg-neutral-100 p-2">
                <User className="h-4 w-4" />
              </div>
              <div className="flex w-full items-center justify-between">
                <p className="text-sm">Waiter</p>
                <Select
                  disabled={orderId !== null}
                  onValueChange={(value) => setSelectedWaiterName(value)}
                  value={selectedWaiterName}
                >
                  <SelectTrigger className="max-w-24">
                    <SelectValue placeholder="Nama" />
                  </SelectTrigger>
                  <SelectContent className="w-[24px]">
                    {waiterList.map((waiter) => (
                      <SelectItem key={waiter.waiterId} value={waiter.name}>
                        {waiter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-2">
            <h3 className="font-bold">Rincian order</h3>
            <InvoiceContent items={items} totalAmount={cartTotal} />
          </div>
        </section>

        <section className="fixed bottom-0 flex w-full items-center justify-between bg-neutral-100 p-4">
          <div className="relative flex gap-4">
            <ShoppingBag />
            <span className="-top-2 absolute left-3 flex h-5 w-5 items-center justify-center rounded-full border bg-neutral-100/90 text-[0.7rem]">
              {numberOfItems}
            </span>
            <p>
              Total: <span className="font-bold">{toRp(cartTotal)}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              className="relative"
              onClick={() => onPrintInternalReceipt(receiptOrderDetails)}
              size={"icon"}
            >
              <PrinterIcon className="relative h-4 w-4" />
              <span className="-right-1 -top-1 absolute flex h-3 w-3">
                <span
                  className={cn(
                    "absolute inline-flex h-full w-full rounded-full bg-neutral-400 opacity-75",
                    {
                      "animate-ping bg-cyan-400": device !== undefined,
                    }
                  )}
                />
                <span
                  className={cn(
                    "relative inline-flex h-3 w-3 rounded-full bg-neutral-400",
                    {
                      "bg-cyan-400": device !== undefined,
                    }
                  )}
                />
              </span>
            </Button>

            {orderId ? (
              <UpdateOrderButton orderId={+orderId} products={items} />
            ) : (
              <AddOrderButton
                items={items}
                servingMethod={derivedServingMethod ?? servingMethod}
                tableId={selectedTableId}
                totalAmount={cartTotal}
                waiterName={selectedWaiterName}
              />
            )}
          </div>
        </section>
      </main>
    </Suspense>
  );
}

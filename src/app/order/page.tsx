/** biome-ignore-all lint/nursery/noShadow: <explanation> */
"use client";
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

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
import { cn, today, toRp } from "~/lib/utils";
import type { NewOrder } from "~/server/db/schema";
import BackButton from "../_components/back-button";
import { InvoiceContent } from "../_components/invoice";
import PageLoader from "../_components/loading";
import { alacarte, type ServingMethodType, tableNums, waiters } from "../data";
import { getOrderById } from "../order-history/_actions/action";
import AddOrderButton from "./_components/add-order-button";
import UpdateOrderButton from "./_components/update-order-button";
import { type CartItem, useCart } from "./_hooks/useCart";
import { useClientState } from "./_hooks/useClientState";
import { usePrintReceipt } from "./_hooks/usePrintReceipt";

export default function Page() {
  const { items, cartTotal, syncCart } = useCart();
  const numberOfItems = items.reduce(
    (total, { product }) => total + product.amount,
    0
  );

  const { servingMethod } = useClientState();

  /** Automatically sync Takeaway Boxes based on serving method and mie/bakso items */
  React.useEffect(() => {
    const takeawayBox = alacarte.find((item) => item.name === "Takeaway Box");
    if (!takeawayBox) {
      return;
    }

    if (servingMethod === "dine_in") {
      const newItems: CartItem[] = [
        ...items.filter((item) => item.product.id !== takeawayBox.id),
      ];
      syncCart(newItems);

      return;
    }

    const boxCount = items.filter(
      (item) =>
        (item.product.type === "mie" || item.product.type === "bakso") &&
        item.product.id !== takeawayBox.id
    ).length;

    const newItems: CartItem[] = [
      ...items.filter((item) => item.product.id !== takeawayBox.id),
      { product: { ...takeawayBox, amount: boxCount } },
    ];
    syncCart(newItems);
  }, [servingMethod]);

  const getTextFromServingMethod = (method: ServingMethodType) => {
    if (method === "dine_in") {
      return "Dine in";
    }
    if (method === "takeaway") {
      return "Takeaway";
    }
  };

  /** local state for table id */
  const [tableId, setTableId] = React.useState<string>("1");

  /** local state for waiter name */
  const [waiter, setWaiter] = React.useState<string>(waiters.at(0) ?? "Lia");

  /** handle update order by using order id */
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  /** Add new order. */
  const order: NewOrder = {
    tableId: +tableId,
    waiter,
    products: items,
    totalAmount: cartTotal,
    servingMethod,
  };

  React.useEffect(() => {
    const fetchOrder = async (orderId: number) => {
      const order = await getOrderById(orderId);
      if (order) {
        setTableId(order.tableId.toString());
        setWaiter(order.waiter);
      }
    };

    if (orderId) {
      fetchOrder(+orderId);
    }
  }, [orderId]);

  const { device, onPrintInternalReceipt } = usePrintReceipt(items);

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
                  {getTextFromServingMethod(servingMethod)}.
                </p>
                <p className="font-bold text-xs">{today()}</p>
              </div>
            </div>

            {servingMethod === "dine_in" ? (
              <div className="flex items-center gap-4">
                <div className="w-fit rounded-full bg-neutral-100 p-2">
                  <Utensils className="h-4 w-4" />
                </div>
                <div className="flex w-full items-center justify-between">
                  <p className="text-sm">No. Meja</p>
                  <Select
                    disabled={orderId !== null}
                    onValueChange={(value) => setTableId(value)}
                    value={tableId}
                  >
                    <SelectTrigger className="max-w-24">
                      <SelectValue placeholder="Meja 1" />
                    </SelectTrigger>
                    <SelectContent>
                      {tableNums.map((num) => (
                        <SelectItem key={num} value={`${num}`}>
                          {`Meja ${num}`}
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
                  onValueChange={(value) => setWaiter(value)}
                  value={waiter}
                >
                  <SelectTrigger className="max-w-24">
                    <SelectValue placeholder="Nama" />
                  </SelectTrigger>
                  <SelectContent className="w-[24px]">
                    {waiters.map((waiter, i) => (
                      <SelectItem key={i.toString()} value={waiter}>
                        {waiter}
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
              onClick={() => onPrintInternalReceipt(order)}
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

            {/* <ViewReceiptButton items={items} totalAmount={cartTotal} /> */}

            {orderId ? (
              <UpdateOrderButton orderId={+orderId} products={order.products} />
            ) : (
              <AddOrderButton order={order} />
            )}
          </div>
        </section>
      </main>
    </Suspense>
  );
}

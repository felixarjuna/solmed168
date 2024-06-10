"use client";

import { ShoppingBag, Utensils } from "lucide-react";
import React from "react";
import { useReactToPrint } from "react-to-print";
import { Separator } from "~/components/ui/separator";
import { toRp, today } from "~/lib/utils";
import { type NewOrder } from "~/server/db/schema";
import BackButton from "../_components/back-button";
import Invoice, { InvoiceContent } from "../_components/invoice";
import PayButton from "../_components/pay-button";
import ViewReceiptButton from "../_components/view-receipt-button";
import { useCart } from "./_hooks/useCart";

export default function Page() {
  const { items, cartTotal } = useCart();
  const numberOfItems = items.reduce(
    (total, { product }) => total + product.amount,
    0,
  );

  /** Add new order. Table ID is now default to 1. */
  const order: NewOrder = {
    tableId: 1,
    products: items,
    totalAmount: cartTotal,
  };

  /** Define component to be referenced for invoice printing */
  const [isPrinting, setIsPrinting] = React.useState<boolean>(false);
  const printRef = React.useRef(null);
  const promiseRef = React.useRef<((value?: unknown) => void) | null>(null);

  React.useEffect(() => {
    if (isPrinting && promiseRef.current) {
      // Resolves the Promise, letting `react-to-print` know that the DOM updates are completed
      promiseRef.current();
    }
  }, [isPrinting]);

  const onPrint = useReactToPrint({
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        promiseRef.current = resolve;
        setIsPrinting(true);
      });
    },
    onAfterPrint: () => {
      promiseRef.current = null;
      setIsPrinting(false);
    },
  });

  return (
    <main className="z-0">
      <section className="m-4 flex flex-col gap-4 p-4">
        <BackButton />

        <div className="flex items-center gap-4">
          <div className="w-fit rounded-full bg-neutral-100 p-2">
            <Utensils className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm">Dine in.</p>
            <p className="text-xs font-bold">{today()}</p>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <h3 className="font-bold">Rincian order</h3>
          {<InvoiceContent items={items} totalAmount={cartTotal} />}

          <div ref={printRef} className={isPrinting ? "mt-4 p-8" : "hidden"}>
            <Invoice items={items} totalAmount={cartTotal} />
          </div>
        </div>
      </section>

      <section className="fixed bottom-0 flex w-full items-center justify-between bg-neutral-100 p-4">
        <div className="relative flex gap-4">
          <ShoppingBag />
          <span className="absolute -top-2 left-3 flex h-5 w-5 items-center justify-center rounded-full border bg-neutral-100/90 text-[0.7rem]">
            {numberOfItems}
          </span>
          <p>
            Total: <span className="font-bold">{toRp(cartTotal)}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <ViewReceiptButton items={items} totalAmount={cartTotal} />
          <PayButton order={order} />
        </div>
      </section>
    </main>
  );
}

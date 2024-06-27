"use client";
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  HandPlatter,
  PrinterIcon,
  ShoppingBag,
  User,
  Utensils,
} from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { cn, toRp, today } from "~/lib/utils";
import { type NewOrder } from "~/server/db/schema";
import BackButton from "../_components/back-button";
import { InvoiceContent } from "../_components/invoice";
import ViewReceiptButton from "../_components/view-receipt-button";
import { servants, tableNums, type ServingMethodType } from "../data";
import AddOrderButton from "./_components/add-order-button";
import { useCart } from "./_hooks/useCart";
import { useClientState } from "./_hooks/useClientState";
import { useThermalPrinter } from "./_hooks/useThermalPrinter";

export default function Page() {
  const { items, cartTotal } = useCart();
  const numberOfItems = items.reduce(
    (total, { product }) => total + product.amount,
    0,
  );

  const { servingMethod } = useClientState();
  const getTextFromServingMethod = (method: ServingMethodType) => {
    if (method === "dine_in") return "Dine in";
    if (method === "takeaway") return "Takeaway";
  };

  const { device, onPrint } = useThermalPrinter(items);

  /** local state for table id */
  const [tableId, setTableId] = React.useState<string>("1");

  /** local state for servant name */
  const [servant, setServant] = React.useState<string>(servants[0]!);

  /** Add new order. Table ID is now default to 1. */
  const order: NewOrder = {
    tableId: +tableId,
    servant: servant,
    products: items,
    totalAmount: cartTotal,
    servingMethod: servingMethod,
  };

  return (
    <main className="z-0">
      <section className="m-4 flex flex-col gap-4 p-4">
        <BackButton />

        <div className="flex items-center gap-4">
          <div className="w-fit rounded-full bg-neutral-100 p-2">
            <HandPlatter className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm">
              {getTextFromServingMethod(servingMethod)}.
            </p>
            <p className="text-xs font-bold">{today()}</p>
          </div>
        </div>

        {servingMethod === "dine_in" ? (
          <div className="flex items-center gap-4">
            <div className="w-fit rounded-full bg-neutral-100 p-2">
              <Utensils className="h-4 w-4" />
            </div>
            <div className="flex w-full items-center justify-between">
              <p className="text-sm">No. Meja</p>
              <Select onValueChange={(value) => setTableId(value)}>
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
            <p className="text-sm">Pelayan</p>
            <Select onValueChange={(value) => setServant(value)}>
              <SelectTrigger className="max-w-24">
                <SelectValue placeholder="Nama" />
              </SelectTrigger>
              <SelectContent className="w-[24px]">
                {servants.map((servant, i) => (
                  <SelectItem key={i} value={servant}>
                    {servant}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <h3 className="font-bold">Rincian order</h3>
          {<InvoiceContent items={items} totalAmount={cartTotal} />}
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
          <Button size={"icon"} onClick={onPrint} className="relative">
            <PrinterIcon className="relative h-4 w-4"></PrinterIcon>
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span
                className={cn(
                  "absolute inline-flex h-full w-full  rounded-full bg-neutral-400 opacity-75",
                  {
                    "animate-ping bg-cyan-400": device !== undefined,
                  },
                )}
              />
              <span
                className={cn(
                  "relative inline-flex h-3 w-3 rounded-full bg-neutral-400",
                  {
                    "bg-cyan-400": device !== undefined,
                  },
                )}
              ></span>
            </span>
          </Button>

          <ViewReceiptButton items={items} totalAmount={cartTotal} />
          <AddOrderButton order={order} />
        </div>
      </section>
    </main>
  );
}

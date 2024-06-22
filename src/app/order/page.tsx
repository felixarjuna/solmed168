"use client";
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { HandPlatter, PrinterIcon, ShoppingBag } from "lucide-react";
import { Br, Line, Printer, Row, Text, render } from "react-thermal-printer";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { cn, formatDate, toRp, today } from "~/lib/utils";
import { type NewOrder } from "~/server/db/schema";
import BackButton from "../_components/back-button";
import { InvoiceContent } from "../_components/invoice";
import PayButton from "../_components/payment-method-button";
import ViewReceiptButton from "../_components/view-receipt-button";
import { type ServingMethodType } from "../menu";
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

  const { device, onConnectDevice, onPrint } = useThermalPrinter();

  /** Add new order. Table ID is now default to 1. */
  const order: NewOrder = {
    tableId: 1,
    products: items,
    totalAmount: cartTotal,
    servingMethod: servingMethod,
  };

  /** Method to handle invoice print.
   * 1. Connect to bluetooth thermal printer
   * device disconnected.
   * 2. Render the receipt
   * 3. Print the receipt
   */
  const onHandlePrint = async () => {
    if (device === undefined) await onConnectDevice();

    const encoder = (text: string) => new TextEncoder().encode(text);
    const receipt = (
      <Printer
        type="epson"
        width={32}
        characterSet="wpc1252"
        encoder={encoder}
        initialize={false}
      >
        <Text align="center">SOLMED 168</Text>
        <Text align="center">RUKO SAN DIEGO MR2-10/87</Text>
        <Text align="center">PAKUWON CITY, SURABAYA</Text>
        <Text align="center">(031) 5929985 - (081) 287968899</Text>
        <Line />
        <Text>Waktu Pemesanan</Text>
        <Text>{formatDate(new Date())}</Text>
        <Br />
        {items.map((item) => {
          const amount = `${item.product.amount}x`;
          const price = toRp(item.product.price);
          return (
            <Row
              key={item.product.id}
              left={amount}
              center={item.product.name}
              right={price}
              gap={1}
            />
          );
        })}
        <Br />
        <Row left="Grand Total" right={<Text bold>{toRp(cartTotal)}</Text>} />
        <Br />
        <Text align="center">HARGA SUDAH TERMASUK PAJAK</Text>
        <Text align="center">
          TERIMA KASIH SUDAH BERKUNJUNG KE SOLMED168 PAKUWON CITY
        </Text>
        <Br />
        <Br />
      </Printer>
    );
    const data = await render(receipt);
    await onPrint(data);
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
          <Button size={"icon"} onClick={onHandlePrint} className="relative">
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
          <PayButton order={order} onPrintInvoice={onHandlePrint} />
        </div>
      </section>
    </main>
  );
}

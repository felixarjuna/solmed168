import { Scissors } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { cn, formatDate, toRp } from "~/lib/utils";
import { useCart } from "../order/_hooks/useCart";
import ServingMethodToggle from "./serving-method-toggle";
import type { ReceiptProps } from "./view-receipt-button";

interface InvoiceProps
  extends React.HTMLAttributes<HTMLDivElement>,
    ReceiptProps {}

const Invoice = React.forwardRef<HTMLDivElement, InvoiceProps>((props, ref) => (
  <div className={cn("grid max-w-xs gap-4", props.className)} ref={ref}>
    <div className="text-center text-sm uppercase">
      <h3>Bakso Solmed 168</h3>
      <p>Ruko San Diego MR2–10/87</p>
      <p>Pakuwon City, Surabaya, Jawa Timur</p>
      <p>(031) 5929985 - (081) 287968899</p>
    </div>
    <InvoiceContent {...props} />
  </div>
));
Invoice.displayName = "Invoice";

export default Invoice;

export function InvoiceContent({ items, totalAmount }: InvoiceProps) {
  const { updateItemServingMethod, splitItem } = useCart();

  return (
    <div className="text-sm">
      <div>
        <p>Waktu Pemesanan</p>
        <p>{formatDate(new Date())}</p>
      </div>

      <div className="my-4">
        {items.map(({ cartItemId, product: item }) => (
          <div className="grid grid-cols-10 gap-2" key={cartItemId}>
            <p className="col-span-1">{item.amount}x</p>
            <div className="col-span-6 flex flex-col gap-2">
              <p>{item.name}</p>
              <p className="text-xs">{toRp(item.price)}</p>
              <div className="flex items-center gap-1">
                <ServingMethodToggle
                  cartItemId={cartItemId}
                  currentMethod={item.servingMethod}
                  onToggle={updateItemServingMethod}
                />
                {item.amount > 1 && item.name !== "Takeaway Box" && (
                  <Button
                    className="h-7 w-7 px-0"
                    onClick={() => splitItem(cartItemId)}
                    size="sm"
                    title="Split item"
                    type="button"
                    variant="ghost"
                  >
                    <Scissors className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            <p className="col-span-3 text-right">
              {toRp(item.price * item.amount)}
            </p>
          </div>
        ))}
      </div>

      <Separator className="my-3" />

      <div>
        {/* <div className="flex justify-between">
          <p>Subtotal</p>
          <p>{toRp(totalAmount * 0.9)}</p>
        </div>
        <div className="flex justify-between">
          <p>PB1 10%</p>
          <p>{toRp(totalAmount * 0.1)}</p>
        </div> */}
        <div className="flex justify-between">
          <p>Grand Total</p>
          <p className="font-bold">{toRp(totalAmount)}</p>
        </div>
      </div>
    </div>
  );
}

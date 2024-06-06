"use client";

import { ShoppingBag } from "lucide-react";
import CartButton from "./cart-button";
import { useCart } from "../order/_hooks/useCart";
import { toRp } from "~/lib/utils";
import { CartTriggerText } from "./cart";

export default function OrderSummary() {
  const { items, cartTotal } = useCart();
  const numberOfItems = items.reduce(
    (total, { product }) => total + product.amount,
    0,
  );

  return (
    <section className="F fixed bottom-0 flex w-full items-center justify-between rounded-lg bg-neutral-100 p-4">
      <div className="flex items-center gap-3 text-sm">
        <div className="relative">
          <ShoppingBag />
          <span className="absolute -top-2 left-3 flex h-5 w-5 items-center justify-center rounded-full border bg-neutral-100/90 text-[0.7rem]">
            {numberOfItems}
          </span>
        </div>
        <div>
          <p>
            Total: <span className="font-bold">{toRp(cartTotal)}</span>
          </p>
          <CartTriggerText />
        </div>
      </div>
      <div>
        <CartButton text="Lanjut" />
      </div>
    </section>
  );
}

"use client";

import { ShoppingBag } from "lucide-react";
import CartButton from "./cart-button";
import { useCart } from "../order/_hooks/useCart";
import { calculateTotal, toRp } from "~/lib/utils";
import Cart, { CartTriggerText } from "./cart";

export default function OrderSummary() {
  const { items, cartTotal } = useCart();

  return (
    <section className="F fixed bottom-0 flex w-full items-center justify-between rounded-lg bg-neutral-100 p-4">
      <div className="flex items-center gap-2 text-sm">
        <ShoppingBag />
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

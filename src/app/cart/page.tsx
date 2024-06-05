"use client";

import CartButton from "../_components/cart-button";
import MenuCard from "../_components/menu-card";
import { useCart } from "./_hooks/useCart";

export default function Page() {
  const { items } = useCart();

  const cartTotal = items.reduce(
    (total, { product }) => total + product.price * product.amount,
    0,
  );

  return (
    <main>
      <section className="m-4 flex flex-col gap-4 p-4">
        <h3 className="font-bold">Pesanan #1</h3>
        <div>
          {items.map((item) => (
            <MenuCard
              key={item.product.id}
              menu={item.product}
              amount={item.product.amount}
              isAdjustable={false}
            />
          ))}
        </div>

        <div className="flex items-center justify-between rounded-xl bg-neutral-100 p-4">
          <p className="text-sm font-bold">Total</p>
          <span>Rp. {cartTotal}</span>
        </div>
      </section>
      <section className="fixed bottom-0 flex w-full items-center justify-center bg-neutral-100 p-4">
        <CartButton text="Selesai" />
      </section>
    </main>
  );
}

"use client";

import { useRouter } from "next/navigation";
import CartButton from "../_components/cart-button";
import MenuCard from "../_components/menu-card";
import { useCart } from "./_hooks/useCart";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AddOrderButton from "../_components/add-order-button";
import { NewOrder } from "~/server/db/schema";

export default function Page() {
  const router = useRouter();
  const { items } = useCart();

  const cartTotal = items.reduce(
    (total, { product }) => total + product.price * product.amount,
    0,
  );

  const order: NewOrder = {
    tableId: 1,
    products: items,
    totalAmount: cartTotal,
  };

  return (
    <main>
      <section className="m-4 flex flex-col gap-4 p-4">
        <Button
          variant={"outline"}
          size={"sm"}
          className="gap-1 self-end"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali</span>
        </Button>
        <h3 className="font-bold">Pesanan #1</h3>
        <div className="flex flex-col gap-2">
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
        <AddOrderButton order={order} />
      </section>
    </main>
  );
}

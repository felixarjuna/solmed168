"use client";

import { useRouter } from "next/navigation";
import MenuCard from "../_components/menu-card";
import { useCart } from "./_hooks/useCart";
import { Button } from "~/components/ui/button";
import { ArrowLeft, ShoppingBag, Utensils } from "lucide-react";
import AddOrderButton from "../_components/add-order-button";
import { NewOrder } from "~/server/db/schema";
import { toRp, today } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";
import BackButton from "../_components/back-button";

export default function Page() {
  const router = useRouter();

  const { items, cartTotal } = useCart();
  const numberOfItems = items.reduce(
    (total, { product }) => total + product.amount,
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
          <div className="mb-20 flex flex-col gap-2">
            {items.map((item) => (
              <MenuCard
                key={item.product.id}
                menu={item.product}
                amount={item.product.amount}
                isAdjustable={false}
              />
            ))}
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
        <AddOrderButton order={order} />
      </section>
    </main>
  );
}

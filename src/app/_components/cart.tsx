"use client";

import { ShoppingCart } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { useCart } from "../order/_hooks/useCart";
import CartMenuCard from "./cart-menu-card";
import ServingMethodButton from "./serving-method-button";

export default function Cart() {
  const { items } = useCart();
  const numberOfItems = items.reduce(
    (total, { product }) => total + product.amount,
    0,
  );

  return (
    <div className="absolute right-0 top-0">
      <Drawer>
        <DrawerTrigger
          className={buttonVariants({ size: "icon", variant: "outline" })}
        >
          <div className="relative">
            <ShoppingCart className="h-4 w-4" />
            <span className="absolute -top-5 left-4 flex h-6 w-6 items-center justify-center rounded-full border bg-neutral-100/90 text-xs">
              {numberOfItems}
            </span>
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <CartContent />
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export function CartTriggerText() {
  return (
    <Drawer>
      <DrawerTrigger>
        <p className="text-sm underline underline-offset-2">Detail pesanan</p>
      </DrawerTrigger>
      <DrawerContent>
        <CartContent />
      </DrawerContent>
    </Drawer>
  );
}

export function CartContent() {
  const { items } = useCart();
  const numberOfItems = items.reduce(
    (total, { product }) => total + product.amount,
    0,
  );

  return (
    <DrawerHeader>
      <DrawerTitle>
        Keranjang {numberOfItems > 0 ? `(${numberOfItems})` : null}
      </DrawerTitle>
      <DrawerDescription className="flex flex-col gap-4 py-4">
        {numberOfItems === 0 ? <p>Belum ada barang dalam keranjang.</p> : null}

        {items.map((item) => (
          <CartMenuCard
            key={item.product.id}
            menu={item.product}
            amount={item.product.amount}
          />
        ))}

        <ServingMethodButton text="Lanjut" />
      </DrawerDescription>
    </DrawerHeader>
  );
}

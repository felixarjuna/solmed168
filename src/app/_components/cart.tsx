"use client";

import { ShoppingCart } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";
import { buttonVariants } from "~/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { getOrderById } from "../order-history/_actions/action";
import { useCart } from "../order/_hooks/useCart";
import CartMenuCard from "./cart-menu-card";
import ServingMethodDrawer from "./serving-method-drawer";

export default function Cart() {
  const { items, syncCart } = useCart();
  const numberOfItems = items.reduce(
    (total, { product }) => total + product.amount,
    0,
  );

  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  React.useEffect(() => {
    const fetchOrder = async (orderId: number) => {
      const order = await getOrderById(orderId);
      const products = order?.products;
      if (products) syncCart(products);
    };

    if (orderId) void fetchOrder(+orderId);
  }, [syncCart, orderId]);

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
        {numberOfItems === 0 ? "Belum ada barang dalam keranjang." : null}

        {items.map((item) => (
          <CartMenuCard
            key={item.product.id}
            menu={item.product}
            amount={item.product.amount}
          />
        ))}

        <ServingMethodDrawer text="Lanjut" />
      </DrawerDescription>
    </DrawerHeader>
  );
}

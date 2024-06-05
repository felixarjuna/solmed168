"use client";

import { ShoppingCart } from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import CartButton from "./cart-button";
import { useCart } from "../order/_hooks/useCart";
import CartMenuCard from "./cart-menu-card";

export default function Cart() {
  const { items, removeItem } = useCart();
  const numberOfItems = items.length;

  return (
    <div className="absolute right-0 top-0">
      <Drawer>
        <DrawerTrigger
          className={buttonVariants({ size: "icon", variant: "outline" })}
        >
          <ShoppingCart className="h-4 w-4" />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              Cart {numberOfItems > 0 ? `(${numberOfItems})` : null}
            </DrawerTitle>
            <DrawerDescription className="flex flex-col gap-4 py-4">
              {numberOfItems === 0 ? (
                <p>Belum ada barang dalam keranjang.</p>
              ) : null}

              {items.map((item) => (
                <CartMenuCard
                  key={item.product.id}
                  menu={item.product}
                  amount={item.product.amount}
                />
              ))}
              <CartButton text="Lanjutkan" />
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

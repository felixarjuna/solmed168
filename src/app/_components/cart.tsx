"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import MenuCard from "./menu-card";
import { setMenus } from "../menu";
import { useRouter } from "next/navigation";
import CartButton from "./cart-button";
import { useCart } from "../cart/_hooks/useCart";
import { IncrementalCache } from "next/dist/server/lib/incremental-cache";
import CartMenuCard from "./cart-menu-card";

export default function Cart() {
  const { items, removeItem } = useCart();
  const numberOfItems = items.length;

  return (
    <div className="absolute right-0 top-0">
      <Drawer>
        <DrawerTrigger>
          <Button variant={"outline"} size={"icon"}>
            <ShoppingCart className="h-4 w-4" />
          </Button>
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

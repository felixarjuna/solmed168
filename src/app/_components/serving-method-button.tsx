"use client";

import _ from "lodash";
import { HandPlatter, ShoppingCart, Utensils, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { useToast } from "~/components/ui/use-toast";
import { cn } from "~/lib/utils";
import { servingMethods, type ServingMethodType } from "../menu";
import { useCart } from "../order/_hooks/useCart";
import { useClientState } from "../order/_hooks/useClientState";

interface ServingMethodProps {
  readonly text: string;
}

export default function ServingMethodButton({ text }: ServingMethodProps) {
  const { items } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const getIconFromServingMethod = (method: ServingMethodType) => {
    if (method === "dine-in") return <HandPlatter className="h-4 w-4" />;
    if (method === "takeaway") return <Utensils className="h-4 w-4" />;
  };
  const { onChangeServingMethod } = useClientState();
  /** method to handle serving */
  const onClickServingMethod = (method: ServingMethodType) => {
    /** cart validation.
     * disallow user to continue if it the cart is empty.
     */
    if (items.length === 0) {
      toast({
        title: "Tidak ada pesanan dalam keranjang.",
        description: "Tambahkan pesanan dalam keranjang untuk melanjutkan.",
        variant: "destructive",
      });
      return;
    }
    onChangeServingMethod(method);
    router.push("/order");
  };

  return (
    <>
      <Drawer>
        <DrawerTrigger
          className={cn(buttonVariants({ variant: "default" }), "flex gap-2")}
        >
          <ShoppingCart className="h-4 w-4" />
          <p>{text}</p>
        </DrawerTrigger>
        <DrawerContent className="flex items-center justify-center">
          <DrawerHeader>
            <DrawerTitle>Methode Pelayanan</DrawerTitle>
            <DrawerDescription>
              Silahkan pilih methode pelayanan di bawah ini.
            </DrawerDescription>
          </DrawerHeader>
          {servingMethods.map((method, i) => (
            <Button
              key={i}
              className="flex w-40 justify-start gap-2 rounded-lg border px-6 py-4"
              size={"lg"}
              onClick={() => onClickServingMethod(method)}
            >
              {getIconFromServingMethod(method)}
              <p>{_.upperCase(method)}</p>
            </Button>
          ))}
          <DrawerFooter>
            <DrawerClose
              className={buttonVariants({ variant: "outline", size: "icon" })}
            >
              <X>Tutup</X>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

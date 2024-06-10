import { View, X } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { cn } from "~/lib/utils";
import { type CartItem } from "../order/_hooks/useCart";
import Invoice from "./invoice";

export interface ReceiptProps {
  readonly items: CartItem[];
  readonly totalAmount: number;
}

export default function ViewReceiptButton(props: ReceiptProps) {
  return (
    <Drawer>
      <DrawerTrigger
        className={cn(buttonVariants({ variant: "default", size: "icon" }))}
      >
        <View className="h-4 w-4" />
      </DrawerTrigger>
      <DrawerContent className="flex items-center justify-center">
        <Invoice {...props} className="py-8" />
        <DrawerFooter>
          <DrawerClose
            className={buttonVariants({ variant: "outline", size: "icon" })}
          >
            <X>Tutup</X>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

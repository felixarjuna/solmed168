import { View } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { type CartItem } from "../order/_hooks/useCart";
import Invoice from "./invoice";

interface ViewReceiptButtonProps {
  readonly items: CartItem[];
  readonly totalAmount: number;
}
export default function ViewReceiptButton(props: ViewReceiptButtonProps) {
  return (
    <div>
      <Drawer>
        <DrawerTrigger>
          <Button size={"icon"}>
            <View className="h-4 w-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="flex items-center justify-center">
          <Invoice {...props} className="py-8" />
          <DrawerFooter>
            <DrawerClose>
              <Button variant="outline">Tutup</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

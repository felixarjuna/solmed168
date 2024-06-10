"use client";

import * as _ from "lodash";
import { Banknote, Landmark, Loader2, QrCode, X } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
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
import { type NewOrder } from "~/server/db/schema";
import { paymentMethods, type PaymentMethodType } from "../menu";
import { safeAddOrder } from "../order/_actions/order-actions";
import { useCart } from "../order/_hooks/useCart";

interface PayButtonProps {
  readonly order: NewOrder;
  readonly onPrintInvoice: () => void;
}

export default function PayButton({ order, onPrintInvoice }: PayButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { clearCart } = useCart();

  const { execute, status } = useAction(safeAddOrder, {
    onSuccess: ({ success }) => {
      if (success) {
        /** show toast for success scenario, clear cart and re-route to home page */
        toast({
          title: "Pesanan berhasil. ✅",
          description: "Pesanan anda telah berhasil ditambahkan.",
        });
        clearCart();
        router.push("/");
      } else
        toast({
          title: "Pesanan gagal. ❌",
          description: "Pesanan anda gagal ditambahkan. ",
        });
    },
  });

  const getIconFromPaymentMethod = (method: PaymentMethodType) => {
    if (method === "cash") return <Banknote />;
    if (method === "qris") return <QrCode />;
    if (method === "transfer") return <Landmark />;
  };

  /** Method to handle payment: cash, qris, and transfer.
   * The current workflow must be executed for each transaction:
   * 1. handle payment
   * 2. save order to database if payment success
   * 3. print order invoice
   */
  const onClickPaymentMethod = (method: PaymentMethodType) => {
    const _order = { ...order, paymentMethod: method };
    execute(_order);
    onPrintInvoice();
  };

  return (
    <Drawer>
      <DrawerTrigger className={cn(buttonVariants({ variant: "default" }))}>
        <div className="flex h-4 items-center gap-2">
          {status === "executing" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Banknote className="h-4 w-4" />
          )}
          <p>Bayar</p>
        </div>
      </DrawerTrigger>
      <DrawerContent className="flex items-center justify-center">
        <DrawerHeader>
          <DrawerTitle>Methode Pembayaran</DrawerTitle>
          <DrawerDescription>
            Silahkan pilih methode pembayaran di bawah ini.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-2">
          {paymentMethods.map((method, i) => (
            <Button
              key={i}
              className="flex justify-start gap-2 rounded-lg border px-6 py-4"
              size={"lg"}
              onClick={() => onClickPaymentMethod(method)}
            >
              {getIconFromPaymentMethod(method)}
              <p>{_.upperCase(method)}</p>
            </Button>
          ))}
        </div>
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

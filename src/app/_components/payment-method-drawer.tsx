"use client";

import * as _ from "lodash";
import {
  ArrowLeft,
  Banknote,
  CircleAlert,
  CircleCheck,
  Landmark,
  Loader2,
  PartyPopper,
  QrCode,
  WalletMinimal,
  X,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import React from "react";
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
import { cn, toRp } from "~/lib/utils";
import { type Order } from "~/server/db/schema";
import { paymentMethods, type PaymentMethodType } from "../data";
import { safePayOrder } from "../order/_actions/order-actions";
import { useCart } from "../order/_hooks/useCart";
import { useThermalPrinter } from "../order/_hooks/useThermalPrinter";
import CashPayment from "./cash-payment";

interface IPaymentMethodDrawerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  readonly order: Order;
}

export default function PaymentMethodDrawer({
  order,
}: IPaymentMethodDrawerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { clearCart } = useCart();

  const { execute, status } = useAction(safePayOrder, {
    onSuccess: ({ success }) => {
      if (success) {
        /** show toast for success scenario, clear cart and re-route to home page */
        toast({
          title: "Pembayaran berhasil. ✅",
        });
        clearCart();
        router.push("/");
      } else
        toast({
          title: "Pembayaran gagal. ❌",
        });
    },
  });

  const getIconFromPaymentMethod = (method: PaymentMethodType) => {
    if (method === "cash") return <Banknote />;
    if (method === "qris") return <QrCode />;
    if (method === "transfer") return <Landmark />;
  };

  const { onPrint } = useThermalPrinter(order.products);

  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethodType>();
  const onSelectPaymentMethod = (method?: PaymentMethodType) => {
    setPaymentMethod(method);
  };

  /** Method to handle payment: cash, qris, and transfer.
   * The current workflow must be executed for each transaction:
   * 1. handle payment
   * 2. save order to database if payment success
   * 3. print order invoice
   */
  const onPaymentDone = async (method: PaymentMethodType) => {
    const _order = { ...order, paymentMethod: method };
    execute(_order);
    await onPrint();
  };

  const [isSufficient, setIsSufficient] = React.useState<boolean>(false);
  const onHandleCashSufficciency = (isSufficient: boolean) => {
    setIsSufficient(isSufficient);
  };

  return (
    <Drawer>
      <DrawerTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "mx-2 my-1 w-24 justify-start px-3",
        )}
      >
        <div className="flex items-center gap-2">
          {status === "executing" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <WalletMinimal className="h-4 w-4" />
          )}
          <p>Bayar</p>
        </div>
      </DrawerTrigger>
      <DrawerContent className="flex items-center justify-center">
        <DrawerHeader>
          <DrawerTitle>Metode Pembayaran</DrawerTitle>
          <DrawerDescription>
            Silahkan pilih metode pembayaran di bawah ini.
          </DrawerDescription>
        </DrawerHeader>

        {paymentMethod === undefined ? (
          <div className="flex flex-col gap-2">
            {paymentMethods.map((method, i) => (
              <Button
                key={i}
                className="flex justify-start gap-2 rounded-lg border px-6 py-4"
                size={"lg"}
                onClick={() => setPaymentMethod(method)}
              >
                {getIconFromPaymentMethod(method)}
                <p>{_.upperCase(method)}</p>
              </Button>
            ))}
          </div>
        ) : null}

        {paymentMethod === "cash" ? (
          <div className="grid w-60 gap-4">
            <CashPayment
              totalAmount={order.totalAmount}
              onHandleCashSufficiency={onHandleCashSufficciency}
            />

            {isSufficient ? (
              <div
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "justify-start gap-2 bg-[#b9f4d8] text-black",
                )}
              >
                <CircleCheck className="h-4 w-4" />
                <p>Uang anda mencukupi.</p>
              </div>
            ) : (
              <div
                className={cn(
                  buttonVariants({ variant: "destructive" }),
                  "justify-start gap-2",
                )}
              >
                <CircleAlert className="h-4 w-4" />
                <p>Uang tidak mencukupi.</p>
              </div>
            )}

            <ActionButton
              method={paymentMethod}
              onSelectPaymentMethod={onSelectPaymentMethod}
              onPaymentDone={onPaymentDone}
              isCashSufficient={isSufficient}
              onHandleCashSufficiency={onHandleCashSufficciency}
            />
          </div>
        ) : null}

        {paymentMethod === "qris" ? (
          <div className="grid min-w-60 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold">QRIS</p>
              <p className="text-3xl font-bold">{toRp(order.totalAmount)}</p>
            </div>

            <ActionButton
              method={paymentMethod}
              onSelectPaymentMethod={onSelectPaymentMethod}
              onPaymentDone={onPaymentDone}
            />
          </div>
        ) : null}

        {paymentMethod === "transfer" ? (
          <div className="grid min-w-60 gap-4">
            <div className="text-center">
              <p>Nominal pembayaran</p>
              <p className="text-3xl font-bold">{toRp(order.totalAmount)}</p>
            </div>

            <div className="flex gap-2 text-center">
              <div>
                <p>No. Rekening pembayaran</p>
                <p className="text-3xl font-bold">
                  <span className="italic text-blue-700">BCA</span> - 7881031331
                </p>
              </div>
            </div>

            <ActionButton
              method={paymentMethod}
              onSelectPaymentMethod={onSelectPaymentMethod}
              onPaymentDone={onPaymentDone}
            />
          </div>
        ) : null}

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

interface IActionButton {
  readonly method: PaymentMethodType;
  readonly onSelectPaymentMethod: (
    method: PaymentMethodType | undefined,
  ) => void;
  readonly onPaymentDone: (method: PaymentMethodType) => Promise<void>;
  readonly isCashSufficient?: boolean;
  readonly onHandleCashSufficiency?: (isSufficient: boolean) => void;
}

function ActionButton({
  method,
  onSelectPaymentMethod,
  onPaymentDone,
  isCashSufficient,
  onHandleCashSufficiency,
}: IActionButton) {
  return (
    <div className="mt-8 flex items-center justify-between">
      <Button
        size={"sm"}
        variant={"secondary"}
        className="flex w-24 items-center gap-1"
        onClick={() => {
          onSelectPaymentMethod(undefined);
          if (onHandleCashSufficiency) onHandleCashSufficiency(false);
        }}
      >
        <ArrowLeft className="h-4 w-4" />
        <p>Kembali</p>
      </Button>

      <Button
        size={"sm"}
        variant={"default"}
        className="flex w-24 items-center gap-2 font-normal"
        onClick={() => onPaymentDone(method)}
        disabled={!isCashSufficient}
      >
        <PartyPopper className="h-4 w-4" />
        <p>Selesai</p>
      </Button>
    </div>
  );
}

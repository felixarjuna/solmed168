/** biome-ignore-all lint/nursery/noShadow: <explanation> */
"use client";

import * as _ from "lodash";
import {
  Banknote,
  CircleAlert,
  CircleCheck,
  Landmark,
  QrCode,
  WalletMinimal,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
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
import type { Order } from "~/server/db/schema";
import { type PaymentMethodType, paymentMethods } from "../data";
import { safePayOrder } from "../order/_actions/order-actions";
import { useCart } from "../order/_hooks/useCart";
import {
  type PaymentDetails,
  usePrintReceipt,
} from "../order/_hooks/usePrintReceipt";
import CashPayment from "./cash-payment";
import PaymentSelectionButton from "./payment-selection-button";

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
      } else {
        toast({
          title: "Pembayaran gagal. ❌",
        });
      }
    },
  });

  const getIconFromPaymentMethod = (method: PaymentMethodType) => {
    if (method === "cash") {
      return <Banknote />;
    }
    if (method === "qris") {
      return <QrCode />;
    }
    if (method === "transfer") {
      return <Landmark />;
    }
  };

  const { onPrintCustomerReceipt } = usePrintReceipt(order.products);

  /** Method to handle payment: cash, qris, and transfer.
   * The current workflow must be executed for each transaction:
   * 1. handle payment
   * 2. save order to database if payment success
   * 3. print order invoice
   */
  const onPaymentDone = async (method: PaymentMethodType) => {
    const _order = { ...order, paymentMethod: method };
    execute(_order);

    const paymentDetails: PaymentDetails = {
      cashierName: "Nigma",
      paymentMethod: method,
      paymentTotal,
      paymentChange,
    };

    await onPrintCustomerReceipt(paymentDetails);
  };

  /** local state to check payment sufficiency. */
  const [isSufficient, setIsSufficient] = React.useState<boolean>(false);
  const onHandleCashSufficciency = (isSufficient: boolean) => {
    setIsSufficient(isSufficient);
  };

  /** local state for payment method. */
  const [paymentMethod, setPaymentMethod] =
    React.useState<PaymentMethodType>(undefined);
  const onSelectPaymentMethod = (method: PaymentMethodType) => {
    setPaymentMethod(method);

    if (method !== "cash") {
      onHandleCashSufficciency(true);
      // Reset payment details for non-cash methods
      setPaymentTotal(order.totalAmount);
      setPaymentChange(0);
    }
  };

  /** local state to track payment details for receipt */
  const [paymentTotal, setPaymentTotal] = React.useState<number>(
    order.totalAmount
  );
  const [paymentChange, setPaymentChange] = React.useState<number>(0);
  const onHandlePaymentChange = (paidAmount: number, exchange: number) => {
    setPaymentTotal(paidAmount);
    setPaymentChange(exchange);
  };

  return (
    <Drawer>
      <DrawerTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "mx-2 my-1 w-24 justify-start px-3"
        )}
      >
        <div className="flex items-center gap-2">
          <WalletMinimal className="h-4 w-4" />
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
                className="flex justify-start gap-2 rounded-lg border px-6 py-4"
                key={i.toString()}
                onClick={() => onSelectPaymentMethod(method)}
                size={"lg"}
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
              onHandleCashSufficiency={onHandleCashSufficciency}
              onPaymentChange={onHandlePaymentChange}
              totalAmount={order.totalAmount}
            />

            {isSufficient ? (
              <div
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "justify-start gap-2 bg-[#b9f4d8] text-black"
                )}
              >
                <CircleCheck className="h-4 w-4" />
                <p>Uang anda mencukupi.</p>
              </div>
            ) : (
              <div
                className={cn(
                  buttonVariants({ variant: "destructive" }),
                  "justify-start gap-2"
                )}
              >
                <CircleAlert className="h-4 w-4" />
                <p>Uang tidak mencukupi.</p>
              </div>
            )}

            <PaymentSelectionButton
              isCashSufficient={isSufficient}
              method={paymentMethod}
              onHandleCashSufficiency={onHandleCashSufficciency}
              onPaymentDone={onPaymentDone}
              onSelectPaymentMethod={onSelectPaymentMethod}
              status={status}
            />
          </div>
        ) : null}

        {paymentMethod === "qris" ? (
          <div className="grid min-w-60 gap-8">
            <div className="text-center">
              <p className="font-bold text-3xl">QRIS</p>
              <p className="font-bold text-3xl">{toRp(order.totalAmount)}</p>
            </div>

            <PaymentSelectionButton
              isCashSufficient={isSufficient}
              method={paymentMethod}
              onPaymentDone={onPaymentDone}
              onSelectPaymentMethod={onSelectPaymentMethod}
              status={status}
            />
          </div>
        ) : null}

        {paymentMethod === "transfer" ? (
          <div className="grid min-w-60 gap-4">
            <div className="text-center">
              <p>Nominal pembayaran</p>
              <p className="font-bold text-3xl">{toRp(order.totalAmount)}</p>
            </div>

            <div className="flex gap-2 text-center">
              <div>
                <p>No. Rekening pembayaran</p>
                <p className="font-bold text-3xl">
                  <span className="text-blue-700 italic">BCA</span> - XXXXXXXXXX
                </p>
              </div>
            </div>

            <PaymentSelectionButton
              isCashSufficient={isSufficient}
              method={paymentMethod}
              onPaymentDone={onPaymentDone}
              onSelectPaymentMethod={onSelectPaymentMethod}
              status={status}
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

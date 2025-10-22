/** biome-ignore-all lint/nursery/noShadow: <explanation> */
import { Br, Line, Printer, Row, render, Text } from "react-thermal-printer";
import type { PaymentMethodType, ReceiptType } from "~/app/data";
import { toast } from "~/components/ui/use-toast";
import { calculateTotal, formatDate, toRp } from "~/lib/utils";
import type { NewOrder } from "~/server/db/schema";
import type { CartItem } from "./useCart";
import { useThermalPrinterContext } from "./useThermalPrinterContext";

export type PaymentDetails = {
  readonly cashierName: string;
  readonly paymentMethod: PaymentMethodType;
  readonly paymentTotal: number;
  readonly paymentChange?: number;
};

export const usePrintReceipt = (items: CartItem[]) => {
  const {
    device,
    characteristic,
    isConnected,
    connectDevice,
    disconnectDevice,
  } = useThermalPrinterContext();

  const getReceipt = (
    receiptType: ReceiptType,
    orderDetails?: NewOrder,
    paymentDetails?: PaymentDetails
  ) => {
    const total = calculateTotal(items);
    const encoder = (text: string) => new TextEncoder().encode(text);

    if (receiptType === "client") {
      if (paymentDetails === undefined) {
        toast({
          title: "Payment details is missing.",
        });
        return;
      }

      return (
        <Printer
          characterSet="wpc1252"
          encoder={encoder}
          initialize={false}
          type="epson"
          width={32}
        >
          <Text align="center">SOLMED 168</Text>
          <Text align="center">RUKO SAN DIEGO MR2-10/87</Text>
          <Text align="center">PAKUWON CITY, SURABAYA</Text>
          <Text align="center">(031) 5929985 - (081) 287968899</Text>
          <Line />
          <Text>{formatDate(new Date())}</Text>
          <Row gap={1} left={"Kasir"} right={paymentDetails.cashierName} />
          <Line />
          {items.map((item) => {
            const amount = `${item.product.amount} x ${item.product.price}`;
            const subTotal = toRp(item.product.amount * item.product.price);

            return (
              <>
                <Text align="left">{item.product.name}</Text>
                <Row left={amount} right={subTotal} />
              </>
            );
          })}
          <Line />
          <Row left="Total" right={<Text bold>{toRp(total)}</Text>} />
          <Row
            left={`Bayar (${paymentDetails.paymentMethod})`}
            right={toRp(paymentDetails.paymentTotal)}
          />
          <Row left="Kembali" right={toRp(paymentDetails.paymentChange ?? 0)} />
          <Line />
          <Text align="center">
            TERIMA KASIH SUDAH BERKUNJUNG KE SOLMED168 PAKUWON CITY
          </Text>
          <Br />
          <Br />
        </Printer>
      );
    }

    if (orderDetails === undefined) {
      toast({
        title: "Order details is missing.",
      });
      return;
    }

    return (
      <Printer
        characterSet="wpc1252"
        encoder={encoder}
        initialize={false}
        type="epson"
        width={32}
      >
        <Text align="center">SOLMED 168</Text>
        <Text align="center">RUKO SAN DIEGO MR2-10/87</Text>
        <Text align="center">PAKUWON CITY, SURABAYA</Text>
        <Text align="center">(031) 5929985 - (081) 287968899</Text>
        <Line />
        <Text>{formatDate(new Date())}</Text>
        {orderDetails.servingMethod === "dine_in" ? (
          <Row left={"No. Meja"} right={`Meja ${orderDetails.tableId}`} />
        ) : null}
        <Row left={"Pramusaji"} right={orderDetails.waiter} />
        <Text align="right" bold>
          {orderDetails.servingMethod === "dine_in" ? "DINE IN" : "TAKEAWAY"}
        </Text>
        <Line />
        {items.map((item) => {
          const amount = `${item.product.amount} x ${item.product.price}`;
          const subTotal = toRp(item.product.amount * item.product.price);

          return (
            <>
              <Text align="left">{item.product.name}</Text>
              <Row left={amount} right={subTotal} />
            </>
          );
        })}
        <Line />
        <Row left="Total" right={<Text bold>{toRp(total)}</Text>} />
        <Br />
        <Br />
      </Printer>
    );
  };

  const onPrintInternalReceipt = async (orderDetails: NewOrder) => {
    if (!isConnected) {
      await connectDevice();
    }

    const receipt = getReceipt("internal", orderDetails, undefined);
    if (receipt === undefined) {
      toast({ title: "An error occured while printing internal receipt. " });
      return;
    }
    const data = await render(receipt);
    await print(data);
  };

  const onPrintCustomerReceipt = async (paymentDetails: PaymentDetails) => {
    if (!isConnected) {
      await connectDevice();
    }

    const receipt = getReceipt("client", undefined, paymentDetails);
    if (receipt === undefined) {
      toast({
        title: "An error occured while printing customer receipt. ",
      });
      return;
    }

    const data = await render(receipt);
    await print(data);
  };

  const print = async (data: Uint8Array) => {
    const chunkSize = 512;
    const chunks: BufferSource[] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }

    for (const chunk of chunks) {
      await characteristic?.writeValue(chunk);
    }
  };

  return {
    device,
    characteristic,
    isConnected,
    connectDevice,
    disconnectDevice,
    onPrintInternalReceipt,
    onPrintCustomerReceipt,
  };
};

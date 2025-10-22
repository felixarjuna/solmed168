/** biome-ignore-all lint/nursery/noShadow: <explanation> */
import React from "react";
import { Br, Line, Printer, Row, render, Text } from "react-thermal-printer";
import type { PaymentMethodType } from "~/app/data";
import { calculateTotal, formatDate, toRp } from "~/lib/utils";
import type { CartItem } from "./useCart";

type PaymentDetails = {
  cashierName: string;
  paymentMethod: PaymentMethodType;
  paymentTotal: number;
  paymentChange?: number;
};

const serviceId = "E7810A71-73AE-499D-8C15-FAA9AEF0C3F2".toLowerCase();
export const usePrintReceipt = (
  items: CartItem[],
  paymentDetails: PaymentDetails
) => {
  /** state to handle device status */
  const [device, setDevice] = React.useState<BluetoothDevice | undefined>(
    undefined
  );

  /** state to handle device bluetooth connection
   * connect and disconnect
   */
  const [server, setServer] = React.useState<BluetoothRemoteGATTServer>();

  const [characteristic, setCharacteristic] =
    React.useState<BluetoothRemoteGATTCharacteristic>();

  const onConnectDevice = async () => {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ name: "RPP02N" }],
      optionalServices: [serviceId],
    });
    setDevice(device);

    const server = await device.gatt?.connect();
    setServer(server);

    const service = await server?.getPrimaryService(serviceId);
    const characteristic = (await service?.getCharacteristics())?.at(0);
    setCharacteristic(characteristic);
  };

  const onDisconnectDevice = () => server?.disconnect();

  /** Method to handle invoice print.
   * 1. Connect to bluetooth thermal printer
   * device disconnected.
   * 2. Render the receipt
   * 3. Print the receipt
   */
  const onPrint = async () => {
    if (device === undefined) {
      await onConnectDevice();
    }

    const total = calculateTotal(items);
    const encoder = (text: string) => new TextEncoder().encode(text);
    const receipt = (
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
        <Br />
        <Line />
        <Text align="center">
          TERIMA KASIH SUDAH BERKUNJUNG KE SOLMED168 PAKUWON CITY
        </Text>
        <Br />
        <Br />
      </Printer>
    );
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
    onConnectDevice,
    onDisconnectDevice,
    onPrint,
  };
};

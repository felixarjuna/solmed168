import React from "react";
import { Br, Line, Printer, Row, Text, render } from "react-thermal-printer";
import { calculateTotal, formatDate, toRp } from "~/lib/utils";
import { type CartItem } from "./useCart";

const serviceId = "E7810A71-73AE-499D-8C15-FAA9AEF0C3F2".toLowerCase();
export const useThermalPrinter = (items: CartItem[]) => {
  /** state to handle device status */
  const [device, setDevice] = React.useState<BluetoothDevice | undefined>(
    undefined,
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
    if (device === undefined) await onConnectDevice();

    const total = calculateTotal(items);
    const encoder = (text: string) => new TextEncoder().encode(text);
    const receipt = (
      <Printer
        type="epson"
        width={32}
        characterSet="wpc1252"
        encoder={encoder}
        initialize={false}
      >
        <Text align="center">SOLMED 168</Text>
        <Text align="center">RUKO SAN DIEGO MR2-10/87</Text>
        <Text align="center">PAKUWON CITY, SURABAYA</Text>
        <Text align="center">(031) 5929985 - (081) 287968899</Text>
        <Line />
        <Text>Waktu Pemesanan</Text>
        <Text>{formatDate(new Date())}</Text>
        <Br />
        {items.map((item) => {
          const amount = `${item.product.amount}x`;
          const price = toRp(item.product.price);
          return (
            <Row
              key={item.product.id}
              left={amount}
              center={item.product.name}
              right={price}
              gap={1}
            />
          );
        })}
        <Br />
        <Row left="Grand Total" right={<Text bold>{toRp(total)}</Text>} />
        <Br />
        <Text align="center">HARGA SUDAH TERMASUK PAJAK</Text>
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
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.subarray(i, i + chunkSize));
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

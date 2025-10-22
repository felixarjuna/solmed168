"use client";

import { Printer } from "lucide-react";
import {
  Br,
  Line,
  Row,
  render,
  Text,
  Printer as ThermalPrinter,
} from "react-thermal-printer";
import { useThermalPrinterContext } from "~/app/order/_hooks/useThermalPrinterContext";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";
import { formatDate, toRp } from "~/lib/utils";
import type { Order } from "~/server/db/schema";

type PrintAllOrdersButtonProps = {
  readonly orders: Order[];
  readonly total: number;
};

export default function PrintAllOrdersButton({
  orders,
  total,
}: PrintAllOrdersButtonProps) {
  const { isConnected, connectDevice, characteristic } =
    useThermalPrinterContext();

  const handlePrintAll = async () => {
    try {
      if (!isConnected) {
        await connectDevice();
      }

      const encoder = (text: string) => new TextEncoder().encode(text);

      const receipt = (
        <ThermalPrinter
          characterSet="wpc1252"
          encoder={encoder}
          initialize={false}
          type="epson"
          width={32}
        >
          <Text align="center">SOLMED 168</Text>
          <Text align="center">LAPORAN HARIAN</Text>
          <Line />
          <Text>{formatDate(new Date())}</Text>
          <Text>Total Pesanan: {orders.length}</Text>
          <Line />

          {orders.map((order) => (
            <>
              <Text align="left">Order #{order.orderId}</Text>
              <Row left={`Meja ${order.tableId}`} right={order.waiter} />
              {order.products.map(({ product }) => (
                <>
                  <Text align="left">{product.name}</Text>
                  <Row
                    left={`${product.amount} x ${toRp(product.price)}`}
                    right={toRp(product.amount * product.price)}
                  />
                </>
              ))}
              <Row
                left="Subtotal"
                right={<Text bold>{toRp(order.totalAmount)}</Text>}
              />
              <Text align="center">---</Text>
            </>
          ))}

          <Line />
          <Row left="TOTAL HARI INI" right={<Text bold>{toRp(total)}</Text>} />
          <Br />
          <Br />
        </ThermalPrinter>
      );

      const data = await render(receipt);

      // Print in chunks
      const chunkSize = 512;
      const chunks: BufferSource[] = [];
      for (let i = 0; i < data.length; i += chunkSize) {
        chunks.push(data.slice(i, i + chunkSize));
      }

      for (const chunk of chunks) {
        await characteristic?.writeValue(chunk);
      }

      toast({
        title: "Laporan harian berhasil dicetak",
      });
    } catch (error) {
      toast({
        title: "Gagal mencetak laporan",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      className="flex items-center gap-2"
      onClick={handlePrintAll}
      size="sm"
      variant="default"
    >
      <Printer className="h-4 w-4" />
      <span>Cetak Pesanan</span>
    </Button>
  );
}

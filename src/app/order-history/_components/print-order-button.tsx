"use client";

import { Printer } from "lucide-react";
import { usePrintReceipt } from "~/app/order/_hooks/usePrintReceipt";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";
import { orderItemsToCartItems } from "~/lib/utils";
import type { OrderWithDetails } from "~/server/db/schema";

type PrintOrderButtonProps = {
  readonly order: OrderWithDetails;
};

export default function PrintOrderButton({ order }: PrintOrderButtonProps) {
  const cartItems = orderItemsToCartItems(order.orderItems);
  const { onPrintInternalReceipt, isConnected, connectDevice } =
    usePrintReceipt(cartItems);

  const handlePrint = async () => {
    try {
      if (!isConnected) {
        await connectDevice();
      }
      await onPrintInternalReceipt({
        tableId: order.tableId,
        waiterName: order.waiter?.name ?? "-",
        servingMethod: order.servingMethod,
      });
      toast({
        title: "Pesanan berhasil dicetak",
      });
    } catch (error) {
      toast({
        title: "Gagal mencetak pesanan",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      className="flex items-center gap-2"
      onClick={handlePrint}
      size="sm"
      variant="outline"
    >
      <Printer className="h-4 w-4" />
      <span>Cetak</span>
    </Button>
  );
}

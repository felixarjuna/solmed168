"use client";

import { ConciergeBell, Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { cartItemsToOrderItems } from "~/lib/utils";
import { safeAddOrder } from "../_actions/order-actions";
import { type CartItem, useCart } from "../_hooks/useCart";

type AddOrderButtonProps = {
  readonly tableId: number;
  readonly waiterName: string;
  readonly servingMethod: "dine_in" | "takeaway" | null | undefined;
  readonly items: CartItem[];
  readonly totalAmount: number;
};

export default function AddOrderButton({
  tableId,
  waiterName,
  servingMethod,
  items,
  totalAmount,
}: AddOrderButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { clearCart } = useCart();

  const { execute, status } = useAction(safeAddOrder, {
    onSuccess: ({ success }) => {
      if (success) {
        toast({
          title: "Pesanan berhasil. ✅",
          description: "Pesanan anda telah berhasil ditambahkan.",
        });
        clearCart();
        router.push("/order-history?active=true");
      } else {
        toast({
          title: "Pesanan gagal. ❌",
          description: "Pesanan anda gagal ditambahkan. ",
        });
      }
    },
    onError: ({ serverError, fetchError, validationErrors }) => {
      if (serverError || fetchError || validationErrors) {
        toast({
          title: "Pesanan gagal. ❌",
          description:
            serverError || fetchError || "Pesanan anda gagal ditambahkan. ",
        });
      } else {
        toast({
          title: "Pesanan gagal. ❌",
          description: "Pesanan anda gagal ditambahkan. ",
        });
      }
    },
  });

  const onAddOrder = () => {
    execute({
      tableId,
      waiterName,
      servingMethod,
      items: cartItemsToOrderItems(items),
      totalAmount,
    });
  };

  return (
    <Button onClick={onAddOrder}>
      <div className="flex h-4 items-center gap-2">
        {status === "executing" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ConciergeBell className="h-4 w-4" />
        )}
        <p>Pesan</p>
      </div>
    </Button>
  );
}

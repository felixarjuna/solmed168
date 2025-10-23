"use client";

import { Loader2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { calculateTotal } from "~/lib/utils";
import { safeUpdateOrder } from "../_actions/order-actions";
import { type CartItem, useCart } from "../_hooks/useCart";

interface IUpdateOrderButtonProps {
  readonly orderId: number;
  readonly products: CartItem[];
}

export default function UpdateOrderButton({
  orderId,
  products,
}: IUpdateOrderButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { clearCart } = useCart();

  const { execute, status } = useAction(safeUpdateOrder, {
    onSuccess: ({ success }) => {
      if (success) {
        /** show toast for success scenario, clear cart and re-route to home page */
        toast({
          title: "Update pesanan berhasil. ✅",
          description: "Pesanan anda telah berhasil diupdate.",
        });
        clearCart();
        router.push("/order-history?active=true");
      } else
        toast({
          title: "Update pesanan gagal. ❌",
          description: "Pesanan anda gagal diupdate. ",
        });
    },
    onError: () => {
      toast({
        title: "Update pesanan gagal. ❌",
        description: "Pesanan anda gagal diupdate. ",
      });
    },
  });

  const onUpdateOrder = async () => {
    execute({
      orderId,
      products,
      totalAmount: calculateTotal(products),
    });
  };

  return (
    <Button onClick={onUpdateOrder}>
      <div className="flex h-4 items-center gap-2">
        {status === "executing" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <PlusCircle className="h-4 w-4" />
        )}
        <p>Pesan</p>
      </div>
    </Button>
  );
}

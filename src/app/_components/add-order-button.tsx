"use client";

import { Loader2, ShoppingCart } from "lucide-react";
import { Button } from "~/components/ui/button";
import { NewOrder } from "~/server/db/schema";
import { useToast } from "~/components/ui/use-toast";
import { useAction } from "next-safe-action/hooks";
import { safeAddOrder } from "../order/_actions/order-actions";
import { useRouter } from "next/navigation";
import { useCart } from "../order/_hooks/useCart";

interface AddOrderButtonProps {
  readonly order: NewOrder;
}

export default function AddOrderButton({ order }: AddOrderButtonProps) {
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

  return (
    <Button
      className="flex w-fit items-center gap-2"
      onClick={() => execute(order)}
      disabled={status === "executing"}
    >
      <div className="flex items-center gap-2">
        {status === "executing" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ShoppingCart className="h-4 w-4" />
        )}
        <p>Selesai</p>
      </div>
    </Button>
  );
}

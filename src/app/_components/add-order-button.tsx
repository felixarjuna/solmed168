"use client";

import { Loader2, ShoppingCart } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { type NewOrder } from "~/server/db/schema";
import { safeAddOrder } from "../order/_actions/order-actions";
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
      <div className="flex h-4 items-center gap-2">
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

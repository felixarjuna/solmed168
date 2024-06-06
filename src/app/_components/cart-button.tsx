"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { useCart } from "../order/_hooks/useCart";
import { useToast } from "~/components/ui/use-toast";

interface CartButtonProps {
  readonly text: string;
}

export default function CartButton({ text }: CartButtonProps) {
  const { items } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  return (
    <Button
      className="flex w-full items-center gap-2"
      onClick={() => {
        /** cart validation.
         * Disallow user to continue if it the cart is empty.
         */
        if (items.length === 0) {
          toast({
            title: "Tidak ada pesanan dalam keranjang.",
            description: "Tambahkan pesanan dalam keranjang untuk melanjutkan.",
            variant: "destructive",
          });
          return;
        }
        router.push("/order");
      }}
    >
      <ShoppingCart className="h-4 w-4" />
      <p>{text}</p>
    </Button>
  );
}

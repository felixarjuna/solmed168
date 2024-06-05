"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "~/components/ui/button";
import addOrder from "../order/_actions/order-actions";
import { NewOrder } from "~/server/db/schema";
import { useToast } from "~/components/ui/use-toast";

interface AddOrderButtonProps {
  readonly order: NewOrder;
}

export default function AddOrderButton({ order }: AddOrderButtonProps) {
  const { toast } = useToast();
  return (
    <Button
      className="flex w-full items-center gap-2"
      onClick={async () => {
        const res = await addOrder(order);
        if (res == "successfull")
          toast({
            title: "Pesanan berhasil. ✅",
            description: "Pesanan anda telah berhasil ditambahkan.",
          });
        else
          toast({
            title: "Pesanan gagal. ❌",
            description: "Pesanan anda gagal ditambahkan. ",
          });
      }}
    >
      <ShoppingCart className="h-4 w-4" />
      <p>Selesai</p>
    </Button>
  );
}
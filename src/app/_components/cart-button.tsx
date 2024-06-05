"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

interface CartButtonProps {
  readonly text: string;
}

export default function CartButton({ text }: CartButtonProps) {
  const router = useRouter();

  return (
    <Button
      className="flex w-full items-center gap-2"
      onClick={() => router.push("/cart")}
    >
      <ShoppingCart className="h-4 w-4" />
      <p>{text}</p>
    </Button>
  );
}

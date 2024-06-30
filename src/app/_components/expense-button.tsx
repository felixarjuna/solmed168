"use client";

import { ReceiptText } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function ExpenseButton() {
  const router = useRouter();
  return (
    <Button
      size={"icon"}
      variant={"outline"}
      onClick={() => router.push("/expense")}
    >
      <ReceiptText className="h-4 w-4" />
    </Button>
  );
}

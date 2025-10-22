"use client";

import { ReceiptText } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function ExpenseButton() {
  const router = useRouter();
  return (
    <Button
      className="flex items-center gap-1"
      onClick={() => router.push("/expense")}
      size={"sm"}
      variant={"outline"}
    >
      <ReceiptText className="h-4 w-4" />
      <p>Expense</p>
    </Button>
  );
}

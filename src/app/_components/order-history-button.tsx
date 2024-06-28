"use client";

import { FileStack } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function OrderHistoryButton() {
  const router = useRouter();

  return (
    <Button
      variant={"outline"}
      size={"sm"}
      className="flex  items-center gap-1"
      onClick={() => router.push("/order-history")}
    >
      <FileStack className="h-4 w-4" />
      <p>History</p>
    </Button>
  );
}

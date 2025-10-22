"use client";

import { FileClock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function ActiveOrderButton() {
  const router = useRouter();

  return (
    <Button
      className="relative flex items-center gap-1"
      onClick={() => router.push("/order-history?active=true")}
      size={"sm"}
      variant={"outline"}
    >
      <FileClock className="h-4 w-4" />
      <p>Pending</p>
    </Button>
  );
}

"use client";

import { FileClock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function ActiveOrderButton() {
  const router = useRouter();

  return (
    <Button
      variant={"outline"}
      size={"sm"}
      className="relative flex items-center gap-1"
      onClick={() => router.push("/order-history?active=true")}
    >
      <FileClock className="h-4 w-4" />
      <span className="absolute -right-1 -top-1 flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full  animate-ping rounded-full bg-cyan-400 opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-400"></span>
      </span>
      <p>Pending</p>
    </Button>
  );
}

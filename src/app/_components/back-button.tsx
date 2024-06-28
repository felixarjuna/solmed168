"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant={"outline"}
      size={"default"}
      className="gap-1 self-end"
      onClick={() => router.push("/")}
    >
      <ArrowLeft className="h-4 w-4" />
      <span>Kembali</span>
    </Button>
  );
}

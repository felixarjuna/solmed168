"use client";

import { Pen } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

interface IEditOrderButtonProps {
  readonly orderId: number;
}

export default function EditOrderButton({ orderId }: IEditOrderButtonProps) {
  const router = useRouter();

  return (
    <Button
      className="flex w-24 items-center justify-start gap-2"
      size={"sm"}
      variant={"outline"}
      onClick={() => router.push(`/?orderId=${orderId}`)}
    >
      <Pen className="h-4 w-4" />
      Edit
    </Button>
  );
}

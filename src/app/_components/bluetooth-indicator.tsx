"use client";

import { BluetoothIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useThermalPrinterContext } from "../order/_hooks/useThermalPrinterContext";

export default function BluetoothIndicator() {
  const { isConnected, connectDevice } = useThermalPrinterContext();

  console.log(isConnected);
  return (
    <Button
      className="relative"
      onClick={() => connectDevice()}
      size={"icon"}
      variant={"default"}
    >
      <BluetoothIcon className="h-4 w-4" />
      <span className="-right-1 -top-1 absolute flex h-3 w-3">
        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full bg-neutral-400 opacity-75",
            {
              "animate-ping bg-cyan-400": isConnected,
            }
          )}
        />
        <span
          className={cn(
            "relative inline-flex h-3 w-3 rounded-full bg-neutral-400",
            {
              "bg-cyan-400": isConnected,
            }
          )}
        />
      </span>
    </Button>
  );
}

"use client";

import { Package, Utensils } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { ServingMethodType } from "../data";

type ServingMethodToggleProps = {
  readonly itemId: string;
  readonly currentMethod: ServingMethodType | undefined;
  readonly onToggle: (itemId: string, newMethod: ServingMethodType) => void;
};

export default function ServingMethodToggle({
  itemId,
  currentMethod,
  onToggle,
}: ServingMethodToggleProps) {
  const handleToggle = () => {
    const newMethod: ServingMethodType =
      currentMethod === "dine_in" ? "takeaway" : "dine_in";
    onToggle(itemId, newMethod);
  };

  const isDineIn = currentMethod === "dine_in";

  return (
    <Button
      className={cn(
        "h-7 w-fit gap-1 px-2 text-xs",
        isDineIn
          ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
          : "bg-orange-100 text-orange-700 hover:bg-orange-200"
      )}
      onClick={handleToggle}
      size="sm"
      type="button"
      variant="ghost"
    >
      {isDineIn ? (
        <>
          <Utensils className="h-3 w-3" />
          <span>Dine-in</span>
        </>
      ) : (
        <>
          <Package className="h-3 w-3" />
          <span>Takeaway</span>
        </>
      )}
    </Button>
  );
}

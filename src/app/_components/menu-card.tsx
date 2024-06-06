"use client";

import { Button, buttonVariants } from "~/components/ui/button";
import { SetMenuType } from "../menu";
import { Minus, Plus } from "lucide-react";
import React from "react";
import { useCart } from "../order/_hooks/useCart";
import { cn } from "~/lib/utils";

interface MenuCardProps {
  readonly menu: SetMenuType;
  readonly amount?: number;
  readonly isAdjustable?: boolean;
  readonly hasCartButton?: boolean;
}

export default function MenuCard({
  menu,
  amount: itemAmount,
  isAdjustable,
  hasCartButton,
}: MenuCardProps) {
  /** state to handle timeout when adding item to the cart */
  const [isAdded, setIsAdded] = React.useState<boolean>(false);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setIsAdded(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isAdded]);

  /** state to handle the amount of items */
  const [amount, setAmount] = React.useState<number>(
    itemAmount ? itemAmount : 1,
  );
  const total = amount * menu.price;

  const { addItem } = useCart();

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-neutral-200/30 p-4">
      <div className="flex flex-col">
        <h1 className="font-bold">{menu.name}</h1>
        <p className="text-wrap text-xs">{menu.description}</p>
        <div className="flex items-center justify-between">
          <p className="mt-2 text-sm">Rp. {total}</p>
          <div className="mt-1 flex items-center justify-end gap-2">
            {isAdjustable ? (
              <>
                <Button variant={"outline"} size={"icon"} className="h-6 w-6">
                  <Minus
                    className="h-4 w-4"
                    onClick={() => {
                      if (amount > 1) setAmount((prev) => prev - 1);
                    }}
                  />
                </Button>
                <span className="text-sm">{amount}</span>
                <Button variant={"outline"} size={"icon"} className="h-6 w-6">
                  <Plus
                    className="h-4 w-4"
                    onClick={() => setAmount((prev) => prev + 1)}
                  />
                </Button>
              </>
            ) : (
              <span
                className={cn(
                  buttonVariants({ size: "icon", variant: "outline" }),
                  "h-6 w-6 text-sm",
                )}
              >
                {amount}
              </span>
            )}
          </div>
        </div>
      </div>
      {hasCartButton ? (
        <Button
          variant={"default"}
          size={"sm"}
          onClick={() => {
            addItem(menu, amount);
            setIsAdded(true);
          }}
          disabled={isAdded}
        >
          {isAdded ? "Berhasil di tambahkan! ✅" : "Tambah"}
        </Button>
      ) : null}
    </div>
  );
}

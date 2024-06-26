import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "~/components/ui/button";
import { toRp } from "~/lib/utils";
import { type ProductType } from "../data";
import { useCart } from "../order/_hooks/useCart";

interface CartMenuCardProps {
  readonly menu: ProductType;
  readonly amount: number;
}

export default function CartMenuCard({ menu, amount }: CartMenuCardProps) {
  const { updateAmount, removeItem } = useCart();

  const total = amount * menu.price;

  return (
    <section className="flex flex-col gap-4 rounded-lg bg-neutral-200/30 p-4">
      <section className="flex flex-col">
        <h1 className="text-left font-bold">{menu.name}</h1>
        <p className="text-wrap text-left text-xs">{menu.description}</p>

        <section className="flex items-center justify-between">
          <p className="mt-2 text-sm">{toRp(total)}</p>
          <p className="mt-1 flex items-center justify-end gap-2">
            <Button variant={"outline"} size={"icon"} className="h-6 w-6">
              <Minus
                className="h-4 w-4"
                onClick={() => {
                  updateAmount(menu.id, "decrement");
                }}
              />
            </Button>
            <span className="text-sm">{amount}</span>
            <Button variant={"outline"} size={"icon"} className="h-6 w-6">
              <Plus
                className="h-4 w-4"
                onClick={() => updateAmount(menu.id, "increment")}
              />
            </Button>

            <Button
              variant={"outline"}
              size={"icon"}
              className="h-6 w-6"
              onClick={() => removeItem(menu.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </p>
        </section>
      </section>
    </section>
  );
}

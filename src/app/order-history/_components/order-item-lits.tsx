import { HandPlatter, Package } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { toRp } from "~/lib/utils";
import type {
  OrderItemWithProduct,
  OrderWithDetails,
} from "~/server/db/schema";
import OrderItemRow from "./order-item-row";
import PrintOrderButton from "./print-order-button";

export default function OrderItemsList({
  items,
  totalAmount,
  order,
}: {
  items: OrderItemWithProduct[];
  totalAmount: number;
  order: OrderWithDetails;
}) {
  const methods = new Set(
    items
      .filter((item) => item.productName !== "Takeaway Box")
      .map((item) => item.servingMethod)
  );
  const isMixed = methods.size > 1;

  if (!isMixed) {
    return (
      <div className="my-4">
        {items.map((item) => (
          <OrderItemRow item={item} key={item.orderItemId} />
        ))}
        <div className="flex items-center justify-between">
          <p className="font-bold">{toRp(totalAmount)}</p>
          <PrintOrderButton order={order} />
        </div>
      </div>
    );
  }

  const dineInItems = items.filter(
    (item) =>
      item.servingMethod === "dine_in" && item.productName !== "Takeaway Box"
  );
  const takeawayItems = items.filter(
    (item) =>
      item.servingMethod === "takeaway" || item.productName === "Takeaway Box"
  );

  return (
    <div className="my-4 flex flex-col gap-3">
      {dineInItems.length > 0 ? (
        <div>
          <Badge className="mb-1 flex w-fit items-center gap-2">
            <HandPlatter className="aspect-square h-4 w-4" />
            <p className="font-bold">Dine in</p>
          </Badge>
          {dineInItems.map((item) => (
            <OrderItemRow item={item} key={item.orderItemId} />
          ))}
        </div>
      ) : null}

      {takeawayItems.length > 0 ? (
        <div>
          <Badge className="mb-1 flex w-fit items-center gap-2">
            <Package className="aspect-square h-4 w-4" />
            <p className="font-bold">Takeaway</p>
          </Badge>
          {takeawayItems.map((item) => (
            <OrderItemRow item={item} key={item.orderItemId} />
          ))}
        </div>
      ) : null}

      <div className="flex items-center justify-between">
        <p className="font-bold">{toRp(totalAmount)}</p>
        <PrintOrderButton order={order} />
      </div>
    </div>
  );
}

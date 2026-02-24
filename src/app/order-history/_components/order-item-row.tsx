import { toRp } from "~/lib/utils";
import type { OrderItemWithProduct } from "~/server/db/schema";

export default function OrderItemRow({ item }: { item: OrderItemWithProduct }) {
  return (
    <div className="grid grid-cols-10 gap-2" key={item.orderItemId}>
      <p className="col-span-1">{item.quantity}x</p>
      <div className="col-span-6 flex flex-col gap-x-2">
        <p>{item.productName}</p>
        <p className="text-xs">{toRp(item.unitPrice)}</p>
      </div>
      <p className="col-span-3 text-right">{toRp(item.lineTotal)}</p>
    </div>
  );
}

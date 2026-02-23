import { z } from "zod";

const OrderItemInput = z.object({
  productName: z.string(),
  unitPrice: z.number(),
  quantity: z.number(),
  lineTotal: z.number(),
  servingMethod: z.enum(["dine_in", "takeaway"]).nullable().optional(),
  productId: z.string().optional(),
});

export type OrderItemInput = z.infer<typeof OrderItemInput>;

export const AddOrderValidator = z.object({
  tableId: z.number(),
  waiterName: z.string(),
  items: z.array(OrderItemInput),
  totalAmount: z.number(),
  servingMethod: z.enum(["dine_in", "takeaway"]).nullable().optional(),
});

export const PayOrderValidator = z.object({
  orderId: z.number(),
  paymentMethod: z.enum(["cash", "qris", "transfer"]),
  amount: z.number(),
});

export const UpdateOrderValidator = z.object({
  orderId: z.number(),
  items: z.array(OrderItemInput),
  totalAmount: z.number(),
});

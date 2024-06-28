import { z } from "zod";

export const AddOrderValidator = z.object({
  tableId: z.number(),
  totalAmount: z.number(),
  products: z.array(
    z.object({
      product: z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        amount: z.number(),
      }),
    }),
  ),
  paymentMethod: z.enum(["cash", "qris", "transfer"]),
  servingMethod: z.enum(["dine_in", "takeaway"]).nullable().optional(),
  waiter: z.string(),
});

export const PayOrderValidator = z.object({
  orderId: z.number(),
  paymentMethod: z.enum(["cash", "qris", "transfer"]),
});

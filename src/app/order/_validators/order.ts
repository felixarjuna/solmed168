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
});

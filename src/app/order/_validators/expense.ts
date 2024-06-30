import { z } from "zod";

export const AddExpenseValidator = z.object({
  name: z.string().min(2).max(50),
  description: z.string(),
  amount: z.number(),
});

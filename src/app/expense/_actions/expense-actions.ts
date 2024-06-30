"use server";

import { revalidatePath } from "next/cache";
import { action } from "~/app/order/_actions/root";
import { AddExpenseValidator } from "~/app/order/_validators/expense";
import { db } from "~/server/db";
import { expenses } from "~/server/db/schema";

export const safeAddExpense = action(AddExpenseValidator, async (expense) => {
  await db.insert(expenses).values(expense);

  revalidatePath("/expense");
  return { success: true };
});

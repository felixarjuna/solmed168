"use server";

import { and, gt, lt, type SQLWrapper } from "drizzle-orm";
import { DateTime } from "luxon";
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

export const getExpenses = async () => {
  const startOfMonth = DateTime.now().startOf("month");
  const endOfMonth = DateTime.now().endOf("month");

  const filters: SQLWrapper[] = [
    gt(expenses.date, startOfMonth.toJSDate()),
    lt(expenses.date, endOfMonth.toJSDate()),
  ];

  const query = db
    .select()
    .from(expenses)
    .where(and(...filters));

  return await query;
};

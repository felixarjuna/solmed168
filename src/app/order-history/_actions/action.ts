"use server";

import { and, eq, gt, lt, type SQLWrapper } from "drizzle-orm";
import { DateTime } from "luxon";
import { db } from "~/server/db";
import { orders } from "~/server/db/schema";

/** method to return all today orders */
export async function getOrders(isActive: boolean) {
  const startOfDay = DateTime.now().startOf("day");
  const startOfTomorrow = startOfDay.plus({ day: 1 });

  const filters: SQLWrapper[] = [
    gt(orders.orderDate, startOfDay.toJSDate()),
    lt(orders.orderDate, startOfTomorrow.toJSDate()),
  ];

  if (isActive) filters.push(eq(orders.paid, false));
  else filters.push(eq(orders.paid, true));

  const query = db
    .select()
    .from(orders)
    .where(and(...filters));

  return await query;
}

export async function getOrderById(orderId: number) {
  const query = db.query.orders.findFirst({
    where: eq(orders.orderId, orderId),
  });

  return await query;
}

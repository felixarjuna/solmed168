"use server";

import { and, eq, gt, lt, type SQLWrapper } from "drizzle-orm";
import { DateTime } from "luxon";
import { db } from "~/server/db";
import { orders } from "~/server/db/schema";

export async function getOrders(isActive: boolean) {
  const startOfDay = DateTime.now().startOf("day");
  const startOfTomorrow = startOfDay.plus({ day: 1 });

  const filters: SQLWrapper[] = [
    gt(orders.orderDate, startOfDay.toJSDate()),
    lt(orders.orderDate, startOfTomorrow.toJSDate()),
  ];

  if (isActive) filters.push(eq(orders.paid, false));
  else filters.push(eq(orders.paid, true));

  return db.query.orders.findMany({
    where: and(...filters),
    with: {
      orderItems: { with: { product: true } },
      waiter: true,
      orderPayments: true,
    },
  });
}

export async function getOrderById(orderId: number) {
  return db.query.orders.findFirst({
    where: eq(orders.orderId, orderId),
    with: {
      orderItems: { with: { product: true } },
      waiter: true,
      orderPayments: true,
    },
  });
}

"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { orders } from "~/server/db/schema";
import {
  AddOrderValidator,
  PayOrderValidator,
  UpdateOrderValidator,
} from "../_validators/order";
import { action } from "./root";

export const safeAddOrder = action(AddOrderValidator, async (order) => {
  await db.insert(orders).values(order);

  revalidatePath("/order-history");
  return { success: true };
});

export const safePayOrder = action(PayOrderValidator, async (order) => {
  await db
    .update(orders)
    .set({ paymentMethod: order.paymentMethod, paid: true })
    .where(eq(orders.orderId, order.orderId));

  revalidatePath("/order-history");
  return { success: true };
});

export const safeUpdateOrder = action(UpdateOrderValidator, async (order) => {
  await db
    .update(orders)
    .set({ products: order.products, totalAmount: order.totalAmount })
    .where(eq(orders.orderId, order.orderId));

  revalidatePath("/order-history");
  return { success: true };
});

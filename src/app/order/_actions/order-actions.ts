"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { db } from "~/server/db";
import { orderItems, orderPayments, orders, waiters } from "~/server/db/schema";
import {
  AddOrderValidator,
  PayOrderValidator,
  UpdateOrderValidator,
} from "../_validators/order";

type AddOrderInput = z.infer<typeof AddOrderValidator>;
type UpdateOrderInput = z.infer<typeof UpdateOrderValidator>;

import { action } from "./root";

export const safeAddOrder = action(
  AddOrderValidator,
  async (input: AddOrderInput) => {
    const waiter = await db.query.waiters.findFirst({
      where: eq(waiters.name, input.waiterName),
    });

    if (!waiter) {
      throw new Error(
        `Waiter "${input.waiterName}" tidak ditemukan. Pastikan data waiter sudah di-seed.`
      );
    }

    const lastOrder = await db.query.orders.findFirst({
      orderBy: [desc(orders.orderId)],
    });
    const nextNum = (lastOrder?.orderId ?? 0) + 1;
    const orderNumber = `#${nextNum.toString().padStart(4, "0")}`;

    const [newOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        tableId: input.tableId,
        waiterId: waiter.waiterId,
        subtotal: input.totalAmount,
        totalAmount: input.totalAmount,
        servingMethod: input.servingMethod,
      })
      .returning();

    if (newOrder) {
      await db.insert(orderItems).values(
        input.items.map((item) => ({
          orderId: newOrder.orderId,
          productName: item.productName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          lineTotal: item.lineTotal,
          servingMethod: item.servingMethod,
        }))
      );
    }

    revalidatePath("/order-history");
    return { success: true };
  }
);

export const safePayOrder = action(PayOrderValidator, async (input) => {
  await db.insert(orderPayments).values({
    orderId: input.orderId,
    paymentMethod: input.paymentMethod,
    amount: input.amount,
  });

  await db
    .update(orders)
    .set({ paid: true, paidAt: new Date(), status: "paid" })
    .where(eq(orders.orderId, input.orderId));

  revalidatePath("/order-history");
  return { success: true };
});

export const safeUpdateOrder = action(
  UpdateOrderValidator,
  async (input: UpdateOrderInput) => {
    await db.delete(orderItems).where(eq(orderItems.orderId, input.orderId));

    await db.insert(orderItems).values(
      input.items.map((item) => ({
        orderId: input.orderId,
        productName: item.productName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
        servingMethod: item.servingMethod,
      }))
    );

    await db
      .update(orders)
      .set({ subtotal: input.totalAmount, totalAmount: input.totalAmount })
      .where(eq(orders.orderId, input.orderId));

    revalidatePath("/order-history");
    return { success: true };
  }
);

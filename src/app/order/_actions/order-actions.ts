"use server";

import { db } from "~/server/db";
import { orders } from "~/server/db/schema";
import { action } from "./root";
import { AddOrderValidator } from "../_validators/order";
import { revalidatePath } from "next/cache";

export const safeAddOrder = action(AddOrderValidator, async (order) => {
  await db.insert(orders).values(order);
  revalidatePath("/order-history");
  return { success: true };
});

"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { orders } from "~/server/db/schema";
import { AddOrderValidator } from "../_validators/order";
import { action } from "./root";

export const safeAddOrder = action(AddOrderValidator, async (order) => {
  console.log(order);
  await db.insert(orders).values(order);
  revalidatePath("/order-history");
  return { success: true };
});

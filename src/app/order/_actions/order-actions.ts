"use server";

import { db } from "~/server/db";
import { orders } from "~/server/db/schema";
import { action } from "./root";
import { AddOrderValidator } from "../_validators/order";

export const safeAddOrder = action(AddOrderValidator, async (order) => {
  await db.insert(orders).values(order);
  return { success: true };
});

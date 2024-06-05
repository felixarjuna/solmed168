"use server";

import { db } from "~/server/db";
import { NewOrder, orders } from "~/server/db/schema";

export default async function addOrder(order: NewOrder) {
  try {
    await db.insert(orders).values(order);
    return "successfull";
  } catch {}
}

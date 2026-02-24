"use server";

import { db } from "~/server/db";
import type { Waiter } from "~/server/db/schema";

export async function getWaiters(): Promise<Waiter[]> {
  return await db.query.waiters.findMany();
}

export async function getWaiterByName(name: string) {
  return await db.query.waiters.findFirst({
    where: (waiters, { eq }) => eq(waiters.name, name),
  });
}

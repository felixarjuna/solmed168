"use server";

import { db } from "~/server/db";

export async function getTables() {
  return await db.query.tables.findMany();
}

export async function getTableById(id: number) {
  return await db.query.tables.findFirst({
    where: (tables, { eq }) => eq(tables.tableId, id),
  });
}

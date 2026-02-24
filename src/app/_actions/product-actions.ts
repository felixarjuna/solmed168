"use server";

import { and, asc, eq, isNull } from "drizzle-orm";
import { db } from "~/server/db";
import { type ProductType, products } from "~/server/db/schema";

export async function getProductsByCategory(
  category: "food" | "beverage" | "snack" | "addon"
): Promise<ProductType[]> {
  const rows = await db.query.products.findMany({
    where: and(
      eq(products.category, category),
      eq(products.isAvailable, true),
      isNull(products.deletedAt)
    ),
    orderBy: [asc(products.displayOrder)],
  });

  return rows.map((row) => ({
    id: row.productId,
    name: row.name,
    price: row.price,
    type: row.type as ProductType["type"],
    description: row.description ?? undefined,
  }));
}

export async function getAllProducts(): Promise<{
  foods: ProductType[];
  beverages: ProductType[];
  snacks: ProductType[];
}> {
  const [foods, beverages, snacks] = await Promise.all([
    getProductsByCategory("food"),
    getProductsByCategory("beverage"),
    getProductsByCategory("snack"),
  ]);

  return { foods, beverages, snacks };
}

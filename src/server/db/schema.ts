// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  decimal,
  integer,
  json,
  pgEnum,
  pgTableCreator,
  serial,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { CartItemExtended } from "~/app/cart/_hooks/useCart";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `solmed168_${name}`);

export const productCategoryEnum = pgEnum("category", [
  "food",
  "beverage",
  "snack",
]);
export const product = createTable("product", {
  productId: uuid("id").primaryKey(),
  price: integer("price"),
  category: productCategoryEnum("category"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const order = createTable("order", {
  orderId: serial("id").primaryKey(),
  tableId: integer("table_id"),
  orderDate: timestamp("order_date", { withTimezone: true }).defaultNow(),
  totalAmount: decimal("total_amount"),
  products: json("products").$type<CartItemExtended>().notNull(),
});

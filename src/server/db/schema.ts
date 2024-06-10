// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  integer,
  json,
  pgEnum,
  pgTableCreator,
  serial,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { type CartItem } from "~/app/order/_hooks/useCart";

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
export const products = createTable("product", {
  productId: uuid("id").primaryKey(),
  price: integer("price"),
  category: productCategoryEnum("category"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export type NewOrder = typeof orders.$inferInsert;
const servingMethodTypeEnum = pgEnum("serving_type", ["dine_in", "takeaway"]);
const paymentMethodTypeEnum = pgEnum("payment_type", [
  "cash",
  "qris",
  "transfer",
]);
export const orders = createTable("order", {
  orderId: serial("id").primaryKey(),
  tableId: integer("table_id").notNull(),
  orderDate: timestamp("order_date", { withTimezone: true }).defaultNow(),
  totalAmount: integer("total_amount").notNull(),
  products: json("products").$type<CartItem[]>().notNull(),
  paymentMethod: paymentMethodTypeEnum("payment_method"),
  servingMethod: servingMethodTypeEnum("serving_type"),
});

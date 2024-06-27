// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  boolean,
  integer,
  json,
  pgEnum,
  pgTableCreator,
  serial,
  timestamp,
  uuid,
  varchar,
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
export type Order = typeof orders.$inferSelect;
export const servingMethodEnum = pgEnum("serving_method", [
  "dine_in",
  "takeaway",
]);
export const paymentMethodEnum = pgEnum("payment_method", [
  "cash",
  "qris",
  "transfer",
]);
export const orders = createTable("order", {
  orderId: serial("id").primaryKey(),
  tableId: integer("table_id").notNull(),
  orderDate: timestamp("order_date", { withTimezone: true })
    .notNull()
    .defaultNow(),
  servant: varchar("servant").notNull(),
  totalAmount: integer("total_amount").notNull(),
  products: json("products").$type<CartItem[]>().notNull(),
  paymentMethod: paymentMethodEnum("payment_method"),
  servingMethod: servingMethodEnum("serving_method"),
  paid: boolean("paid").notNull().default(false),
});

import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTableCreator,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Multi-project schema prefix
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `solmed168_${name}`);

// ─── Enums ───────────────────────────────────────────────────────────────────

export const productCategoryEnum = pgEnum("product_category", [
  "food",
  "beverage",
  "snack",
  "addon",
]);

export const servingMethodEnum = pgEnum("serving_method", [
  "dine_in",
  "takeaway",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "cash",
  "qris",
  "transfer",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "cancelled",
  "refunded",
]);

export const discountTypeEnum = pgEnum("discount_type", [
  "percentage",
  "fixed_amount",
]);

export const tableStatusEnum = pgEnum("table_status", [
  "available",
  "occupied",
  "reserved",
  "unavailable",
]);

export const stockMovementEnum = pgEnum("stock_movement", [
  "sale",
  "restock",
  "adjustment",
  "waste",
  "return",
]);

// ─── Tables ──────────────────────────────────────────────────────────────────

// 1. Products
export const products = createTable(
  "product",
  {
    productId: uuid("product_id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    price: integer("price").notNull(),
    category: productCategoryEnum("category").notNull(),
    type: text("type"),
    trackInventory: boolean("track_inventory").notNull().default(true),
    stockQuantity: integer("stock_quantity").default(0),
    lowStockThreshold: integer("low_stock_threshold").default(10),
    isAvailable: boolean("is_available").notNull().default(true),
    displayOrder: integer("display_order").default(0),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    index("product_category_idx").on(t.category),
    index("product_is_available_idx").on(t.isAvailable),
  ]
);

// 2. Customers
export const customers = createTable(
  "customer",
  {
    customerId: uuid("customer_id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    phoneNumber: text("phone_number").notNull().unique(),
    email: text("email"),
    loyaltyPoints: integer("loyalty_points").notNull().default(0),
    totalOrders: integer("total_orders").notNull().default(0),
    totalSpent: integer("total_spent").notNull().default(0),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [uniqueIndex("customer_phone_idx").on(t.phoneNumber)]
);

// 3. Tables
export const tables = createTable("table", {
  tableId: serial("table_id").primaryKey(),
  tableNumber: integer("table_number").notNull().unique(),
  capacity: integer("capacity").notNull().default(4),
  section: text("section"),
  status: tableStatusEnum("status").notNull().default("available"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// 4. Waiters
export const waiters = createTable("waiter", {
  waiterId: uuid("waiter_id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  phoneNumber: text("phone_number"),
  employeeCode: text("employee_code").unique(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// 5. Orders
export const orders = createTable(
  "order",
  {
    orderId: serial("order_id").primaryKey(),
    orderNumber: text("order_number").notNull().unique(),
    tableId: integer("table_id").references(() => tables.tableId),
    waiterId: uuid("waiter_id")
      .notNull()
      .references(() => waiters.waiterId),
    customerId: uuid("customer_id").references(() => customers.customerId),
    orderDate: timestamp("order_date", { withTimezone: true })
      .notNull()
      .defaultNow(),
    subtotal: integer("subtotal").notNull(),
    taxRate: integer("tax_rate").default(0),
    taxAmount: integer("tax_amount").notNull().default(0),
    serviceChargeRate: integer("service_charge_rate").default(0),
    serviceChargeAmount: integer("service_charge_amount").notNull().default(0),
    discountAmount: integer("discount_amount").notNull().default(0),
    totalAmount: integer("total_amount").notNull(),
    servingMethod: servingMethodEnum("serving_method"),
    status: orderStatusEnum("status").notNull().default("pending"),
    paid: boolean("paid").notNull().default(false),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("order_date_idx").on(t.orderDate),
    index("order_status_idx").on(t.status),
    index("order_paid_idx").on(t.paid),
    index("order_customer_idx").on(t.customerId),
    index("order_table_idx").on(t.tableId),
    index("order_date_paid_idx").on(t.orderDate, t.paid),
  ]
);

// 6. Order Items
export const orderItems = createTable(
  "order_item",
  {
    orderItemId: uuid("order_item_id").primaryKey().defaultRandom(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.orderId, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.productId),
    productName: text("product_name").notNull(),
    unitPrice: integer("unit_price").notNull(),
    quantity: integer("quantity").notNull(),
    servingMethod: servingMethodEnum("serving_method"),
    lineTotal: integer("line_total").notNull(),
    discountAmount: integer("discount_amount").default(0),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [
    index("order_item_order_idx").on(t.orderId),
    index("order_item_product_idx").on(t.productId),
  ]
);

// 7. Order Payments
export const orderPayments = createTable(
  "order_payment",
  {
    paymentId: uuid("payment_id").primaryKey().defaultRandom(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.orderId, { onDelete: "cascade" }),
    paymentMethod: paymentMethodEnum("payment_method").notNull(),
    amount: integer("amount").notNull(),
    referenceNumber: text("reference_number"),
    notes: text("notes"),
    paidAt: timestamp("paid_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [
    index("payment_order_idx").on(t.orderId),
    index("payment_method_idx").on(t.paymentMethod),
    index("payment_paid_at_idx").on(t.paidAt),
  ]
);

// 8. Promotions
export const promotions = createTable("promotion", {
  promotionId: uuid("promotion_id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  discountType: discountTypeEnum("discount_type").notNull(),
  discountValue: integer("discount_value").notNull(),
  minPurchaseAmount: integer("min_purchase_amount").default(0),
  maxDiscountAmount: integer("max_discount_amount"),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").notNull().default(0),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// 9. Order Promotions (junction)
export const orderPromotions = createTable("order_promotion", {
  orderPromotionId: uuid("order_promotion_id").primaryKey().defaultRandom(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.orderId, { onDelete: "cascade" }),
  promotionId: uuid("promotion_id")
    .notNull()
    .references(() => promotions.promotionId),
  discountAmount: integer("discount_amount").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// 10. Stock Movements
export const stockMovements = createTable(
  "stock_movement",
  {
    movementId: uuid("movement_id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.productId),
    movementType: stockMovementEnum("movement_type").notNull(),
    quantity: integer("quantity").notNull(),
    stockAfter: integer("stock_after").notNull(),
    referenceId: text("reference_id"),
    referenceType: text("reference_type"),
    performedBy: text("performed_by"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("stock_movement_product_idx").on(t.productId),
    index("stock_movement_created_idx").on(t.createdAt),
    index("stock_movement_type_idx").on(t.movementType),
  ]
);

// 11. Expenses
export const expenses = createTable(
  "expense",
  {
    expenseId: serial("expense_id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    amount: integer("amount").notNull(),
    category: text("category"),
    recordedBy: text("recorded_by"),
    expenseDate: timestamp("expense_date", { withTimezone: true })
      .notNull()
      .defaultNow(),
    receiptUrl: text("receipt_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("expense_date_idx").on(t.expenseDate),
    index("expense_category_idx").on(t.category),
  ]
);

// ─── Relations ───────────────────────────────────────────────────────────────

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
  stockMovements: many(stockMovements),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
}));

export const tablesRelations = relations(tables, ({ many }) => ({
  orders: many(orders),
}));

export const waitersRelations = relations(waiters, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  table: one(tables, {
    fields: [orders.tableId],
    references: [tables.tableId],
  }),
  waiter: one(waiters, {
    fields: [orders.waiterId],
    references: [waiters.waiterId],
  }),
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.customerId],
  }),
  orderItems: many(orderItems),
  orderPayments: many(orderPayments),
  orderPromotions: many(orderPromotions),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.orderId],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.productId],
  }),
}));

export const orderPaymentsRelations = relations(orderPayments, ({ one }) => ({
  order: one(orders, {
    fields: [orderPayments.orderId],
    references: [orders.orderId],
  }),
}));

export const promotionsRelations = relations(promotions, ({ many }) => ({
  orderPromotions: many(orderPromotions),
}));

export const orderPromotionsRelations = relations(
  orderPromotions,
  ({ one }) => ({
    order: one(orders, {
      fields: [orderPromotions.orderId],
      references: [orders.orderId],
    }),
    promotion: one(promotions, {
      fields: [orderPromotions.promotionId],
      references: [promotions.promotionId],
    }),
  })
);

export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  product: one(products, {
    fields: [stockMovements.productId],
    references: [products.productId],
  }),
}));

// ─── Inferred Types ──────────────────────────────────────────────────────────

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

export type Table = typeof tables.$inferSelect;
export type NewTable = typeof tables.$inferInsert;

export type Waiter = typeof waiters.$inferSelect;
export type NewWaiter = typeof waiters.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export type OrderPayment = typeof orderPayments.$inferSelect;
export type NewOrderPayment = typeof orderPayments.$inferInsert;

export type Promotion = typeof promotions.$inferSelect;
export type NewPromotion = typeof promotions.$inferInsert;

export type OrderPromotion = typeof orderPromotions.$inferSelect;
export type NewOrderPromotion = typeof orderPromotions.$inferInsert;

export type StockMovement = typeof stockMovements.$inferSelect;
export type NewStockMovement = typeof stockMovements.$inferInsert;

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;

// ─── Composite Types ─────────────────────────────────────────────────────────

export type OrderWithDetails = Order & {
  orderItems: OrderItem[];
  waiter: Waiter | null;
  orderPayments: OrderPayment[];
};

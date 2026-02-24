import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { customers, type FoodType, products, tables, waiters } from "./schema";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const conn = postgres(DATABASE_URL);
const db = drizzle(conn);

// ─── Product seed data (migrated from data.ts) ──────────────────────────────

const foodProducts = [
  {
    name: "Bakso Campur (Isi 6)",
    price: 20_000,
    description: "3 Bakso Halus/Kasar, Siomay, Tahu Bakso, Gorengan, Suun",
    type: "bakso",
    displayOrder: 1,
  },
  {
    name: "Bakso Campur (Isi 8)",
    price: 25_000,
    description: "5 Bakso Halus/Kasar, Siomay, Tahu Bakso, Gorengan, Suun",
    type: "bakso",
    displayOrder: 2,
  },
  {
    name: "Bakso Polos (Isi 6)",
    price: 20_000,
    description: "6 Bakso Halus/Kasar, Suun",
    type: "bakso",
    displayOrder: 3,
  },
  {
    name: "Bakso Polos (Isi 8)",
    price: 25_000,
    description: "8 Bakso Halus/Kasar, Suun",
    type: "bakso",
    displayOrder: 4,
  },
  {
    name: "GTS (Isi 7)",
    price: 25_000,
    description:
      "2 Siomay, 2 Tahu Bakso, 3 Gorengan atau 8 Gorengan atau Bebas Pilih",
    type: "bakso",
    displayOrder: 5,
  },
  {
    name: "Mie polos",
    price: 18_000,
    type: "mie",
    displayOrder: 6,
  },
  {
    name: "Mie ayam",
    price: 20_000,
    type: "mie",
    displayOrder: 7,
  },
  {
    name: "Mie ayam pangsit",
    price: 23_000,
    description: "Mie ayam dengan 2 pangsit",
    type: "mie",
    displayOrder: 8,
  },
  {
    name: "Mie ayam bakso",
    price: 26_000,
    description: "Mie ayam dengan 2 bakso",
    type: "mie",
    displayOrder: 9,
  },
  {
    name: "Mie ayam pangsit bakso",
    price: 29_000,
    description: "Mie ayam dengan 2 pangsit dan 2 bakso",
    type: "mie",
    displayOrder: 10,
  },
  {
    name: "Pangsit goreng (Isi 10)",
    price: 26_000,
    type: "mie",
    displayOrder: 11,
  },
  {
    name: "Pangsit kuah (Isi 10)",
    price: 26_000,
    type: "mie",
    displayOrder: 12,
  },
  // A la carte items
  {
    name: "Bakso Halus/Kasar",
    price: 3500,
    type: "satuan",
    displayOrder: 13,
  },
  {
    name: "Gorengan Panjang",
    price: 3500,
    type: "satuan",
    displayOrder: 14,
  },
  {
    name: "Pangsit Goreng",
    price: 3000,
    type: "satuan",
    displayOrder: 15,
  },
  {
    name: "Bakwan Goreng",
    price: 5000,
    type: "satuan",
    displayOrder: 16,
  },
  {
    name: "Siomay",
    price: 4000,
    type: "satuan",
    displayOrder: 17,
  },
  {
    name: "Siomay Goreng",
    price: 4000,
    type: "satuan",
    displayOrder: 18,
  },
  {
    name: "Tahu Bakso",
    price: 4000,
    type: "satuan",
    displayOrder: 19,
  },
  {
    name: "Nasi Putih",
    price: 7000,
    type: "satuan",
    displayOrder: 20,
  },
  {
    name: "Suun",
    price: 5000,
    type: "satuan",
    displayOrder: 21,
  },
  {
    name: "Pangsit kuah",
    price: 3000,
    description: "Pembelian minimal 5 buah",
    type: "satuan",
    displayOrder: 22,
  },
  {
    name: "Takeaway Box",
    price: 1000,
    type: "satuan",
    displayOrder: 23,
  },
] as const;

const beverageProducts = [
  { name: "Es Teh Manis", price: 6000, displayOrder: 1 },
  { name: "Es Teh Manis Jumbo", price: 9000, displayOrder: 2 },
  { name: "Es Teh Tawar", price: 5000, displayOrder: 3 },
  { name: "Es Teh Tawar Jumbo", price: 7000, displayOrder: 4 },
  { name: "Air Mineral", price: 6000, displayOrder: 5 },
  { name: "Winter Melon", price: 9000, displayOrder: 6 },
  { name: "Kunyit Asem (Mamiku)", price: 12_000, displayOrder: 7 },
  { name: "Sinom (1529)", price: 12_000, displayOrder: 8 },
  { name: "Jahe (1529)", price: 12_000, displayOrder: 9 },
  { name: "Sari Kedelai (1529)", price: 12_000, displayOrder: 10 },
  { name: "Sinom (Mbok Dhe)", price: 12_000, displayOrder: 11 },
  { name: "Beras Kencur (Mbok Dhe)", price: 12_000, displayOrder: 12 },
  { name: "Jahe Asem (Mbok Dhe)", price: 12_000, displayOrder: 13 },
  { name: "Es Kocok", price: 12_000, displayOrder: 14 },
  { name: "Pokka Green Tea", price: 9000, displayOrder: 15 },
  { name: "Pokka Lemon Tea", price: 9000, displayOrder: 16 },
  { name: "Pokka Oolong Tea", price: 9000, displayOrder: 17 },
  { name: "Pokka Honey Lemon Tea", price: 9000, displayOrder: 18 },
  { name: "Es Badak", price: 17_000, displayOrder: 19 },
  { name: "Es Degan", price: 12_000, displayOrder: 20 },
  { name: "Es Degan Jeruk", price: 15_000, displayOrder: 21 },
  { name: "Es Degan Cao", price: 15_000, displayOrder: 22 },
  { name: "Es Jeruk Manis", price: 10_000, displayOrder: 23 },
  { name: "Es Jeruk Nipis", price: 10_000, displayOrder: 24 },
  { name: "Es Campur", price: 20_000, displayOrder: 25 },
  { name: "Es Syrup", price: 7000, displayOrder: 26 },
  { name: "Es Cao", price: 8000, displayOrder: 27 },
  { name: "Es Soda Gembira", price: 15_000, displayOrder: 28 },
  { name: "Es Milo", price: 12_000, displayOrder: 29 },
  { name: "Es Milo Cao", price: 15_000, displayOrder: 30 },
] as const;

const snackProducts = [
  { name: "Pisang goreng", price: 17_000, displayOrder: 1 },
  { name: "Pisang goreng pack", price: 80_000, displayOrder: 2 },
  { name: "Rengginang", price: 17_000, displayOrder: 3 },
  { name: "Kerupuk stik bawang", price: 12_000, displayOrder: 4 },
  { name: "Kerupuk bangka puraya", price: 13_000, displayOrder: 5 },
] as const;

const addonProducts = [
  { name: "Takeaway cup", price: 1000, displayOrder: 1 },
] as const;

const waiterNames = ["Lia", "Citra", "Nikma", "Fia", "Jelita"];

const seed = async () => {
  // biome-ignore lint/suspicious/noConsole: seed script needs console output
  console.log("Seeding database...");

  // Seed products
  const productRows = [
    ...foodProducts.map((p) => ({
      name: p.name,
      price: p.price,
      category: "food" as const,
      type: "type" in p ? (p.type as FoodType) : undefined,
      description: "description" in p ? (p.description as string) : undefined,
      displayOrder: p.displayOrder,
      trackInventory: false,
    })),
    ...beverageProducts.map((p) => ({
      name: p.name,
      price: p.price,
      category: "beverage" as const,
      displayOrder: p.displayOrder,
      trackInventory: false,
    })),
    ...snackProducts.map((p) => ({
      name: p.name,
      price: p.price,
      category: "snack" as const,
      displayOrder: p.displayOrder,
      trackInventory: false,
    })),
    ...addonProducts.map((p) => ({
      name: p.name,
      price: p.price,
      category: "addon" as const,
      displayOrder: p.displayOrder,
      trackInventory: false,
    })),
  ];

  await db.insert(products).values(productRows);
  // biome-ignore lint/suspicious/noConsole: seed script needs console output
  console.log(`Seeded ${productRows.length} products`);

  // Seed tables (1-10)
  const tableRows = Array.from({ length: 10 }, (_, i) => ({
    tableNumber: i + 1,
    capacity: 4,
  }));
  await db.insert(tables).values(tableRows);
  // biome-ignore lint/suspicious/noConsole: seed script needs console output
  console.log(`Seeded ${tableRows.length} tables`);

  // Seed waiters
  const waiterRows = waiterNames.map((name) => ({ name }));
  await db.insert(waiters).values(waiterRows);
  // biome-ignore lint/suspicious/noConsole: seed script needs console output
  console.log(`Seeded ${waiterRows.length} waiters`);

  // Seed a sample customer
  await db.insert(customers).values({
    name: "Walk-in Customer",
    phoneNumber: "0000000000",
    notes: "Default customer for walk-in orders",
  });
  // biome-ignore lint/suspicious/noConsole: seed script needs console output
  console.log("Seeded default walk-in customer");

  // biome-ignore lint/suspicious/noConsole: seed script needs console output
  console.log("Seeding complete!");

  await conn.end();
};

seed().catch((err) => {
  // biome-ignore lint/suspicious/noConsole: seed script needs console output
  console.error("Seed failed:", err);
  process.exit(1);
});

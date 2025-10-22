import { v4 as uuidv4 } from "uuid";

export type ProductType = {
  id: string;
  name: string;
  price: number;
  type?: "bakso" | "mie" | "satuan";
  description?: string;
};

export const setMenus: ProductType[] = [
  {
    id: uuidv4(),
    name: "Bakso Campur (Isi 6)",
    price: 20_000,
    description: "3 Bakso Halus/Kasar, Siomay, Tahu Bakso, Gorengan, Suun",
    type: "bakso",
  },
  {
    id: uuidv4(),
    name: "Bakso Campur (Isi 8)",
    price: 25_000,
    description: "5 Bakso Halus/Kasar, Siomay, Tahu Bakso, Gorenganm, Suun",
    type: "bakso",
  },
  {
    id: uuidv4(),
    name: "Bakso Polos (Isi 6)",
    price: 20_000,
    description: "6 Bakso Halus/Kasar, Suun",
    type: "bakso",
  },
  {
    id: uuidv4(),
    name: "Bakso Polos (Isi 8)",
    price: 25_000,
    description: "8 Bakso Halus/Kasar, Suun",
    type: "bakso",
  },
  {
    id: uuidv4(),
    name: "GTS (Isi 7)",
    price: 25_000,
    description:
      "2 Siomay, 2 Tahu Bakso, 3 Gorengan atau 8 Gorengan atau Bebas Pilih",
    type: "bakso",
  },
  {
    id: uuidv4(),
    name: "Mie polos",
    price: 18_000,
    description: undefined,
    type: "mie",
  },
  {
    id: uuidv4(),
    name: "Mie ayam",
    price: 20_000,
    description: undefined,
    type: "mie",
  },
  {
    id: uuidv4(),
    name: "Mie ayam pangsit",
    price: 23_000,
    description: "Mie ayam dengan 2 pangsit",
    type: "mie",
  },
  {
    id: uuidv4(),
    name: "Mie ayam bakso",
    price: 26_000,
    description: "Mie ayam dengan 2 bakso",
    type: "mie",
  },
  {
    id: uuidv4(),
    name: "Mie ayam pangsit bakso",
    price: 29_000,
    description: "Mie ayam dengan 2 pangsit dan 2 bakso",
    type: "mie",
  },
  {
    id: uuidv4(),
    name: "Pangsit goreng (Isi 10)",
    price: 26_000,
    description: undefined,
    type: "mie",
  },
  {
    id: uuidv4(),
    name: "Pangsit kuah (Isi 10)",
    price: 26_000,
    description: undefined,
    type: "mie",
  },
];

export const alacarte: ProductType[] = [
  {
    id: uuidv4(),
    name: "Bakso Halus/Kasar",
    price: 3500,
    type: "satuan",
  },
  {
    id: uuidv4(),
    name: "Gorengan Panjang",
    price: 3500,
    type: "satuan",
  },
  {
    id: uuidv4(),
    name: "Pangsit Goreng",
    price: 3000,
    type: "satuan",
  },
  {
    id: uuidv4(),
    name: "Bakwan Goreng",
    price: 5000,
    type: "satuan",
  },
  {
    id: uuidv4(),
    name: "Siomay",
    price: 4000,
    type: "satuan",
  },
  {
    id: uuidv4(),
    name: "Siomay Goreng",
    price: 4000,
    type: "satuan",
  },
  {
    id: uuidv4(),
    name: "Tahu Bakso",
    price: 4000,
    type: "satuan",
  },
  {
    id: uuidv4(),
    name: "Nasi Putih",
    price: 7000,
    type: "satuan",
  },
  {
    id: uuidv4(),
    name: "Suun",
    price: 5000,
    type: "satuan",
  },
  {
    id: uuidv4(),
    name: "Pangsit kuah",
    price: 3000,
    description: "Pembelian minimal 5 buah",
    type: "satuan",
  },
  {
    id: uuidv4(),
    name: "Takeaway Box",
    price: 1000,
    description: undefined,
    type: "satuan",
  },
];

export const snacks: ProductType[] = [
  {
    id: uuidv4(),
    name: "Pisang goreng",
    price: 17_000,
  },
  {
    id: uuidv4(),
    name: "Pisang goreng pack",
    price: 80_000,
  },
  {
    id: uuidv4(),
    name: "Rengginang",
    price: 17_000,
  },
  {
    id: uuidv4(),
    name: "Kerupuk stik bawang",
    price: 12_000,
  },
  {
    id: uuidv4(),
    name: "Kerupuk bangka puraya",
    price: 13_000,
  },
];

export const beverages: ProductType[] = [
  {
    id: uuidv4(),
    name: "Es Teh Manis",
    price: 6000,
  },
  {
    id: uuidv4(),
    name: "Es Teh Manis Jumbo",
    price: 9000,
  },
  {
    id: uuidv4(),
    name: "Es Teh Tawar",
    price: 5000,
  },
  {
    id: uuidv4(),
    name: "Es Teh Tawar Jumbo",
    price: 7000,
  },
  {
    id: uuidv4(),
    name: "Air Mineral",
    price: 6000,
  },
  {
    id: uuidv4(),
    name: "Winter Melon",
    price: 9000,
  },
  {
    id: uuidv4(),
    name: "Kunyit Asem (Mamiku)",
    price: 12_000,
  },
  {
    id: uuidv4(),
    name: "Sinom (1529)",
    price: 12_000,
  },
  {
    id: uuidv4(),
    name: "Jahe (1529)",
    price: 12_000,
  },
  {
    id: uuidv4(),
    name: "Sari Kedelai (1529)",
    price: 12_000,
  },
  {
    id: uuidv4(),
    name: "Sinom (Mbok Dhe)",
    price: 12_000,
  },
  {
    id: uuidv4(),
    name: "Beras Kencur (Mbok Dhe)",
    price: 12_000,
  },
  {
    id: uuidv4(),
    name: "Jahe Asem (Mbok Dhe)",
    price: 12_000,
  },
  { id: uuidv4(), name: "Es Kocok", price: 12_000 },
  { id: uuidv4(), name: "Pokka Green Tea", price: 8000 },
  { id: uuidv4(), name: "Pokka Lemon Tea", price: 8000 },
  { id: uuidv4(), name: "Pokka Oolong Tea", price: 8000 },
  { id: uuidv4(), name: "Pokka Honey Lemon Tea", price: 8000 },
  { id: uuidv4(), name: "Es Badak", price: 17_000 },
  { id: uuidv4(), name: "Es Degan", price: 12_000 },
  { id: uuidv4(), name: "Es Degan Jeruk", price: 15_000 },
  { id: uuidv4(), name: "Es Degan Cao", price: 15_000 },
  { id: uuidv4(), name: "Es Jeruk Manis", price: 10_000 },
  { id: uuidv4(), name: "Es Jeruk Nipis", price: 10_000 },
  { id: uuidv4(), name: "Es Campur", price: 20_000 },
  { id: uuidv4(), name: "Es Syrup", price: 7000 },
  { id: uuidv4(), name: "Es Cao", price: 8000 },
  { id: uuidv4(), name: "Es Soda Gembira", price: 15_000 },
  { id: uuidv4(), name: "Es Milo", price: 12_000 },
  { id: uuidv4(), name: "Es Milo Cao", price: 15_000 },
];

export const addons: ProductType[] = [
  { id: uuidv4(), name: "Takeaway cup", price: 1000 },
];

export type PaymentMethodType = "cash" | "qris" | "transfer" | undefined;
export const paymentMethods: PaymentMethodType[] = ["cash", "qris", "transfer"];

export type ServingMethodType = "dine_in" | "takeaway";
export const servingMethods: ServingMethodType[] = ["dine_in", "takeaway"];

export const tableNums = Array.from({ length: 10 }, (_, index) => index + 1);
export const waiters = ["Lia", "Citra", "Nikma", "Fia", "Jelita"];

export type ReceiptType = "internal" | "client";

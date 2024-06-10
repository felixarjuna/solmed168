export type ProductType = {
  id: string;
  name: string;
  price: number;
  type?: "bakso" | "mie" | "satuan";
  description?: string;
};

export const setMenus: ProductType[] = [
  {
    id: "1",
    name: "Bakso Campur (Isi 6)",
    price: 20000,
    description: "3 Bakso Halus/Kasar, Siomay, Tahu Bakso, Gorengan, Suun",
    type: "bakso",
  },
  {
    id: "2",
    name: "Bakso Campur (Isi 8)",
    price: 25000,
    description: "5 Bakso Halus/Kasar, Siomay, Tahu Bakso, Gorenganm, Suun",
    type: "bakso",
  },
  {
    id: "3",
    name: "Bakso Polos (Isi 9)",
    price: 25000,
    description: "9 Bakso Halus/Kasar, Suun",
    type: "bakso",
  },
  {
    id: "4",
    name: "GTS (Isi 7)",
    price: 25000,
    description:
      "2 Siomay, 2 Tahu Bakso, 3 Gorengan atau 8 Gorengan atau Bebas Pilih",
    type: "bakso",
  },
  {
    id: "5",
    name: "Mie ayam pangsit",
    price: 23000,
    description: undefined,
    type: "mie",
  },
  {
    id: "6",
    name: "Mie ayam bakso",
    price: 26000,
    description: undefined,
    type: "mie",
  },
  {
    id: "7",
    name: "Mie ayam pangsit bakso",
    price: 28000,
    description: undefined,
    type: "mie",
  },
  {
    id: "8",
    name: "Pangsit goreng/kuah (Isi 10)",
    price: 26000,
    description: undefined,
    type: "mie",
  },
];

export const alacarte: ProductType[] = [
  {
    id: "9",
    name: "Bakso Halus/Kasar",
    price: 3000,
    type: "satuan",
  },
  {
    id: "10",
    name: "Gorengan Panjang",
    price: 3500,
    type: "satuan",
  },
  {
    id: "11",
    name: "Pangsit Goreng",
    price: 3000,
    type: "satuan",
  },
  {
    id: "12",
    name: "Bakwan Goreng",
    price: 5000,
    type: "satuan",
  },
  {
    id: "13",
    name: "Siomay",
    price: 4000,
    type: "satuan",
  },
  {
    id: "14",
    name: "Tahu Bakso",
    price: 4000,
    type: "satuan",
  },
  {
    id: "15",
    name: "Nasi Putih",
    price: 6000,
    type: "satuan",
  },
  {
    id: "16",
    name: "Takeaway",
    price: 1500,
    type: "satuan",
  },
];

export const snacks: ProductType[] = [
  {
    id: "16",
    name: "Pisang Goreng",
    price: 15000,
  },
];

export const beverages: ProductType[] = [
  {
    id: "17",
    name: "Es Teh Manis",
    price: 5000,
  },
  {
    id: "18",
    name: "Es Teh Manis Jumbo",
    price: 8000,
  },
  {
    id: "19",
    name: "Es Teh Tawar",
    price: 4000,
  },
  {
    id: "20",
    name: "Es Teh Tawar",
    price: 6000,
  },
  {
    id: "21",
    name: "Air Mineral",
    price: 5000,
  },
  {
    id: "22",
    name: "Winter Melon",
    price: 8000,
  },
  {
    id: "23",
    name: "Sari Kacang Hijau",
    price: 10000,
  },
  {
    id: "24",
    name: "Kunyit Asem",
    price: 12000,
  },
  {
    id: "25",
    name: "Sari Kedelai",
    price: 10000,
  },
  {
    id: "26",
    name: "Sinom",
    price: 10000,
  },
  {
    id: "27",
    name: "Beras Kencur",
    price: 10000,
  },
  { id: "28", name: "Es Kocok", price: 11000 },
  { id: "29", name: "Pokka Tea", price: 8500 },
  { id: "30", name: "Es Badak", price: 17000 },
  { id: "31", name: "Es Degan", price: 10000 },
  { id: "32", name: "Es Degan Jeruk", price: 12000 },
  { id: "33", name: "Es Degan Cao", price: 12000 },
  { id: "34", name: "Es Jeruk Manis/Nipis", price: 8000 },
  { id: "35", name: "Es Lime Squash", price: 12000 },
  { id: "36", name: "Es Campur", price: 18000 },
  { id: "37", name: "Es Syrup", price: 6000 },
  { id: "38", name: "Es Cao", price: 7000 },
  { id: "39", name: "Es Soda Gembira", price: 12000 },
  { id: "40", name: "Es Milo", price: 12000 },
  { id: "41", name: "Es Milo Cao", price: 13000 },
];

export type PaymentMethodType = "cash" | "qris" | "transfer";
export const paymentMethods: PaymentMethodType[] = ["cash", "qris", "transfer"];

export type ServingMethodType = "dine_in" | "takeaway";
export const servingMethods: ServingMethodType[] = ["dine_in", "takeaway"];

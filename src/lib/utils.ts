import { type ClassValue, clsx } from "clsx";
import { DateTime } from "luxon";
import { twMerge } from "tailwind-merge";
import type { CartItem } from "~/app/order/_hooks/useCart";
import type { OrderItem } from "~/server/db/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toRp(amount: number): string {
  return `Rp. ${amount.toLocaleString("id-ID")}`;
}

export function formatRp(amount: string): string {
  const number = Number.parseInt(amount.replace(/\D/g, ""), 10);
  if (Number.isNaN(number)) {
    return "0";
  }
  return number.toLocaleString("id-ID");
}

export function calculateTakeawayBox(items: CartItem[]) {
  return items
    .filter(
      (item) => item.product.type === "mie" || item.product.type === "bakso"
    )
    .filter((item) => item.product.servingMethod === "takeaway")
    .reduce((total, { product }) => total + product.amount, 0);
}

export function calculateTotal(items: CartItem[]) {
  return items.reduce(
    (total, { product }) => total + product.price * product.amount,
    0
  );
}

export function today() {
  const today = DateTime.now();
  return today.toLocaleString(DateTime.DATE_MED);
}

export function formatDate(date: Date) {
  return DateTime.fromJSDate(date)
    .setLocale("id-ID")
    .toFormat("dd MMMM yyyy HH:mm");
}

export function orderItemsToCartItems(items: OrderItem[]): CartItem[] {
  return items.map((item) => ({
    product: {
      id: item.productId ?? item.orderItemId,
      name: item.productName,
      price: item.unitPrice,
      amount: item.quantity,
      servingMethod: item.servingMethod ?? undefined,
    },
  }));
}

export function cartItemsToOrderItems(
  items: CartItem[]
): {
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  servingMethod: "dine_in" | "takeaway" | null | undefined;
}[] {
  return items.map((item) => ({
    productName: item.product.name,
    unitPrice: item.product.price,
    quantity: item.product.amount,
    lineTotal: item.product.price * item.product.amount,
    servingMethod: item.product.servingMethod,
  }));
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CartItem } from "~/app/order/_hooks/useCart";
import { DateTime } from "luxon";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toRp(amount: number): string {
  return `Rp. ${amount.toLocaleString("id-ID")}`;
}

export function calculateTotal(items: CartItem[]) {
  return items.reduce(
    (total, { product }) => total + product.price * product.amount,
    0,
  );
}

export function today() {
  const today = DateTime.now();
  return today.toLocaleString(DateTime.DATE_MED);
}

export function formatDate(date: Date) {
  return DateTime.fromJSDate(date).toLocaleString(DateTime.DATETIME_MED);
}

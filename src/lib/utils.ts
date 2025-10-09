import { type ClassValue, clsx } from "clsx";
import { DateTime } from "luxon";
import { twMerge } from "tailwind-merge";
import type { CartItem } from "~/app/order/_hooks/useCart";

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
    .toFormat("dd MMMM yyyy | HH:mm");
}

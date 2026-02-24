import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { calculateTotal } from "~/lib/utils";
import type { ProductType, ServingMethodType } from "~/server/db/schema";

export type CartItemExtended = ProductType & {
  amount: number;
  servingMethod?: ServingMethodType;
};

export type CartItem = {
  readonly product: CartItemExtended;
};

export type UpdateAmountMethod = "increment" | "decrement";

const TAKEAWAY_BOX_NAME = "Takeaway Box";
const TAKEAWAY_BOX_PRICE = 1000;

/**
 * Helper function to sync takeaway boxes based on mie/bakso items with takeaway serving method.
 * Identifies takeaway boxes by name (not by ID) to support DB-backed products.
 */
const syncTakeawayBoxes = (items: CartItem[]): CartItem[] => {
  // Count mie/bakso items with takeaway serving method
  const boxCount = items
    .filter(
      (item) =>
        (item.product.type === "mie" || item.product.type === "bakso") &&
        item.product.servingMethod === "takeaway" &&
        item.product.name !== TAKEAWAY_BOX_NAME
    )
    .reduce((sum, item) => sum + item.product.amount, 0);

  // Remove existing takeaway boxes (by name)
  const itemsWithoutBoxes = items.filter(
    (item) => item.product.name !== TAKEAWAY_BOX_NAME
  );

  // Add correct number of boxes if needed
  if (boxCount > 0) {
    // Reuse existing box product data if available (preserves DB product ID)
    const existingBox = items.find(
      (item) => item.product.name === TAKEAWAY_BOX_NAME
    );
    return [
      ...itemsWithoutBoxes,
      {
        product: {
          id: existingBox?.product.id ?? "takeaway-box",
          name: TAKEAWAY_BOX_NAME,
          price: TAKEAWAY_BOX_PRICE,
          amount: boxCount,
        },
      },
    ];
  }

  return itemsWithoutBoxes;
};

type CartState = {
  readonly items: CartItem[];
  readonly cartTotal: number;
  readonly addItem: (
    item: ProductType,
    startAmount?: number,
    servingMethod?: ServingMethodType
  ) => void;
  readonly removeItem: (itemId: string) => void;
  readonly clearCart: () => void;
  readonly updateAmount: (itemId: string, method: UpdateAmountMethod) => void;
  readonly updateItemServingMethod: (
    itemId: string,
    servingMethod: ServingMethodType
  ) => void;
  readonly syncCart: (items: CartItem[]) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      cartTotal: 0,
      addItem: (product, amount, servingMethod) =>
        set((state) => {
          const quantity = amount ?? 1;
          const index = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.product.servingMethod === servingMethod
          );

          let updatedItems: CartItem[];

          if (index === -1) {
            // Add new item to cart
            const newItem: CartItem = {
              product: { ...product, amount: quantity, servingMethod },
            };
            updatedItems = [...state.items, newItem];
          } else {
            // Update existing item
            updatedItems = [...state.items];
            const existingItem = updatedItems[index];
            if (existingItem) {
              existingItem.product.amount += quantity;
            }
          }

          const itemsWithBoxes = syncTakeawayBoxes(updatedItems);
          return {
            items: itemsWithBoxes,
            cartTotal: calculateTotal(itemsWithBoxes),
          };
        }),
      removeItem: (id) =>
        set((state) => {
          const updatedItems = state.items.filter(
            (item) => item.product.id !== id
          );
          const itemsWithBoxes = syncTakeawayBoxes(updatedItems);
          const total = calculateTotal(itemsWithBoxes);
          return { items: itemsWithBoxes, cartTotal: total };
        }),
      clearCart: () => set({ items: [], cartTotal: 0 }),
      updateAmount: (id, method) =>
        set((state) => {
          const index = state.items.findIndex((item) => item.product.id === id);
          const updatedItems = [...state.items];
          const existingItem = updatedItems[index];

          if (existingItem) {
            if (method === "increment") {
              existingItem.product.amount += 1;
            } else {
              existingItem.product.amount = Math.max(
                1,
                existingItem.product.amount - 1
              );
            }
          }

          const itemsWithBoxes = syncTakeawayBoxes(updatedItems);
          const total = calculateTotal(itemsWithBoxes);
          return { items: itemsWithBoxes, cartTotal: total };
        }),
      updateItemServingMethod: (id, servingMethod) =>
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.product.id === id) {
              return {
                ...item,
                product: { ...item.product, servingMethod },
              };
            }
            return item;
          });

          const itemsWithBoxes = syncTakeawayBoxes(updatedItems);
          const total = calculateTotal(itemsWithBoxes);
          return { items: itemsWithBoxes, cartTotal: total };
        }),
      syncCart: (items) =>
        set(() => {
          const itemsWithBoxes = syncTakeawayBoxes(items);
          return {
            items: itemsWithBoxes,
            cartTotal: calculateTotal(itemsWithBoxes),
          };
        }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

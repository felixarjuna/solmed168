import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { calculateTotal } from "~/lib/utils";
import type { ProductType, ServingMethodType } from "~/server/db/schema";

export type CartItem = {
  readonly cartItemId: string;
  readonly product: ProductType & {
    amount: number;
    servingMethod?: ServingMethodType;
  };
};

export type UpdateAmountMethod = "increment" | "decrement";

const TAKEAWAY_BOX_NAME = "Takeaway Box";
const TAKEAWAY_BOX_PRICE = 1000;

/**
 * Helper function to sync takeaway boxes based on mie/bakso items with takeaway serving method.
 * Identifies takeaway boxes by name (not by ID) to support DB-backed products.
 */
const syncTakeawayBoxes = (items: CartItem[]): CartItem[] => {
  /** product with food type mie or bakso.  */
  const boxCount = items
    .filter(
      (item) =>
        (item.product.type === "mie" || item.product.type === "bakso") &&
        item.product.servingMethod === "takeaway" &&
        item.product.name !== TAKEAWAY_BOX_NAME
    )
    .reduce((sum, item) => sum + item.product.amount, 0);

  /** remove existing takeaway boxes. */
  const itemsWithoutBoxes = items.filter(
    (item) => item.product.name !== TAKEAWAY_BOX_NAME
  );

  if (boxCount > 0) {
    const existingBox = items.find(
      (item) => item.product.name === TAKEAWAY_BOX_NAME
    );
    return [
      ...itemsWithoutBoxes,
      {
        cartItemId: existingBox?.cartItemId ?? crypto.randomUUID(),
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
  readonly removeItem: (cartItemId: string) => void;
  readonly clearCart: () => void;
  readonly updateAmount: (cartItemId: string, method: UpdateAmountMethod) => void;
  readonly updateItemServingMethod: (
    cartItemId: string,
    servingMethod: ServingMethodType
  ) => void;
  readonly splitItem: (cartItemId: string) => void;
  readonly syncCart: (items: CartItem[]) => void;
};

export const getDerivedServingMethod = (
  items: CartItem[]
): ServingMethodType | null => {
  const methods = items
    .filter(
      (item) =>
        item.product.name !== "Takeaway Box" &&
        item.product.servingMethod !== undefined
    )
    .map((item) => item.product.servingMethod);

  if (methods.length === 0) return null;

  const allSame = methods.every((m) => m === methods[0]);
  return allSame ? methods[0]! : "dine_in";
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
            const newItem: CartItem = {
              cartItemId: crypto.randomUUID(),
              product: { ...product, amount: quantity, servingMethod },
            };
            updatedItems = [...state.items, newItem];
          } else {
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
      removeItem: (cartItemId) =>
        set((state) => {
          const updatedItems = state.items.filter(
            (item) => item.cartItemId !== cartItemId
          );
          const itemsWithBoxes = syncTakeawayBoxes(updatedItems);
          const total = calculateTotal(itemsWithBoxes);
          return { items: itemsWithBoxes, cartTotal: total };
        }),
      clearCart: () => set({ items: [], cartTotal: 0 }),
      updateAmount: (cartItemId, method) =>
        set((state) => {
          const index = state.items.findIndex(
            (item) => item.cartItemId === cartItemId
          );
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
      updateItemServingMethod: (cartItemId, servingMethod) =>
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.cartItemId === cartItemId) {
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
      splitItem: (cartItemId) =>
        set((state) => {
          const index = state.items.findIndex(
            (item) => item.cartItemId === cartItemId
          );
          const existingItem = state.items[index];
          if (!existingItem || existingItem.product.amount <= 1) {
            return state;
          }

          const updatedItems = [...state.items];
          updatedItems[index] = {
            ...existingItem,
            product: {
              ...existingItem.product,
              amount: existingItem.product.amount - 1,
            },
          };

          const newItem: CartItem = {
            cartItemId: crypto.randomUUID(),
            product: {
              ...existingItem.product,
              amount: 1,
            },
          };

          updatedItems.splice(index + 1, 0, newItem);

          const itemsWithBoxes = syncTakeawayBoxes(updatedItems);
          return {
            items: itemsWithBoxes,
            cartTotal: calculateTotal(itemsWithBoxes),
          };
        }),
      syncCart: (items) =>
        set(() => {
          const itemsWithId = items.map((item) => ({
            ...item,
            cartItemId: item.cartItemId || crypto.randomUUID(),
          }));
          const itemsWithBoxes = syncTakeawayBoxes(itemsWithId);
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

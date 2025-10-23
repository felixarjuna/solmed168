import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ProductType, ServingMethodType } from "~/app/data";
import { calculateTotal } from "~/lib/utils";

export type CartItemExtended = ProductType & {
  amount: number;
  servingMethod?: ServingMethodType;
};

export type CartItem = {
  readonly product: CartItemExtended;
};

export type UpdateAmountMethod = "increment" | "decrement";

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
          const index = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.product.servingMethod === servingMethod
          );

          let updatedItems: CartItem[];

          /* if index is not found, add new item to the cart
           * with the given quantity and serving method
           */
          if (index === -1) {
            const item: CartItem = {
              product: {
                ...product,
                amount: amount ? amount : 1,
                servingMethod,
              },
            };
            updatedItems = [...state.items, item];
          } else {
            /* if index found, increase the amount of the same item in the cart */
            updatedItems = [...state.items];
            const existingItem = updatedItems[index];
            if (existingItem) {
              existingItem.product.amount += amount ? amount : 1;
            }
          }

          const total = calculateTotal(updatedItems);
          return { items: updatedItems, cartTotal: total };
        }),
      removeItem: (id) =>
        set((state) => {
          const updatedItems = state.items.filter(
            (item) => item.product.id !== id
          );

          const total = calculateTotal(updatedItems);
          return { items: updatedItems, cartTotal: total };
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
          const total = calculateTotal(updatedItems);
          return { items: updatedItems, cartTotal: total };
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
          const total = calculateTotal(updatedItems);
          return { items: updatedItems, cartTotal: total };
        }),
      syncCart: (items) =>
        set(() => ({ items, cartTotal: calculateTotal(items) })),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

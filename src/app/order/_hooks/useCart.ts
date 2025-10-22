import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ProductType } from "~/app/data";
import { calculateTotal } from "~/lib/utils";

export type CartItemExtended = ProductType & {
  amount: number;
};

export type CartItem = {
  readonly product: CartItemExtended;
};

export type UpdateAmountMethod = "increment" | "decrement";

type CartState = {
  readonly items: CartItem[];
  readonly cartTotal: number;
  readonly addItem: (item: ProductType, startAmount?: number) => void;
  readonly removeItem: (itemId: string) => void;
  readonly clearCart: () => void;
  readonly updateAmount: (itemId: string, method: UpdateAmountMethod) => void;
  readonly syncCart: (items: CartItem[]) => void;
  // readonly updateAmount: (
  //   item: ItemType,
  //   method: UpdateAmountMethod,
  //   startAmount: number,
  // ) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      cartTotal: 0,
      addItem: (product, amount) =>
        set((state) => {
          const index = state.items.findIndex(
            (item) => item.product.id === product.id
          );
          /* if index is not found, add new item to the cart
           * with the given quantity
           */
          if (index == -1) {
            const item: CartItem = {
              product: { ...product, amount: amount ? amount : 1 },
            };
            const items = [...state.items, item];
            const total = calculateTotal(items);
            return { items, cartTotal: total };
          }

          /* if index found, increase the amount of the same item in the cart */
          const items = [...state.items];
          items[index]!.product.amount += amount ? amount : 1;
          const total = calculateTotal(items);
          return { items, cartTotal: total };
        }),
      removeItem: (id) =>
        set((state) => {
          const items = state.items.filter((item) => item.product.id !== id);
          const total = calculateTotal(items);
          return { items, cartTotal: total };
        }),
      clearCart: () => set({ items: [], cartTotal: 0 }),
      // updateAmount: (product, method, startAmount) =>
      //   set((state) => {
      //     /** index validation.
      //      * if index is not found, add new item to the cart with the given
      //      * start amount, push item to the array and update the search index.
      //      */
      //     let index = state.items.findIndex(
      //       (item) => item.product.id === product.id,
      //     );
      //     const items = [...state.items];
      //     if (index == -1) {
      //       const item: CartItem = {
      //         product: { ...product, amount: startAmount ? startAmount : 1 },
      //       };
      //       items.push(item);
      //       index = items.findIndex((item) => item.product.id === product.id);
      //     }

      //     if (method === "increment") items[index]!.product.amount += 1;
      //     else
      //       items[index]!.product.amount = Math.max(
      //         1,
      //         items[index]!.product.amount - 1,
      //       );
      //     return { items: items };
      //   }),
      updateAmount: (id, method) =>
        set((state) => {
          const index = state.items.findIndex((item) => item.product.id === id);
          const items = [...state.items];
          if (method === "increment") items[index]!.product.amount += 1;
          else
            items[index]!.product.amount = Math.max(
              1,
              items[index]!.product.amount - 1
            );

          const total = calculateTotal(items);
          return { items, cartTotal: total };
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

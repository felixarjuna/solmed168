import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ItemType } from "~/app/menu";

export type CartItemExtended = ItemType & {
  amount: number;
};

export type CartItem = {
  readonly product: CartItemExtended;
};

export type UpdateAmountMethod = "increment" | "decrement";

type CartState = {
  readonly items: CartItem[];
  readonly addItem: (item: ItemType, startAmount?: number) => void;
  readonly removeItem: (itemId: string) => void;
  readonly clearCart: () => void;
  readonly updateAmount: (itemId: string, method: UpdateAmountMethod) => void;
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
      addItem: (product, amount) =>
        set((state) => {
          const index = state.items.findIndex(
            (item) => item.product.id === product.id,
          );
          /* if index is not found, add new item to the cart
           * with the given quantity
           */
          if (index == -1) {
            const item: CartItem = {
              product: { ...product, amount: amount ? amount : 1 },
            };
            const items = [...state.items, item];
            return { items };
          }

          /* if index found, increase the amount of the same item in the cart */
          const items = [...state.items];
          items[index]!.product.amount += amount ? amount : 1;
          return { items: items };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== id),
        })),
      clearCart: () => set({ items: [] }),
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
              items[index]!.product.amount - 1,
            );
          return { items: items };
        }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

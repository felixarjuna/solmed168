import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { type PaymentMethodType, type ServingMethodType } from "~/app/menu";

type ClientState = {
  readonly servingMethod: ServingMethodType;
  readonly paymentMethod: PaymentMethodType;
  readonly onChangeServingMethod: (method: ServingMethodType) => void;
  readonly onChangePaymentMethod: (method: PaymentMethodType) => void;
};

export const useClientState = create<ClientState>()(
  persist(
    (set) => ({
      servingMethod: "dine-in",
      paymentMethod: "cash",
      onChangeServingMethod: (method: ServingMethodType) =>
        set({ servingMethod: method }),
      onChangePaymentMethod: (method: PaymentMethodType) =>
        set({ paymentMethod: method }),
    }),
    {
      name: "state-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

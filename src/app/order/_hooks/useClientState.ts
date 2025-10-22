import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { PaymentMethodType, ServingMethodType } from "~/app/data";

type ClientState = {
  readonly servingMethod: ServingMethodType;
  readonly paymentMethod: PaymentMethodType;
  readonly onChangeServingMethod: (method: ServingMethodType) => void;
  readonly onChangePaymentMethod: (method: PaymentMethodType) => void;
};

export const useClientState = create<ClientState>()(
  persist(
    (set) => ({
      servingMethod: "dine_in",
      paymentMethod: "cash",
      onChangeServingMethod: (method: ServingMethodType) =>
        set({ servingMethod: method }),
      onChangePaymentMethod: (method: PaymentMethodType) =>
        set({ paymentMethod: method }),
    }),
    {
      name: "state-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

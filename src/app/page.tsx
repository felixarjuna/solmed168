/** biome-ignore-all lint/complexity/noForEach: <explanation> */
import _ from "lodash";

import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import ActiveOrderButton from "./_components/active-order-button";
import BluetoothIndicator from "./_components/bluetooth-indicator";
import Cart from "./_components/cart";
import ExpenseButton from "./_components/expense-button";
import PageLoader from "./_components/loading";
import MenuCard from "./_components/menu-card";
import OrderHistoryButton from "./_components/order-history-button";
import OrderSummary from "./_components/order-summary";
import {
  alacarte,
  beverages,
  type ProductType,
  setMenus,
  snacks,
} from "./data";

type NewType = "bakso" | "mie" | "satuan" | undefined;

export default function HomePage() {
  const foods = [...setMenus, ...alacarte];
  const groupedFoods = new Map<NewType, ProductType[]>();
  foods.forEach((item) => {
    const category = item.type;
    if (!groupedFoods.has(category)) {
      groupedFoods.set(category, []);
    }
    groupedFoods.get(category)?.push(item);
  });

  return (
    <main>
      <Suspense fallback={<PageLoader />}>
        <section className="flex h-screen flex-col gap-4 p-8">
          <div className="flex items-center justify-between gap-2">
            <ExpenseButton />
            <div className="flex items-center gap-2">
              <BluetoothIndicator />
              <ActiveOrderButton />
              <OrderHistoryButton />
            </div>
          </div>

          <section className="relative pb-12">
            <Cart />
            <Tabs defaultValue="foods">
              <TabsList>
                <TabsTrigger value="foods">Makanan</TabsTrigger>
                <TabsTrigger value="beverages">Minuman</TabsTrigger>
                <TabsTrigger value="snacks">Snacks</TabsTrigger>
              </TabsList>
              <TabsContent value="foods">
                <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {Array.from(groupedFoods).map(([key, values]) => (
                    <div className="flex flex-col gap-2" key={key}>
                      <h1>{_.startCase(key)}</h1>
                      <div className="flex flex-col gap-4">
                        {values.map((food) => (
                          <MenuCard
                            hasCartButton
                            isAdjustable
                            key={food.id}
                            menu={food}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="beverages">
                <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {beverages.map((bev, i) => (
                    <MenuCard hasCartButton isAdjustable key={i} menu={bev} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="snacks">
                <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {snacks.map((snack, i) => (
                    <MenuCard hasCartButton isAdjustable key={i} menu={snack} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </section>
        <OrderSummary />
      </Suspense>
    </main>
  );
}

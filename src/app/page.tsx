import _ from "lodash";

import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import ActiveOrderButton from "./_components/active-order-button";
import Cart from "./_components/cart";
import ExpenseButton from "./_components/expense-button";
import PageLoader from "./_components/loading";
import MenuCard from "./_components/menu-card";
import OrderHistoryButton from "./_components/order-history-button";
import OrderSummary from "./_components/order-summary";
import {
  alacarte,
  beverages,
  setMenus,
  snacks,
  type ProductType,
} from "./data";

type NewType = "bakso" | "mie" | "satuan" | undefined;

export default function HomePage() {
  const foods = [...setMenus, ...alacarte];
  const groupedFoods = new Map<NewType, ProductType[]>();
  foods.forEach((item) => {
    const category = item.type;
    if (!groupedFoods.has(category)) groupedFoods.set(category, []);
    groupedFoods.get(category)?.push(item);
  });

  return (
    <main>
      <Suspense fallback={<PageLoader />}>
        <section className="flex h-screen flex-col gap-4 p-8">
          <div className="flex items-center justify-between gap-2">
            <ExpenseButton />
            <div className="flex gap-2">
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
                <div className="mb-12 flex flex-col gap-4">
                  {Array.from(groupedFoods).map(([key, values]) => (
                    <div className="flex flex-col gap-2" key={key}>
                      <h1>{_.startCase(key)}</h1>
                      <div className="flex flex-col gap-4">
                        {values.map((food) => (
                          <MenuCard
                            menu={food}
                            key={food.id}
                            isAdjustable
                            hasCartButton
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="beverages">
                <div className="mb-12 flex flex-col gap-4">
                  {beverages.map((bev, i) => (
                    <MenuCard menu={bev} key={i} isAdjustable hasCartButton />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="snacks">
                <div className="mb-12 flex flex-col gap-4">
                  {snacks.map((snack, i) => (
                    <MenuCard menu={snack} key={i} isAdjustable hasCartButton />
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

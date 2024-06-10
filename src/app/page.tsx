import _ from "lodash";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Cart from "./_components/cart";
import MenuCard from "./_components/menu-card";
import OrderHistoryButton from "./_components/order-history-button";
import OrderSummary from "./_components/order-summary";
import {
  alacarte,
  beverages,
  setMenus,
  snacks,
  type ProductType,
} from "./menu";

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
      <section className="flex h-screen flex-col gap-4 p-8">
        <div className="flex self-end">
          <OrderHistoryButton />
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
                    <h1 className="font-bold ">{_.startCase(key)}</h1>
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
    </main>
  );
}

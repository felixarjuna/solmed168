import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { beverages, setMenus, snacks } from "./menu";
import Cart from "./_components/cart";
import MenuCard from "./_components/menu-card";
import OrderSummary from "./_components/order-summary";

export default function HomePage() {
  return (
    <main>
      <section className="flex h-screen flex-col p-8">
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
                {setMenus.map((menu, i) => (
                  <MenuCard menu={menu} key={i} isAdjustable hasCartButton />
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

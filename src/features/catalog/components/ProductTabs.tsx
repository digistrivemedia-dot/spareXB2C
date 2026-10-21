import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompatibleVehicles } from "@/features/catalog/components/CompatibleVehicles";
import { ProductSpecs } from "@/features/catalog/components/ProductSpecs";
import type { Product } from "@/features/catalog/types";
import type { VehicleCatalog } from "@/features/vehicles/types";

type ProductTabsProps = {
  product: Product;
  vehicleCatalog: VehicleCatalog;
};

export function ProductTabs({ product, vehicleCatalog }: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" id="details">
      <TabsList aria-label="Product details">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="specs">Specifications</TabsTrigger>
        <TabsTrigger value="vehicles">Compatible vehicles</TabsTrigger>
      </TabsList>
      <TabsContent value="description">
        <p className="max-w-3xl text-sm leading-relaxed text-gray-700 md:text-base">
          {product.description}
        </p>
      </TabsContent>
      <TabsContent value="specs">
        <ProductSpecs product={product} />
      </TabsContent>
      <TabsContent value="vehicles">
        <CompatibleVehicles fitment={product.fitment} catalog={vehicleCatalog} />
      </TabsContent>
    </Tabs>
  );
}

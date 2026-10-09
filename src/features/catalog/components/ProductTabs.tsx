import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProductReviews as ProductReviewsData } from "@/features/catalog/api";
import { CompatibleBikes } from "@/features/catalog/components/CompatibleBikes";
import { ProductReviews } from "@/features/catalog/components/ProductReviews";
import { ProductSpecs } from "@/features/catalog/components/ProductSpecs";
import type { Product } from "@/features/catalog/types";
import type { VehicleCatalog } from "@/features/vehicles/types";

type ProductTabsProps = {
  product: Product;
  reviews: ProductReviewsData | null;
  vehicleCatalog: VehicleCatalog;
};

export function ProductTabs({ product, reviews, vehicleCatalog }: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" id="details">
      <TabsList aria-label="Product details">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="specs">Specifications</TabsTrigger>
        <TabsTrigger value="bikes">Compatible bikes</TabsTrigger>
        <TabsTrigger value="reviews">
          Reviews ({product.rating.count.toLocaleString("en-IN")})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="description">
        <p className="max-w-3xl text-sm leading-relaxed text-gray-700 md:text-base">
          {product.description}
        </p>
      </TabsContent>
      <TabsContent value="specs">
        <ProductSpecs product={product} />
      </TabsContent>
      <TabsContent value="bikes">
        <CompatibleBikes fitment={product.fitment} catalog={vehicleCatalog} />
      </TabsContent>
      <TabsContent value="reviews">
        {reviews ? (
          <ProductReviews data={reviews} />
        ) : (
          <p className="text-sm text-gray-600">Reviews aren&apos;t available right now.</p>
        )}
      </TabsContent>
    </Tabs>
  );
}

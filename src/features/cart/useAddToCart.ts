import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCartStore } from "@/features/cart/store";
import type { ProductSummary } from "@/features/catalog/types";

/**
 * Adds a product to the cart and tells the customer, with a shortcut to the cart.
 * Returns false (and says why) when the cart already holds all the stock.
 */
export function useAddToCart() {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  return function addToCart(product: ProductSummary, quantity = 1): boolean {
    const inCart =
      useCartStore.getState().items.find((item) => item.productId === product.id)?.quantity ?? 0;
    if (inCart >= product.stockQuantity) {
      toast.error(`Only ${product.stockQuantity} in stock`, {
        description: "You already have all of them in your cart.",
      });
      return false;
    }

    addItem(product, quantity);
    toast.success("Added to cart", {
      description: product.name,
      action: { label: "View cart", onClick: () => router.push("/cart") },
    });
    return true;
  };
}

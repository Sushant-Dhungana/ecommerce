import ProductList from "@/components/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";
export default async function Home() {
  const latestProducts = await getLatestProducts();

  // Transform rating from string to number
  const transformedProducts = latestProducts.map((product) => ({
    ...product,
    rating:
      product.rating && !isNaN(parseFloat(product.rating))
        ? parseFloat(product.rating)
        : 0,
  }));

  return (
    <div>
      <ProductList data={transformedProducts} title="Newest Arrivals" />
    </div>
  );
}

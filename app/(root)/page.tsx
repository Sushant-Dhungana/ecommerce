import ProductList from "@/components/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";
export default async function Home() {
  const latestProducts = await getLatestProducts();
  return (
    <div>
      <ProductList data={latestProducts} title="Newest Arrivals" />
    </div>
  );
}

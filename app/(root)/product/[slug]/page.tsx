// app/(root)/product/[slug]/page.tsx
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductPrice from "@/components/product/product-price";
import ProductImages from "@/components/product/product-images";

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      select: { slug: true },
    });

    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;

  try {
    const product = await prisma.product.findFirst({
      where: { slug: slug },
    });

    if (!product) {
      return notFound();
    }

    return (
      <section className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* images column */}
          <div className="col-span-2 p-5">
            <ProductImages images={product.images} />
          </div>

          {/* details column */}
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
              <div className="flex gap-2 text-sm text-muted-foreground">
                <span>{product.brand}</span>
                <span>•</span>
                <span>{product.category}</span>
              </div>

              <h1 className="text-3xl font-bold">{product.name}</h1>

              <div className="flex items-center gap-2">
                <span className="text-yellow-500">★</span>
                <span>{product.rating}</span>
                <span className="text-muted-foreground">
                  of {product.numReviews} Reviews
                </span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <ProductPrice
                  value={Number(product.price)}
                  className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
                />
              </div>
            </div>

            <div className="mt-10">
              <p className="font-semibold text-lg mb-2">Description</p>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          </div>

          {/* action column */}
          <div className="col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex justify-between items-center">
                  <div className="font-medium">Price</div>
                  <div>
                    <ProductPrice value={Number(product.price)} />
                  </div>
                </div>

                <div className="mb-6 flex justify-between items-center">
                  <div className="font-medium">Status</div>
                  {product.stock > 0 ? (
                    <Badge variant="secondary">In Stock</Badge>
                  ) : (
                    <Badge variant="destructive">Out Of Stock</Badge>
                  )}
                </div>

                {product.stock > 0 && (
                  <div className="flex-center">
                    <Button className="w-full" size="lg">
                      Add to Cart
                    </Button>
                  </div>
                )}

                {product.stock > 0 && (
                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    {product.stock} items available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Product</h1>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }
};

export default ProductDetailsPage;

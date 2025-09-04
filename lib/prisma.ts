// lib/prisma.ts
import { PrismaClient } from "@/lib/generated/prisma";
import { Decimal } from "./generated/prisma/runtime/library";
// Define the extended client type
type ExtendedPrismaClient = ReturnType<typeof getPrismaClient>;

declare global {
  // Use the extended type for global prisma
  var prisma: ExtendedPrismaClient | undefined;
}

function getPrismaClient() {
  return new PrismaClient().$extends({
    result: {
      product: {
        price: {
          compute(product: { price: Decimal }): string {
            return product.price.toNumber().toString();
          },
        },
        rating: {
          compute(product: { rating: Decimal }): string {
            return product.rating.toNumber().toString();
          },
        },
      },
      cart: {
        itemsPrice: {
          needs: { itemsPrice: true },
          compute(cart) {
            return cart.itemsPrice.toString();
          },
        },
        shippingPrice: {
          needs: { shippingPrice: true },
          compute(cart) {
            return cart.shippingPrice.toString();
          },
        },
        taxPrice: {
          needs: { taxPrice: true },
          compute(cart) {
            return cart.taxPrice.toString();
          },
        },
        totalPrice: {
          needs: { totalPrice: true },
          compute(cart) {
            return cart.totalPrice.toString();
          },
        },
      },
      order: {
        itemsPrice: {
          needs: { itemsPrice: true },
          compute(cart) {
            return cart.itemsPrice.toString();
          },
        },
        shippingPrice: {
          needs: { shippingPrice: true },
          compute(cart) {
            return cart.shippingPrice.toString();
          },
        },
        taxPrice: {
          needs: { taxPrice: true },
          compute(cart) {
            return cart.taxPrice.toString();
          },
        },
        totalPrice: {
          needs: { totalPrice: true },
          compute(cart) {
            return cart.totalPrice.toString();
          },
        },
      },
      orderItem: {
        price: {
          compute(cart): string {
            return cart.price.toString();
          },
        },
      },
    },
  });
}

// Initialize with proper typing
const prisma: ExtendedPrismaClient = global.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;

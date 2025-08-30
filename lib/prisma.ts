// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

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
    },
  });
}

// Initialize with proper typing
const prisma: ExtendedPrismaClient = global.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;

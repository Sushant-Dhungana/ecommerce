import "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Sets up WebSocket connections, which enables Neon to use WebSocket communication.
neonConfig.webSocketConstructor = ws;
declare global {
  // Allow extended PrismaClient
  var prisma: ReturnType<typeof getPrismaClient> | undefined;
}

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaNeon({ connectionString });

// Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
function getPrismaClient() {
  return new PrismaClient({ adapter }).$extends({
    result: {
      product: {
        price: {
          compute(product) {
            return product.price.toString();
          },
        },
        rating: {
          compute(product) {
            return product.rating.toString();
          },
        },
      },
    },
  });
}

const prisma = global.prisma ?? getPrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;

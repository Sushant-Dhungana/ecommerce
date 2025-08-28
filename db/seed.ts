import { PrismaClient } from "@/lib/generated/prisma";
import sampleData from "./sample-data";

async function main() {
  const prisma = new PrismaClient();
  await prisma.product.deleteMany(); //if there is already an item in database dont add everything again .. we have to delete everything and add again
  await prisma.product.createMany({
    data: sampleData.products,
  });
  console.log("Database Seeded");
}
main();

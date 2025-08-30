// scripts/vercel-build.js
import { execSync } from "child_process";

console.log("Starting Vercel build process...");
console.log("Node.js version:", process.version);

try {
  // 1. Generate Prisma client
  console.log("Generating Prisma client...");
  execSync("npx prisma generate", { stdio: "inherit" });

  // 2. Build Next.js app
  console.log("Building Next.js application...");
  execSync("npx next build", { stdio: "inherit" });

  console.log("✅ Build completed successfully!");
} catch (error) {
  console.error("❌ Build failed:", error);
  process.exit(1);
}

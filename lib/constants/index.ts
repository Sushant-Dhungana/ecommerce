export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "E-Commerce";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "Modern E-commerce Platform For Your Kinda Business";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000/";

export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS) || 4;

export const signInDefaultValues = {
  email: "",
  password: "",
};

import { shippingAddressSchema } from "./../validators";
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

export const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const shippingAddressDefaultValues = {
  fullName: "",
  streetAddress: "",
  city: "",
  postalCode: "",
  country: "",
  lat: 0,
  lng: 0,
};

// export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
//   ? process.env.PAYMENT_METHODS.split(",")
//   : ["PayPal", "Stripe", "CashOnDelivery"];

// export const DEFAULT_PAYMENT_METHOD =
//   process.env.DEFAULT_PAYMENT_METHOD || "PayPal";
export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(",").map((m) => m.trim())
  : ["PayPal", "Stripe", "CashOnDelivery"];

export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || "PayPal";

  
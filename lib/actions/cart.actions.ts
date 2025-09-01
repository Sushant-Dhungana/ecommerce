"use server";

import { CartItem } from "@/types";
import { success } from "zod";

export async function addItemToCart({ data }: { data: CartItem }) {
  return {
    success: true,
    message: "Item added to cart",
  };
}

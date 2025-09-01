import { z } from "zod";
import {
  insertProductSchema,
  CartItemSchema,
  insertCartSchema,
} from "@/lib/validators";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string; //if extra database column is required
  rating: string;
  createdAt: Date;
};

export type Cart = z.infer<typeof insertCartSchema>;

export type CartItem = z.infer<typeof CartItemSchema>;

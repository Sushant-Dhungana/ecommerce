"use client";

import { CartItem } from "@/types";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { toast } from "sonner";

const AddToCart = ({ item }: { item: CartItem }) => {
  const router = useRouter();
  const handleAddToCart = async () => {
    const res = await addItemToCart({ data: item });
    if (res.success) {
      toast.success("Item added to cart");
      //   router.push("/cart");
    } else {
      toast.error(res.message);
    }
    //handle success cart add item
    toast(`${item.name} added to cart`);
  };
  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      Add to cart
    </Button>
  );
};

export default AddToCart;

"use client";

import { Cart, CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { toast } from "sonner";

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
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
    toast(res.message);
  };

  const handleRemoveFromCart = async () => {
    const res = await removeItemFromCart(item.productId);

    if (res) {
      toast.success(`${item.name} removed from cart`);
    } else {
      toast.error(`Cannot remove${item.name}  from cart`);
    }
    return;
  };

  //check if items is in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);
  return existItem ? (
    <div className="flex gap-2 items-center">
      <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        <Minus className="h-4 w-4" />
      </Button>
      <span>{existItem?.qty}</span>
      <Button type="button" onClick={handleAddToCart}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      Add to cart
    </Button>
  );
};

export default AddToCart;

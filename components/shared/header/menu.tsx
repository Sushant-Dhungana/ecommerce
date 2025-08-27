import ModeToggle from "./mode-toogle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { Separator } from "@radix-ui/react-dropdown-menu";

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs ga-1">
        <ModeToggle />
        <Button asChild variant="ghost">
          <Link href="/cart">
            <ShoppingCart /> Cart
          </Link>
        </Button>
        <Button asChild>
          <Link href="/sign-in">
            <UserIcon />
            Sign In
          </Link>
        </Button>
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle" asChild>
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start pl-2 sm:pl-2px">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <Separator className="bg-border h-[1px]" />

            <ModeToggle />
            <div className="flex flex-row sm:flex-col gap-4">
              <Button asChild>
                <Link href="/cart">
                  <UserIcon /> Sign In
                </Link>
              </Button>
              <Button asChild>
                <Link href="/cart">
                  <ShoppingCart /> Cart
                </Link>
              </Button>
            </div>
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;

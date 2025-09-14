"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "@/lib/utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserByID } from "./user.actions";
import { insertOrderSchema } from "../validators";
import prisma from "@/lib/prisma";
import { CartItem, PaymentResult } from "@/types";
import { revalidatePath } from "next/cache";
import { paypal } from "../paypal";
import { PAGE_SIZE } from "../constants";
import { Prisma } from "@prisma/client";
import { Decimal } from "decimal.js";

//create order and create the order items
export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error("user not authenticated");

    const cart = await getMyCart();
    const userId = session.user.id;
    if (!userId) throw new Error("user not found");

    const user = await getUserByID(userId);
    if (!user) throw new Error("user not found");

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Cart is empty",
        redirectTo: "/cart",
      };
    }
    if (!user.address) {
      return {
        success: false,
        message: "No Shipping Address",
        redirectTo: "/shipping-address",
      };
    }
    if (!user.paymentMethod) {
      return {
        success: false,
        message: "No Payment Method",
        redirectTo: "/payment-method",
      };
    }
    //create a order object
    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });
    //create a transaction to create the order and the order items
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      //create the order
      const insertedOrder = await tx.order.create({ data: order });
      //create order items from cart items
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: insertedOrder.id,
          },
        });
      }
      //clear cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
          totalPrice: 0,
        },
      });
      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error("Order not created");
    return {
      success: true,
      message: "Order created successfully",
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: formatError(error) };
  }
}

//get order by id
export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  });
  return convertToPlainObject(data);
}

//create new paypal order
export async function createPaypalOrder(orderId: string) {
  try {
    //get order from the database
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });
    if (order) {
      //create paypal order
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

      //update order with the paypal order id\
      await prisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          paymentResult: {
            id: paypalOrder.id,
            email_address: " ",
            status: "",
            paidPrice: 0,
          },
        },
      });
      return {
        success: true,
        message: "Item Order created successfully",
        data: paypalOrder.id,
      };
    } else {
      throw new Error("Order not found");
    }
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//approve paypal order and update order to paid
export async function approvePaypalOrder(
  orderId: string,
  data: { orderID: string }
) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });
    if (!order) {
      throw new Error("Order not found");
    }
    const captureData = await paypal.capturePayment(data.orderID);
    if (!captureData || captureData.status !== "COMPLETED") {
      throw new Error("Paypal payment error");
    }
    //update order to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });

    revalidatePath(`/order/${orderId}`);
    return {
      success: true,
      message: "Your Order Has Been Paid Successfully",
      data: captureData,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//update order to paid
async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult: PaymentResult;
}) {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
    },
  });
  if (!order) {
    throw new Error("Order not found");
  }
  if (order.isPaid) {
    throw new Error("Order already paid");
  }
  //transaction to update order and account for product stock
  await prisma.$transaction(async (tx) => {
    //iterate over products and update the stock
    for (const item of order.orderitems) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: {
            increment: -item.qty,
          },
        },
      });
    }
    //set the order to paid
    await tx.order.update({
      where: {
        id: order.id,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });
  });
  //get updated order after transaction

  const updatedOrder = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  });
  if (!updatedOrder) throw new Error("Order not found");
  return updatedOrder;
}

//Get the users orders
export async function getMyOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const session = await auth();
  if (!session) throw new Error("user not authorized");

  const data = await prisma.order.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.order.count({
    where: { userId: session?.user?.id },
  });

  return { data, totalPages: Math.ceil(dataCount / limit) };
}

type SalesDataType = {
  month: string;
  totalSales: number;
};

//get sales data and order summary
export async function getOrderSummary() {
  //get the counts fro each resource
  const ordersCount = await prisma.order.count();
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.user.count();
  //calculate total sales

  const totalSales = await prisma.order.aggregate({
    _sum: {
      totalPrice: true,
    },
  });
  //get monthly sales
  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Decimal }>
  >`SELECT to_char("createdAt", 'MM/YY') as month, SUM("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')`;

  const salesData: SalesDataType[] = salesDataRaw.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales),
  }));

  //get latest sales

  const latestSales = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      user: { select: { name: true } },
    },
  });

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    salesData,
    latestSales,
  };
}

"use client";

import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Order } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import {
  createPaypalOrder,
  approvePaypalOrder,
} from "@/lib/actions/order.action";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const OrderDetailsTable = ({
  order,
  paypalClientId,
}: {
  order: Order;
  paypalClientId: string;
}) => {
  const {
    shippingAddress,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    isDelivered,
    isPaid,
    paidAt,
  } = order;

  const [paypalError, setPaypalError] = useState<string | null>(null);
  const [isPaypalLoading, setIsPaypalLoading] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Reset state when component mounts or retry is triggered
    setPaypalError(null);
    setPaypalLoaded(false);
  }, [retryCount]);

  const PrintLoadingState = () => {
    const [{ isPending, isRejected, isResolved }] = usePayPalScriptReducer();

    useEffect(() => {
      if (isResolved) {
        setPaypalLoaded(true);
        setPaypalError(null);
      }
      if (isRejected) {
        setPaypalError(
          "Failed to load PayPal. Please try another payment method."
        );
      }
    }, [isPending, isRejected, isResolved]);

    if (isPending) {
      return (
        <div className="text-sm text-muted-foreground py-2">
          Loading PayPal...
        </div>
      );
    } else if (isRejected) {
      return (
        <div className="text-sm text-destructive py-2">
          Failed to load PayPal
        </div>
      );
    }
    return null;
  };

  const handleCreatePaypalOrder = async (): Promise<string> => {
    setIsPaypalLoading(true);
    setPaypalError(null);
    try {
      const res = await createPaypalOrder(order.id);
      if (!res.success) {
        toast.error(res.message);
        setPaypalError(res.message);
        throw new Error(res.message);
      }
      return res.data;
    } catch (error) {
      console.error("PayPal create order error:", error);
      setPaypalError("Failed to create PayPal order");
      throw error;
    } finally {
      setIsPaypalLoading(false);
    }
  };

  const handleApprovePaypalOrder = async (data: { orderID: string }) => {
    setIsPaypalLoading(true);
    setPaypalError(null);
    try {
      const res = await approvePaypalOrder(order.id, data);
      if (!res.success) {
        toast.error(res.message);
        setPaypalError(res.message);
        throw new Error(res.message);
      } else {
        toast.success(res.message);
      }
      return res.data;
    } catch (error) {
      console.error("PayPal approve order error:", error);
      setPaypalError("Failed to process PayPal payment");
      throw error;
    } finally {
      setIsPaypalLoading(false);
    }
  };

  const handleRetryPaypal = () => {
    setRetryCount((prev) => prev + 1);
  };

  const handleAlternativePayment = () => {
    toast.info(
      "Alternative payment method selected. This would redirect to a different payment gateway."
    );
    // Implement your alternative payment logic here
  };

  // Additional debug info - can be removed in production
  const DebugInfo = () => (
    <div className="mt-4 p-3 bg-muted rounded-md text-xs">
      <p className="font-medium">Debug Info (Remove in production):</p>
      <p>Client ID: {paypalClientId?.substring(0, 20)}...</p>
      <p>Environment: Sandbox</p>
      <p>Retry Count: {retryCount}</p>
      <p>Status: {paypalLoaded ? "Loaded" : "Loading"}</p>
    </div>
  );

  return (
    <>
      <h1 className="py-4 text-2xl">Order {formatId(order.id)}</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-y-4 overflow-x-auto">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p>{paymentMethod}</p>
              {isPaid ? (
                <Badge variant="secondary" className="mt-2">
                  Paid At {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive" className="mt-2">
                  Not Paid
                </Badge>
              )}
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.streetAddress}, {shippingAddress.city},{" "}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              {isDelivered ? (
                <Badge variant="secondary" className="mt-2">
                  Delivered At {formatDateTime(order.deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive" className="mt-2">
                  Not Delivered
                </Badge>
              )}
            </CardContent>
          </Card>
          <Card className="mt-4 p-4">
            <h2 className="text-xl pb-4">Order Items</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderItems.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded-md"
                        />
                        <span className="px-2">{item?.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="px-2">{item.qty}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-right">
                        {formatCurrency(item.price)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-4 gap-4 space-y-4">
              <div className="flex justify-between">
                <div>Items</div>
                <div>{formatCurrency(itemsPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Tax</div>
                <div>{formatCurrency(taxPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Shipping</div>
                <div>{formatCurrency(shippingPrice)}</div>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <div>Total</div>
                <div>{formatCurrency(totalPrice)}</div>
              </div>

              {!isPaid && paymentMethod === "PayPal" && (
                <div className="mt-4">
                  {paypalError ? (
                    <div className="border rounded-md p-4">
                      <div className="text-destructive text-sm mb-2">
                        {paypalError}
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button onClick={handleRetryPaypal} size="sm">
                          Retry PayPal
                        </Button>
                        <Button
                          onClick={handleAlternativePayment}
                          variant="outline"
                          size="sm"
                        >
                          Use Alternative Payment
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <PayPalScriptProvider
                      key={retryCount} // Force re-render on retry
                      options={{
                        clientId: paypalClientId,
                        currency: "USD",
                        components: "buttons",
                        intent: "capture",
                        vault: false,
                        "data-page-type": "checkout",
                      }}
                    >
                      <PrintLoadingState />
                      {paypalLoaded && !isPaypalLoading && (
                        <PayPalButtons
                          createOrder={handleCreatePaypalOrder}
                          onApprove={handleApprovePaypalOrder}
                          onError={(err) => {
                            console.error("PayPal button error:", err);
                            setPaypalError(
                              "PayPal payment failed. Please try again."
                            );
                          }}
                          onCancel={() => {
                            console.log("PayPal payment cancelled");
                            setPaypalError("Payment was cancelled.");
                          }}
                          style={{
                            layout: "vertical",
                            color: "blue",
                            shape: "rect",
                            label: "paypal",
                            height: 40,
                          }}
                          forceReRender={[totalPrice, retryCount]}
                        />
                      )}
                    </PayPalScriptProvider>
                  )}
                  <DebugInfo />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;

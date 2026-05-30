"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Home,
  Loader2,
  MapPin,
  Package,
  Phone,
  Printer,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { formatCurrency } from "@/utils";
import { API_URL } from "@/app/lib/api";
import { getPaymentStatus } from "@/utils/payment";

interface OrderItem {
  product:
    | {
        _id: string;
        title: string;
        images?: string[];
      }
    | string;
  name?: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    label: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
}

function readOrderSnapshot(orderId: string): Order | null {
  try {
    const snapshot = localStorage.getItem(`ensis_order_${orderId}`);
    return snapshot ? (JSON.parse(snapshot) as Order) : null;
  } catch {
    return null;
  }
}

function itemName(item: OrderItem) {
  return item.name || (typeof item.product === "object" ? item.product.title : "Product Detail");
}

function paymentBadgeClass(status: Order["paymentStatus"], verified: boolean) {
  if (status === "paid" || verified) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "failed") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  return "border-[#ead28b] bg-[#fff6df] text-[#8d6a3a]";
}

export default function OrderPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.id as string;
  const isPaymentSuccess = searchParams.get("payment") === "success";

  const [order, setOrder] = useState<Order | null>(null);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("ensis_access_token");

    if (!savedToken) {
      const snapshot = readOrderSnapshot(orderId);
      if (snapshot) {
        queueMicrotask(() => {
          setOrder(snapshot);
          setPaymentVerified(isPaymentSuccess);
          setLoading(false);
        });
        return;
      }

      router.push("/login");
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const orderRes = await fetch(`${API_URL}/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        const orderPayload = await orderRes.json();
        if (!orderRes.ok || orderPayload.status === "error") {
          throw new Error(orderPayload.message || "Failed to retrieve order details.");
        }

        const snapshot = readOrderSnapshot(orderId);
        const serverOrder = orderPayload.data as Order;
        setOrder(serverOrder.totalAmount > 0 ? serverOrder : snapshot ?? serverOrder);

        if (isPaymentSuccess) {
          try {
            const statusRes = await getPaymentStatus(orderId, savedToken);
            if (statusRes.status === "success") {
              setPaymentVerified(true);
            }
          } catch (paymentError) {
            console.warn("Could not verify payment status:", paymentError);
          }
        }
      } catch (err: unknown) {
        const snapshot = readOrderSnapshot(orderId);
        if (snapshot) {
          setOrder(snapshot);
          setPaymentVerified(isPaymentSuccess || snapshot.paymentStatus === "paid");
          setError(null);
          return;
        }

        setError(err instanceof Error ? err.message : "An error occurred while loading your order.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, router, isPaymentSuccess]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#fbfaf7] text-[#4f574d]">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p className="text-sm font-semibold">Loading order confirmation...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#fbfaf7] px-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-500">
          <AlertCircle size={28} />
        </div>
        <h1 className="text-xl font-semibold text-[#101010]">Unable to load order</h1>
        <p className="max-w-md text-sm text-[#4f574d]">
          {error || "The requested order details could not be found."}
        </p>
        <Link
          href="/products"
          className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-[#313b30] px-6 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-black"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const isPaid = order.paymentStatus === "paid" || paymentVerified;
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#fbfaf7] py-8 md:py-12">
      <Container>
        <div className="mx-auto max-w-6xl">
          <section className="overflow-hidden rounded-lg border border-[#eee5d8] bg-white shadow-[0_16px_40px_rgba(49,59,48,0.06)]">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="bg-[#243120] p-6 text-white md:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-white/10 text-emerald-200 ring-1 ring-white/20">
                    <CheckCircle2 size={28} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e7c46c]">
                      {isPaid ? "Payment Successful" : "Order Received"}
                    </p>
                    <h1 className="mt-1 text-3xl font-semibold leading-tight md:text-4xl">
                      Thank you for your order
                    </h1>
                  </div>
                </div>

                <p className="mt-5 max-w-2xl text-sm leading-6 text-white/80">
                  Your Ensis wellness equipment order has been registered. Our team will review the details and coordinate delivery support.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-md bg-white/10 p-4 ring-1 ring-white/10">
                    <ClipboardCheck size={18} className="text-[#e7c46c]" />
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-white/60">Order ID</p>
                    <p className="mt-1 break-all font-mono text-xs font-semibold">#{order._id}</p>
                  </div>
                  <div className="rounded-md bg-white/10 p-4 ring-1 ring-white/10">
                    <Calendar size={18} className="text-[#e7c46c]" />
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-white/60">Date</p>
                    <p className="mt-1 text-xs font-semibold">{orderDate}</p>
                  </div>
                  <div className="rounded-md bg-white/10 p-4 ring-1 ring-white/10">
                    <CreditCard size={18} className="text-[#e7c46c]" />
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-white/60">Payment</p>
                    <p className="mt-1 text-xs font-semibold">{isPaid ? "Paid" : order.paymentStatus}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#8d6a3a]">Total Amount</p>
                    <p className="mt-2 text-3xl font-semibold text-[#101010]">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                  <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${paymentBadgeClass(order.paymentStatus, paymentVerified)}`}>
                    {isPaid ? "Paid" : order.paymentStatus}
                  </span>
                </div>

                <div className="mt-6 space-y-3 rounded-md bg-[#fbfaf7] p-4">
                  <div className="flex gap-3">
                    <Truck size={18} className="mt-0.5 shrink-0 text-[#313b30]" />
                    <div>
                      <p className="text-sm font-bold capitalize">Order status: {order.orderStatus}</p>
                      <p className="mt-1 text-xs leading-5 text-[#5f665b]">
                        Dispatch and tracking details will be shared after order review.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 border-t border-[#eee5d8] pt-3">
                    <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#313b30]" />
                    <p className="text-xs leading-5 text-[#5f665b]">
                      Secure checkout details are verified through the payment provider.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
            <section className="rounded-lg border border-[#eee5d8] bg-white p-5 shadow-[0_8px_24px_rgba(49,59,48,0.04)]">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8d6a3a]">
                <Package size={15} /> Order Items
              </p>
              <div className="mt-4 divide-y divide-[#eee5d8]">
                {order.items.map((item, index) => (
                  <div
                    key={`${itemName(item)}-${index}`}
                    className="grid gap-3 py-4 text-sm first:pt-0 last:pb-0 sm:grid-cols-[1fr_110px_120px] sm:items-center"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-[#101010]">{itemName(item)}</p>
                      <p className="mt-1 text-xs font-medium text-[#6c7068]">
                        {formatCurrency(item.price)} x {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#6c7068]">Qty {item.quantity}</span>
                    <span className="font-semibold text-[#101010] sm:text-right">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <aside className="space-y-5">
              <section className="rounded-lg border border-[#eee5d8] bg-white p-5 shadow-[0_8px_24px_rgba(49,59,48,0.04)]">
                <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8d6a3a]">
                  <MapPin size={15} /> Shipping Address
                </h2>
                <div className="mt-4 text-sm text-[#4f574d]">
                  <p className="font-semibold text-[#101010]">{order.shippingAddress.label}</p>
                  <p className="mt-2 leading-6">
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}<br />
                    {order.shippingAddress.country}
                  </p>
                </div>
              </section>

              <section className="rounded-lg border border-[#eee5d8] bg-white p-5 shadow-[0_8px_24px_rgba(49,59,48,0.04)]">
                <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8d6a3a]">
                  <ShoppingBag size={15} /> What Happens Next
                </h2>
                <div className="mt-4 space-y-4 text-sm">
                  <div className="flex gap-3">
                    <Phone size={17} className="mt-0.5 shrink-0 text-[#313b30]" />
                    <p className="leading-5 text-[#4f574d]">Our team may call to confirm product and delivery details.</p>
                  </div>
                  <div className="flex gap-3">
                    <Home size={17} className="mt-0.5 shrink-0 text-[#313b30]" />
                    <p className="leading-5 text-[#4f574d]">Installation or project support will be coordinated where applicable.</p>
                  </div>
                </div>
              </section>
            </aside>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#8d6a3a] px-6 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#6f542f] print:hidden"
            >
              <Printer size={14} /> Print Order
            </button>
            <Link
              href="/products"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#313b30] px-6 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#1a2119] print:hidden"
            >
              <div className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#313b30] px-6 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#1a2119] print:hidden">

              Continue Shopping <ArrowRight size={14} />
              </div>
            </Link>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-md border border-[#d8d0c4] bg-white px-6 text-xs font-bold uppercase tracking-wide transition-colors hover:bg-stone-50 print:hidden"
            >
              Go to Home Page
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

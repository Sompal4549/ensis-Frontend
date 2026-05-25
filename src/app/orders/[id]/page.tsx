"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Package,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { formatCurrency } from "@/utils";
import { API_URL } from "@/app/lib/api";
import { getPaymentStatus } from "@/utils/payment";

interface OrderItem {
  product: {
    _id: string;
    title: string;
    images?: string[];
  } | string;
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

export default function OrderSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.id as string;
  const isPaymentSuccess = searchParams.get("payment") === "success";

  const [order, setOrder] = useState<Order | null>(null);
  const [paymentVerified, setPaymentVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const savedToken = localStorage.getItem("ensis_user_token");
    if (!savedToken) {
      router.push("/login");
      return;
    }
    setToken(savedToken);

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        // Fetch order details
        const orderRes = await fetch(`${API_URL}/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        const orderPayload = await orderRes.json();
        if (!orderRes.ok || orderPayload.status === "error") {
          throw new Error(orderPayload.message || "Failed to retrieve order details.");
        }

        setOrder(orderPayload.data);

        // Optional payment verification double check
        if (isPaymentSuccess) {
          try {
            const statusRes = await getPaymentStatus(orderId, savedToken);
            if (statusRes.status === "success") {
              setPaymentVerified(true);
            }
          } catch (e) {
            console.warn("Could not verify double-check payment status:", e);
          }
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while loading your order.");
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#fbfaf7] text-slate-600 gap-4">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p className="text-sm font-bold animate-pulse">Loading order confirmation...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#fbfaf7] px-6 text-center gap-4">
        <div className="size-14 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-200">
          <AlertCircle size={28} />
        </div>
        <h1 className="text-xl font-bold text-slate-800">Unable to load order</h1>
        <p className="text-sm max-w-md">{error || "The requested order details could not be found."}</p>
        <Link
          href="/products"
          className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-[#313b30] px-6 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-black"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfaf7] py-12 md:py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          {/* Stunning Success Banner */}
          <div className="text-center mb-10 space-y-4">
            <div className="inline-flex size-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 border-2 border-emerald-100 shadow-[0_8px_30px_rgba(16,185,129,0.1)]">
              <CheckCircle2 size={44} className="stroke-[1.5]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold leading-tight">
              {isPaymentSuccess ? "Order Confirmed!" : "Order Placed Successfully"}
            </h1>
            <p className="text-sm text-slate-500 max-w-lg mx-auto">
              {isPaymentSuccess
                ? "Thank you for your wellness purchase. Your payment was verified securely, and your order has been registered."
                : "Your order details have been saved. If you haven't paid yet, please complete the payment in your dashboard."}
            </p>

            <div className="inline-flex items-center gap-2 rounded-full bg-[#f3eee6] px-4 py-1.5 text-xs font-semibold text-[#6f542f] border border-[#dcd1be]/40">
              <ShieldCheck size={14} /> Securing checkout verification
            </div>
          </div>

          {/* Main Confirmation Content */}
          <div className="grid gap-6">
            {/* Order Overview Card */}
            <div className="rounded-2xl border border-[#eee5d8] bg-white p-6 shadow-[0_8px_24px_rgba(49,59,48,0.01)] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eee5d8] pb-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest">Order Reference</p>
                  <p className="font-mono text-sm font-bold text-slate-800">#{order._id.toUpperCase()}</p>
                </div>
                <div className="flex gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest">Order Date</p>
                    <p className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Calendar size={13} />
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest">Payment Status</p>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border ${
                        order.paymentStatus === "paid" || paymentVerified
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : order.paymentStatus === "failed"
                          ? "bg-rose-50 border-rose-200 text-rose-700"
                          : "bg-[#faf1dc] border-[#e6c878] text-[#8d6a3a]"
                      }`}
                    >
                      {order.paymentStatus === "paid" || paymentVerified ? "PAID" : "PENDING"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Package size={13} /> Items Packaged
                </p>
                <div className="divide-y divide-[#eee5d8]">
                  {order.items.map((item, index) => {
                    const itemName = item.name || (typeof item.product === "object" ? item.product.title : "Product Detail");
                    return (
                      <div key={index} className="py-3.5 flex items-center justify-between text-xs gap-4 first:pt-0 last:pb-0">
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate leading-snug">{itemName}</p>
                          <p className="mt-0.5 text-slate-400 font-semibold">
                            {formatCurrency(item.price)} × {item.quantity}
                          </p>
                        </div>
                        <span className="font-bold text-slate-800">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total Calculation */}
              <div className="border-t border-[#eee5d8] pt-4 flex items-center justify-between">
                <span className="text-sm font-bold">Total Paid Amount</span>
                <span className="text-xl font-bold font-serif">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>

            {/* Delivery target & Info Details */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-[#eee5d8] bg-white p-6 shadow-[0_8px_24px_rgba(49,59,48,0.01)] space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 border-b border-[#eee5d8] pb-3">
                  <MapPin size={13} /> Shipping Address
                </h3>
                <div className="text-xs space-y-1.5 text-slate-700">
                  <p className="font-bold text-slate-800">{order.shippingAddress.label} Destination</p>
                  <p className="leading-5">
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}<br />
                    {order.shippingAddress.country}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#eee5d8] bg-white p-6 shadow-[0_8px_24px_rgba(49,59,48,0.01)] space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 border-b border-[#eee5d8] pb-3">
                  <ShoppingBag size={13} /> What Next?
                </h3>
                <ul className="text-[11px] leading-5 space-y-2 list-disc pl-4">
                  <li>Our wellness equipment team will review your order.</li>
                  <li>You will receive tracking details via email/phone once dispatched.</li>
                  <li>Have queries? Reach us at any time through our Support channels.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="mt-10 flex flex-wrap gap-4 items-center justify-center">
            <Link
              href="/products"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#313b30] px-6 text-xs font-bold uppercase tracking-wide text-white transition-all hover:bg-[#1a2119] hover:translate-y-[-1px] shadow-lg shadow-stone-800/10 cursor-pointer"
            >
              Continue Shopping <ArrowRight size={14} />
            </Link>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#eee5d8] bg-white px-6 text-xs font-bold uppercase tracking-wide transition-all hover:bg-stone-50"
            >
              Go to Home Page
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

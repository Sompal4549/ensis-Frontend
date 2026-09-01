"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  AlertCircle,
  Award,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Download,
  Globe,
  Headset,
  Home,
  Loader2,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { formatCurrency } from "@/utils";
import { API_URL, getImageUrl, getProducts, invoiceApi } from "@/lib/api/api";
import { getPaymentStatus } from "@/utils/payment";
import { authStore } from "@/lib/auth";
import type { Product } from "@/constants";
import ordersBg from "@/assets/orders.png";
import needHelpBg from "@/assets/need-help.png";
import ProductCard from "@/components/products/ProductCard";

const jost = { fontFamily: "var(--font-montserrat), Arial, sans-serif" };

const LOTUS_PATTERN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='92' height='92' viewBox='0 0 92 92'%3E%3Cg fill='none' stroke='%231F3A2A' stroke-width='1'%3E%3Cpath d='M46 8 C28 20 28 40 46 58 C64 40 64 20 46 8Z'/%3E%3Cpath d='M46 20 C34 28 34 44 46 52 C58 44 58 28 46 20Z'/%3E%3Cpath d='M46 8 C30 34 30 62 46 84 C62 62 62 34 46 8Z' opacity='.5'/%3E%3C/g%3E%3C/svg%3E\")";


interface OrderItem {
  product:
    | {
        _id: string;
        title: string;
        images?: string[];
        code?: string;
      }
    | string;
  name?: string;
  price: number;
  quantity: number;
  gstRate?: number;
  finish?: string;
  size?: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  discount?: number;
  couponDiscount?: number;
  shipping?: number;
  tax?: number;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    label: string;
    fullName?: string;
    email?: string;
    landmark?: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  razorpayOrderId?: string;
  transactionId?: string;
  createdAt: string;
}

const TIMELINE_STEPS = [
  { icon: ClipboardCheck, title: "Order Received", text: "We've received your order successfully" },
  { icon: ShieldCheck, title: "Order Verification", text: "Our team is verifying your order details" },
  { icon: Package, title: "Manufacturing / Packaging", text: "Crafting with care & quality check" },
  { icon: Truck, title: "Shipping", text: "Your order will be shipped soon" },
  { icon: Home, title: "Delivery", text: "Safe delivery at your doorstep" },
];

const TRUST_ITEMS = [
  { icon: Lock, label: "SSL Secure Checkout" },
  { icon: BadgeCheck, label: "Genuine ENSIS Products" },
  { icon: Award, label: "Manufacturer Warranty" },
  { icon: ShieldCheck, label: "Secure Payment" },
  { icon: Headset, label: "Expert Support" },
  { icon: Globe, label: "International Delivery" },
];

const HELP_CHANNELS = [
  { icon: Phone, label: "Call Support", value: "+91 99094 45678", href: "tel:+919909445678" },
  { icon: MessageCircle, label: "WhatsApp", value: "Chat on WhatsApp", href: "https://wa.me/919909445678" },
  { icon: Mail, label: "Email", value: "support@ensis.in", href: "mailto:support@ensis.in" },
];

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


function itemImage(item: OrderItem) {
  const raw =
    typeof item.product === "object" && item.product.images?.[0]
      ? item.product.images[0]
      : "";
  return getImageUrl(raw);
}

function categoryLabel(category: any): string {
  if (typeof category === "string") return category;
  if (category && typeof category === "object") {
    return category.name || category.title || "ENSIS";
  }
  return "ENSIS";
}


function gstBreakdown(items: OrderItem[]): { rate: number; amount: number }[] {
  const map = new Map<number, number>();
  for (const item of items) {
    const rate = item.gstRate ?? 5;
    map.set(rate, (map.get(rate) ?? 0) + (item.price * item.quantity * rate) / 100);
  }
  return [...map.entries()]
    .map(([rate, amount]) => ({ rate, amount: Math.round(amount) }))
    .sort((a, b) => a.rate - b.rate);
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
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = authStore.isLoggedIn() ? authStore.getToken() : "";

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
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        const orderPayload = await orderRes.json();
        if (!orderRes.ok || orderPayload.status === "error") {
          throw new Error(orderPayload.message || "Failed to retrieve order details.");
        }
        const snapshot = readOrderSnapshot(orderId);
        const serverOrder = orderPayload.data as Order;
        const mergedOrder = snapshot
          ? {
              ...serverOrder,
              shippingAddress: {
                ...serverOrder.shippingAddress,
                fullName: snapshot.shippingAddress.fullName || serverOrder.shippingAddress.fullName,
                email: snapshot.shippingAddress.email || serverOrder.shippingAddress.email,
                landmark: snapshot.shippingAddress.landmark || serverOrder.shippingAddress.landmark,
                phone: serverOrder.shippingAddress.phone || snapshot.shippingAddress.phone,
              },
            }
          : serverOrder;
        setOrder(mergedOrder.totalAmount > 0 ? mergedOrder : snapshot ?? serverOrder);

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

  useEffect(() => {
    let mounted = true;
    getProducts()
      .then((products) => {
        if (!mounted) return;
        const orderIds = new Set(
          order?.items.map((item) => (typeof item.product === "object" ? item.product._id : item.product)) ?? []
        );
        const available = products.filter((p) => !orderIds.has(p._id) && p.isActive).slice(0, 4);
        setRecommended(available.length > 0 ? available : products.filter((p) => p.isActive).slice(0, 4));
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, [order]);

  const handleDownloadInvoice = async () => {
    if (!order) return;
    setInvoiceLoading(true);
    try {
      const invoice = await invoiceApi.createFromOrder(order._id);
      const html = await invoiceApi.getHtml(invoice._id);
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `ENSIS-Invoice-${invoice.invoiceNumber}.html`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
      setToast("Invoice downloaded");
      setTimeout(() => setToast(null), 2500);
    } catch (err) {
      console.error("Failed to download invoice:", err);
      setToast("Failed to download invoice");
      setTimeout(() => setToast(null), 2500);
    } finally {
      setInvoiceLoading(false);
    }
  };

  const handleTrackOrder = () => {
    document.getElementById("whats-next")?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#FCFAF6]" style={jost}>
        <Loader2 className="h-8 w-8 animate-spin text-[#1F3A2A]" />
        <p className="text-sm font-medium tracking-wide text-[#5f665b]">Loading your order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#FCFAF6] px-6 text-center" style={jost}>
        <div className="flex size-14 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-500">
          <AlertCircle size={26} />
        </div>
        <h1 className="text-xl font-semibold text-[#1F3A2A]">Unable to load order</h1>
        <p className="max-w-md text-sm leading-6 text-[#5f665b]">
          {error || "The requested order details could not be found."}
        </p>
        <Link
          href="/products"
          className="mt-2 inline-flex h-9 items-center justify-center rounded-full bg-[#1F3A2A] px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-[#2F4A3A] hover:shadow-lg"
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
  const recipientName = order.shippingAddress.fullName || order.shippingAddress.label;
  const transactionRef = order.transactionId || order.razorpayOrderId || order._id;

  const formatOrderNumber = (id: string) => {
    const date = new Date(order.createdAt);
    const year = date.getFullYear();
    const shortId = id.slice(-6).toUpperCase();
    return `ENS-${year}-${shortId}`;
  };

  const orderTime = new Date(order.createdAt).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const infoCards = [
    { label: "Order Number", value: formatOrderNumber(order._id), copyable: true, mono: true },
    { label: "Order Date", value: `${orderDate}\n${orderTime}`, mono: false },
    {
      label: "Payment",
      value: isPaid ? "Paid" : order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1),
      mono: false,
      accent: isPaid ? "text-[#2F7D5A]" : "text-[#8d6a3a]",
      badge: isPaid,
    },
    {
      label: "Order Status",
      value: order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1),
      mono: false,
      badge: order.orderStatus === "confirmed" || order.orderStatus === "delivered",
    },
    { label: "Total Amount", value: formatCurrency(order.totalAmount), mono: false, highlight: true },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FCFAF6]" style={jost}>
      {/* === FULL WIDTH BANNER with orders.png === */}
      <div
        className="relative w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${ordersBg.src || ordersBg})` }}
      >
        <div className="flex flex-col items-center px-6 py-14 text-center md:py-20">
          <div className="relative">
            <div className="absolute -inset-2 rounded-full bg-emerald-100/40 blur-xl" aria-hidden="true" />
            <div className="relative flex size-16 items-center justify-center rounded-full border-[4px] border-[#E8E0C8] bg-gradient-to-br from-[#F5F0E4] to-[#E8E0C8] shadow-[0_8px_24px_rgba(139,106,58,0.20)]">
              <CheckCircle2 size={32} className="text-[#3a7d44]" strokeWidth={1.8} />
            </div>
          </div>

          <h1 className="mt-5 text-3xl font-medium tracking-tight text-[#1F3A2A] md:text-4xl">
            Thank You for Your Order
          </h1>
          <p className="mt-2 max-w-2xl text-base leading-6 text-[#5f665b]">
            Your order has been placed successfully and is now confirmed.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-5">
            <span className="inline-flex items-center gap-1.5 text-base font-medium tracking-wide text-[#5f665b]">
              <Mail size={13} className="text-[#8d6a3a]" />
              Confirmation sent to your phone
            </span>
            {order.shippingAddress.phone && (
              <span className="inline-flex items-center gap-1.5 text-base font-medium tracking-wide text-[#5f665b]">
                <Phone size={13} className="text-[#8d6a3a]" />
                {order.shippingAddress.phone}
              </span>
            )}
          </div>
        </div>
      </div>

      <Container className="relative z-10">
        {/* === INFO CARDS (overlapping banner) === */}
        <section className="-mt-8 relative z-20 rounded-xl border border-[#EDE4D3] bg-white shadow-[0_10px_28px_rgba(31,58,42,0.08)]">
          <div className="grid grid-cols-2 md:grid-cols-5">
            {infoCards.map((card, idx) => (
              <div
                key={card.label}
                className={`relative flex flex-col items-start px-4 py-3.5 ${idx < infoCards.length - 1 ? "border-r border-[#F0E8DC]" : ""} ${idx < infoCards.length - 2 ? "max-md:border-b max-md:border-r-0 max-md:border-[#F0E8DC] md:border-b-0" : ""} ${idx === infoCards.length - 2 ? "max-md:border-b-0" : ""}`}
              >
                <p className="text-base font-bold uppercase tracking-[0.14em] text-[#a89a82]">{card.label}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <p className={`text-base font-semibold text-[#1F3A2A] ${card.mono ? "font-mono" : ""} ${card.accent ?? ""} ${card.highlight ? "font-bold text-[#C7A55B]" : ""} ${card.label === "Order Date" ? "whitespace-pre-line" : ""}`}>
                    {card.value}
                  </p>
                  {card.badge && (
                    <CheckCircle2 size={13} className="text-[#2F7D5A]" strokeWidth={2} />
                  )}
                  {card.copyable && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(order._id);
                        setToast("Order ID copied");
                        setTimeout(() => setToast(null), 2000);
                      }}
                      className="text-[#a89a82] transition-colors hover:text-[#1F3A2A]"
                      title="Copy Order ID"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* === MAIN GRID: Summary + Shipping/Payment === */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          {/* ORDER SUMMARY */}
          <section className="self-start rounded-2xl border border-[#EDE4D3] bg-white shadow-[0_14px_36px_rgba(31,58,42,0.06)]">
            <div className="border-b border-[#F0E8DC] px-4 py-3 md:px-5">
              <h3 className="text-base font-bold uppercase tracking-[0.16em] text-[#1F3A2A]">
                Order Summary
              </h3>
            </div>

            <div className="px-4 py-2 md:px-5">
              <div className="divide-y divide-[#F3EBDE]">
                {order.items.map((item, index) => (
                  <div
                    key={`${itemName(item)}-${index}`}
                    className="flex items-start gap-3 py-3 md:gap-4"
                  >
                    <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#F0E8DC] bg-[#FBF8F2]">
                      {itemImage(item) ? (
                        <Image
                          src={itemImage(item)}
                          alt={itemName(item)}
                          width={64}
                          height={64}
                          crossOrigin="anonymous"
                          className="size-full object-cover"
                        />
                      ) : (
                        <Package size={22} className="text-[#C7A55B]" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${typeof item.product === "object" ? item.product._id : ""}`}
                        className="block"
                      >
                        <p className="text-base font-semibold text-[#1F3A2A] transition-colors hover:text-[#8d6a3a]">
                          {itemName(item)}
                        </p>
                      </Link>
                      {(item.finish || item.size) && (
                        <p className="mt-0.5 text-base text-[#8d6a3a]">
                          {[item.finish && `Finish: ${item.finish}`, item.size && `Size: ${item.size}`]
                            .filter(Boolean)
                            .join("  |  ")}
                        </p>
                      )}
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-base text-[#5f665b]">Qty: {item.quantity}</span>
                        <span className="text-base font-semibold text-[#1F3A2A]">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2 space-y-2 border-t border-[#F3EBDE] pt-3">
                <div className="flex items-center justify-between text-base">
                  <span className="text-[#5f665b]">Subtotal</span>
                  <span className="font-semibold text-[#1F3A2A]">
                    {formatCurrency(order.items.reduce((s, i) => s + i.price * i.quantity, 0))}
                  </span>
                </div>
                {order.discount ? (
                  <div className="flex items-center justify-between text-base">
                    <span className="text-[#5f665b]">Discount</span>
                    <span className="font-semibold text-[#2F7D5A]">- {formatCurrency(order.discount)}</span>
                  </div>
                ) : null}
                {order.couponDiscount ? (
                  <div className="flex items-center justify-between text-base">
                    <span className="text-[#5f665b]">Coupon Discount</span>
                    <span className="font-semibold text-[#2F7D5A]">- {formatCurrency(order.couponDiscount)}</span>
                  </div>
                ) : null}
                {(() => {
                  const lines = gstBreakdown(order.items);
                  if (!lines.length) {
                    return order.tax ? (
                      <div className="flex items-center justify-between text-base">
                        <span className="text-[#5f665b]">GST</span>
                        <span className="font-semibold text-[#1F3A2A]">{formatCurrency(order.tax)}</span>
                      </div>
                    ) : null;
                  }
                  return (
                    <>
                      {lines.map((t) => (
                        <div key={t.rate} className="flex items-center justify-between text-base">
                          <span className="text-[#5f665b]">GST ({t.rate}%)</span>
                          <span className="font-semibold text-[#1F3A2A]">{formatCurrency(t.amount)}</span>
                        </div>
                      ))}
                    </>
                  );
                })()}
                <div className="flex items-center justify-between text-base">
                  <span className="text-[#5f665b]">Shipping</span>
                  <span className="font-semibold text-[#1F3A2A]">
                    {order.shipping && order.shipping > 0 ? formatCurrency(order.shipping) : "FREE"}
                  </span>
                </div>
                <div className="border-t border-[#F3EBDE] pt-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold uppercase tracking-[0.12em] text-[#1F3A2A]">Grand Total</span>
                      <p className="mt-0.5 text-base text-[#8d6a3a]">Inclusive of all taxes</p>
                    </div>
                    <span className="text-lg font-bold text-[#C7A55B]">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* DELIVERY & PAYMENT */}
          <div className="space-y-0">
            <section className="rounded-2xl border border-[#EDE4D3] bg-white shadow-[0_14px_36px_rgba(31,58,42,0.06)]">
              <div className="border-b border-[#F0E8DC] px-4 py-3 md:px-5">
                <h3 className="text-base font-bold uppercase tracking-[0.16em] text-[#1F3A2A]">
                  Delivery & Payment
                </h3>
              </div>

              {/* Shipping Details */}
              <div className="px-4 py-3 md:px-5">
                <h4 className="mb-3 flex items-center gap-2 text-base font-bold uppercase tracking-[0.14em] text-[#8d6a3a]">
                  <MapPin size={13} className="text-[#C7A55B]" />
                  Shipping Details
                </h4>
                <div className="space-y-2 text-base">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#5f665b]">Name</span>
                    <span className="font-semibold text-[#1F3A2A]">{recipientName}</span>
                  </div>
                  {order.shippingAddress.phone && (
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[#5f665b]">Phone</span>
                      <span className="font-semibold text-[#1F3A2A]">{order.shippingAddress.phone}</span>
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[#5f665b]">Address</span>
                    <span className="text-right font-semibold text-[#1F3A2A]">
                      {order.shippingAddress.street}
                      {order.shippingAddress.landmark ? `, ${order.shippingAddress.landmark}` : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#5f665b]">City</span>
                    <span className="font-semibold text-[#1F3A2A]">{order.shippingAddress.city}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#5f665b]">State</span>
                    <span className="font-semibold text-[#1F3A2A]">{order.shippingAddress.state}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#5f665b]">Postal Code</span>
                    <span className="font-semibold text-[#1F3A2A]">{order.shippingAddress.postalCode}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#5f665b]">Country</span>
                    <span className="font-semibold text-[#1F3A2A]">{order.shippingAddress.country}</span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="mx-4 border-t border-[#F0E8DC] md:mx-5" />

              {/* Payment Details */}
              <div className="px-4 py-3 md:px-5">
                <h4 className="mb-3 flex items-center gap-2 text-base font-bold uppercase tracking-[0.14em] text-[#8d6a3a]">
                  <CreditCard size={13} className="text-[#C7A55B]" />
                  Payment Details
                </h4>
                <div className="space-y-2 text-base">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#5f665b]">Payment Method</span>
                    <span className="font-semibold text-[#1F3A2A]">Razorpay (UPI)</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#5f665b]">Payment Status</span>
                    <span className={`inline-flex items-center gap-1 font-semibold ${isPaid ? "text-[#2F7D5A]" : "text-[#8d6a3a]"}`}>
                      {isPaid ? "Paid" : "Pending"}
                      {isPaid && <CheckCircle2 size={13} strokeWidth={2} />}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#5f665b]">Transaction ID</span>
                    <span className="max-w-[55%] truncate font-mono text-base font-semibold text-[#1F3A2A]">
                      {transactionRef}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-[#F3EBDE] pt-2.5">
                    <span className="text-[#5f665b]">Billing Amount</span>
                    <span className="text-base font-semibold text-[#1F3A2A]">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* === WHAT HAPPENS NEXT — Timeline === */}
        <section id="whats-next" className="mt-4 rounded-2xl border border-[#EDE4D3] bg-white px-4 py-5 shadow-[0_14px_36px_rgba(31,58,42,0.06)] md:px-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold uppercase tracking-[0.16em] text-[#1F3A2A]">
              What Happens Next?
            </h3>
          </div>

          <div className="relative mt-5 grid gap-5 md:grid-cols-5 md:gap-0">
            <div className="absolute top-4 right-[10%] left-[10%] hidden h-px bg-gradient-to-r from-[#D8C9A8] via-[#C7A55B]/60 to-[#D8C9A8] md:block" aria-hidden="true" />
            {TIMELINE_STEPS.map((step, index) => (
              <div key={step.title} className="relative flex items-start gap-4 md:flex-col md:items-center md:gap-0 md:text-center">
                <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-[#D8C9A8] bg-white text-[#8d6a3a] shadow-sm transition-all duration-300 hover:border-[#C7A55B] hover:bg-[#1F3A2A] hover:text-[#C7A55B]">
                  <step.icon size={16} strokeWidth={1.8} />
                </div>
                <div className="md:mt-3">
                  <p className="text-base font-bold uppercase tracking-[0.12em] text-[#C7A55B]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-0.5 text-base font-bold uppercase tracking-[0.10em] text-[#1F3A2A]">
                    {step.title}
                  </p>
                  <p className="mt-0.5 max-w-[180px] text-base leading-4 text-[#8d6a3a]">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* === TRUST SECTION — Horizontal Strap === */}
        <section className="mt-4 rounded-xl border border-[#EDE4D3] bg-white/80 backdrop-blur-sm shadow-[0_8px_24px_rgba(31,58,42,0.04)]">
          <div className="flex flex-wrap items-center justify-between divide-x divide-[#EDE4D3]">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2.5 px-4 py-3 transition-colors duration-300 hover:bg-[#FBF8F2]"
              >
                <item.icon size={18} strokeWidth={1.6} className="text-[#8d6a3a]" />
                <p className="whitespace-nowrap text-base font-semibold text-[#1F3A2A]">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* === ACTION BUTTONS === */}
        <section className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <Link
            href="/products"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#1F3A2A] px-6 text-base font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_30px_rgba(31,58,42,0.28)] transition-all duration-300 hover:bg-[#2F4A3A] hover:shadow-[0_16px_38px_rgba(31,58,42,0.36)] active:scale-[0.98]"
          >
            <ShoppingBag size={13} /> Continue Shopping
          </Link>
          <button
            type="button"
            onClick={handleDownloadInvoice}
            disabled={invoiceLoading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#1F3A2A]/20 bg-white px-6 text-base font-bold uppercase tracking-[0.14em] text-[#1F3A2A] shadow-[0_10px_26px_rgba(31,58,42,0.08)] transition-all duration-300 hover:border-[#C7A55B] hover:text-[#8d6a3a] hover:shadow-[0_14px_32px_rgba(31,58,42,0.14)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {invoiceLoading ? (
              <>
                <Loader2 size={13} className="animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Download size={13} /> Download Invoice
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleTrackOrder}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#1F3A2A]/20 bg-white px-6 text-base font-bold uppercase tracking-[0.14em] text-[#1F3A2A] shadow-[0_10px_26px_rgba(31,58,42,0.08)] transition-all duration-300 hover:border-[#C7A55B] hover:text-[#8d6a3a] hover:shadow-[0_14px_32px_rgba(31,58,42,0.14)] active:scale-[0.98]"
          >
            <MapPin size={13} /> Track Order
          </button>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#EDE4D3] bg-transparent px-6 text-base font-bold uppercase tracking-[0.14em] text-[#8d6a3a] transition-all duration-300 hover:border-[#D8C9A8] hover:bg-white hover:text-[#1F3A2A] hover:shadow-[0_10px_26px_rgba(31,58,42,0.08)] active:scale-[0.98]"
          >
            <Home size={13} /> Return Home
          </Link>
        </section>

        {/* === HELP SECTION === */}
        <section className="mt-5 -mx-4 overflow-hidden rounded-none bg-[#1F3A2A] bg-cover bg-center bg-no-repeat shadow-[0_20px_50px_rgba(31,58,42,0.30)] sm:mx-0 sm:rounded-2xl" style={{ backgroundImage: `url(${needHelpBg.src || needHelpBg})` }}>
          <div className="relative px-5 py-6 pr-12 md:px-8 md:pr-20">
            <div className="absolute inset-0 bg-[#1F3A2A]/80" aria-hidden="true" />
            <div className="absolute -top-24 -right-24 size-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(199,165,91,0.15),transparent_70%)]" aria-hidden="true" />
            <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              {/* Left: Text */}
              <div>
                <h3 className="text-lg font-medium tracking-tight text-white">Need Help With Your Order?</h3>
                <p className="mt-1 text-base leading-5 text-white/60">
                  Our wellness specialists are available Mon–Sat (9:00 AM – 7:00 PM)
                  <br className="hidden md:block" /> to assist you with your order, setup, or any questions.
                </p>
              </div>

              {/* Right: Channel Cards */}
              <div className="flex gap-4">
                {HELP_CHANNELS.map((channel) => (
                  <a
                    key={channel.label}
                    href={channel.href}
                    target={channel.href.startsWith("http") ? "_blank" : undefined}
                    rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex flex-col items-center gap-2 rounded-2xl border border-[#C7A55B]/30 bg-transparent px-4 py-3 transition-all duration-300 hover:border-[#C7A55B]/60 hover:bg-white/[0.05]"
                  >
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#C7A55B]/15 text-[#C7A55B] transition-colors duration-300 group-hover:bg-[#C7A55B] group-hover:text-[#1F3A2A]">
                      <channel.icon size={18} strokeWidth={1.8} />
                    </div>
                    <div className="text-center">
                      <p className="text-base font-bold text-white">{channel.label}</p>
                      <p className="mt-0.5 whitespace-nowrap text-base text-white/60">{channel.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* === RECOMMENDED PRODUCTS === */}
        {recommended.length > 0 && (
          <section className="mt-8">
            <div className="text-center">
              <h3 className="text-xl font-medium tracking-tight text-[#1F3A2A] md:text-2xl">Curated For You</h3>
              <p className="mt-1 text-base text-[#8d6a3a]">You may also like</p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {recommended.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}
      </Container>

      {/* === Toast === */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2">
          <div className="flex items-center gap-4 rounded-full border border-[#D8C9A8] bg-[#1F3A2A] px-4 py-2 text-xs font-semibold tracking-wide text-white shadow-[0_16px_40px_rgba(31,58,42,0.35)]">
            <BadgeCheck size={13} className="text-[#C7A55B]" />
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
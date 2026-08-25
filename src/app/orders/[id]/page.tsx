"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  AlertCircle,
  Award,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  CreditCard,
  Download,
  Globe,
  Hash,
  Headset,
  Home,
  IndianRupee,
  Loader2,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  PackageCheck,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { formatCurrency } from "@/utils";
import { API_URL, getImageUrl, getProducts } from "@/lib/api/api";
import { getPaymentStatus } from "@/utils/payment";
import { authStore } from "@/lib/auth";
import { useShop, type ShopProduct } from "@/context/ShopContext";
import type { Product } from "@/constants";

const jost = { fontFamily: "var(--font-montserrat), Arial, sans-serif" };

const LOTUS_PATTERN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='92' height='92' viewBox='0 0 92 92'%3E%3Cg fill='none' stroke='%231F3A2A' stroke-width='1'%3E%3Cpath d='M46 8 C28 20 28 40 46 58 C64 40 64 20 46 8Z'/%3E%3Cpath d='M46 20 C34 28 34 44 46 52 C58 44 58 28 46 20Z'/%3E%3Cpath d='M46 8 C30 34 30 62 46 84 C62 62 62 34 46 8Z' opacity='.5'/%3E%3C/g%3E%3C/svg%3E\")";

const LEAF_PATTERN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%231F3A2A' stroke-width='1'%3E%3Cpath d='M60 20 C74 34 74 54 60 66 C46 54 46 34 60 20Z'/%3E%3Cpath d='M60 34 C68 40 68 52 60 58 C52 52 52 40 60 34Z'/%3E%3Cpath d='M40 74 C52 66 68 66 80 74 C68 82 52 82 40 74Z'/%3E%3Cpath d='M60 66 L60 96' stroke-dasharray='3 5'/%3E%3C/g%3E%3C/svg%3E\")";

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
  { icon: ClipboardCheck, title: "Order Received", text: "Your order has been registered in our system." },
  { icon: ShieldCheck, title: "Order Verification", text: "Our team reviews payment and delivery details." },
  { icon: Package, title: "Manufacturing / Packaging", text: "Your ENSIS wellness equipment is prepared with care." },
  { icon: Truck, title: "Shipping", text: "Dispatched with tracking shared on your phone." },
  { icon: Home, title: "Delivery", text: "Safely delivered and unboxed at your doorstep." },
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
  { icon: Phone, label: "Call Support", value: "+91 98765 43210" },
  { icon: MessageCircle, label: "WhatsApp", value: "Chat with our team" },
  { icon: Mail, label: "Email", value: "care@ensis.in" },
  { icon: Headset, label: "Live Chat", value: "Available 9:30–7:00 IST" },
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

function itemCode(item: OrderItem) {
  return typeof item.product === "object" && item.product.code ? item.product.code : "";
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

function paymentBadgeClass(status: Order["paymentStatus"], verified: boolean) {
  if (status === "paid" || verified) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (status === "failed") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }
  return "border-[#ead28b] bg-[#fff6df] text-[#8d6a3a]";
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

function buildInvoice(order: Order, orderDate: string): string {
  const rows = order.items
    .map(
      (item) => `<tr>
        <td style="padding:10px 12px;border-bottom:1px solid #ece3d2">${itemName(item)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #ece3d2;text-align:center">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #ece3d2;text-align:right">${formatCurrency(item.price)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #ece3d2;text-align:right">${formatCurrency(item.price * item.quantity)}</td>
      </tr>`
    )
    .join("");

  const taxLines = gstBreakdown(order.items);
  const taxHtml = taxLines.length
    ? taxLines
        .map((t) => `<p style="margin:4px 0">GST (${t.rate}%): ${formatCurrency(t.amount)}</p>`)
        .join("") +
      `<p style="margin:4px 0;font-weight:600">Total GST: ${formatCurrency(taxLines.reduce((s, t) => s + t.amount, 0))}</p>`
    : order.tax
      ? `<p style="margin:4px 0">GST: ${formatCurrency(order.tax)}</p>`
      : "";

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>ENSIS Invoice ${order._id}</title></head>
<body style="margin:0;font-family:Jost,Arial,sans-serif;background:#FCFAF6;color:#1F3A2A">
<div style="max-width:760px;margin:40px auto;background:#fff;border:1px solid #EDE4D3;border-radius:20px;overflow:hidden">
<div style="background:#1F3A2A;padding:32px 40px;color:#fff">
<div style="margin:0;font-size:22px;letter-spacing:.14em;text-transform:uppercase;font-weight:700">ENSIS</div>
<p style="margin:6px 0 0;font-size:12px;color:#C7A55B;letter-spacing:.1em">TAX INVOICE</p>
</div>
<div style="padding:32px 40px">
<div style="display:flex;justify-content:space-between;gap:24px;flex-wrap:wrap">
<div>
<p style="margin:0;font-size:11px;color:#8d6a3a;letter-spacing:.12em;text-transform:uppercase">Invoice No</p>
<p style="margin:4px 0 0;font-size:14px;font-weight:600">${order._id}</p>
<p style="margin:14px 0 0;font-size:11px;color:#8d6a3a;letter-spacing:.12em;text-transform:uppercase">Date</p>
<p style="margin:4px 0 0;font-size:14px;font-weight:600">${orderDate}</p>
</div>
<div style="text-align:right">
<p style="margin:0;font-size:11px;color:#8d6a3a;letter-spacing:.12em;text-transform:uppercase">Bill To</p>
<p style="margin:4px 0 0;font-size:14px;font-weight:600">${order.shippingAddress.fullName || order.shippingAddress.label}</p>
<p style="margin:2px 0 0;font-size:12px">${order.shippingAddress.street}${order.shippingAddress.landmark ? ", " + order.shippingAddress.landmark : ""}</p>
<p style="margin:2px 0 0;font-size:12px">${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}</p>
<p style="margin:2px 0 0;font-size:12px">${order.shippingAddress.country}</p>
<p style="margin:2px 0 0;font-size:12px">Tel: ${order.shippingAddress.phone || ""}</p>
</div>
</div>
<table style="width:100%;margin-top:28px;border-collapse:collapse;font-size:13px">
<thead><tr style="background:#F7F2E9">
<th style="padding:10px 12px;text-align:left">Item</th><th style="padding:10px 12px">Qty</th><th style="padding:10px 12px;text-align:right">Unit Price</th><th style="padding:10px 12px;text-align:right">Total</th>
</tr></thead>
<tbody>${rows}</tbody>
</table>
<div style="margin-top:20px;text-align:right;font-size:13px">
<p style="margin:4px 0">Subtotal: <strong>${formatCurrency(order.items.reduce((s, i) => s + i.price * i.quantity, 0))}</strong></p>
${order.discount ? `<p style="margin:4px 0;color:#2F7D5A">Promo Discount: - ${formatCurrency(order.discount)}</p>` : ""}
${order.couponDiscount ? `<p style="margin:4px 0;color:#2F7D5A">Coupon Discount: - ${formatCurrency(order.couponDiscount)}</p>` : ""}
${order.shipping ? `<p style="margin:4px 0">Shipping: ${formatCurrency(order.shipping)}</p>` : '<p style="margin:4px 0">Shipping: FREE</p>'}
${taxHtml}
<p style="margin:10px 0 0;font-size:16px;border-top:1px solid #EDE4D3;padding-top:10px">Grand Total (incl. GST): <strong>${formatCurrency(order.totalAmount)}</strong></p>
</div>
<p style="margin-top:28px;font-size:11px;color:#6c7068;text-align:center">Thank you for choosing ENSIS — Premium Wellness & Panchkarma Spaces.<br>This is a computer generated invoice.</p>
</div></div></body></html>`;
}

function Stars({ rating }: { rating: number }) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={
            i <= rounded
              ? "fill-[#C7A55B] text-[#C7A55B]"
              : i - 0.5 === rounded
                ? "fill-[#C7A55B]/50 text-[#C7A55B]"
                : "fill-[#E8E0D2] text-[#E8E0D2]"
          }
        />
      ))}
    </span>
  );
}

export default function OrderPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.id as string;
  const isPaymentSuccess = searchParams.get("payment") === "success";

  const { addToCart } = useShop();

  const [order, setOrder] = useState<Order | null>(null);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommended, setRecommended] = useState<Product[]>([]);
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

  const handleDownloadInvoice = () => {
    if (!order) return;
    const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const blob = new Blob([buildInvoice(order, orderDate)], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `ENSIS-Invoice-${order._id}.html`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    setToast("Invoice downloaded");
    setTimeout(() => setToast(null), 2500);
  };

  const handleTrackOrder = () => {
    document.getElementById("whats-next")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAddToCart = (product: Product) => {
    const shopProduct: ShopProduct = {
      id: product.id.toString(),
      slug: product.slug,
      name: product.title,
      category: product.category,
      price: product.price,
      image: getImageUrl(product.images[0]),
    };
    addToCart(shopProduct);
    setToast(`"${product.title}" added to cart`);
    setTimeout(() => setToast(null), 2500);
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

  const infoCards = [
    { icon: Hash, label: "Order ID", value: order._id, mono: true },
    { icon: CalendarDays, label: "Order Date", value: orderDate, mono: false },
    {
      icon: CreditCard,
      label: "Payment Status",
      value: isPaid ? "Paid" : order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1),
      mono: false,
      accent: isPaid ? "text-[#2F7D5A]" : "text-[#8d6a3a]",
    },
    {
      icon: PackageCheck,
      label: "Order Status",
      value: order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1),
      mono: false,
    },
    { icon: IndianRupee, label: "Total Amount", value: formatCurrency(order.totalAmount), mono: false },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FCFAF6]" style={jost}>
      {/* === Decorative premium background (3–6% opacity) === */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 -right-40 size-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(199,165,91,0.10),transparent_70%)]" />
        <div className="absolute top-1/3 -left-56 size-[620px] rounded-full bg-[radial-gradient(circle_at_center,rgba(31,58,42,0.07),transparent_70%)]" />
        <div className="absolute bottom-0 right-0 size-[480px] rounded-full bg-[radial-gradient(circle_at_center,rgba(122,143,105,0.08),transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: LOTUS_PATTERN }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: LEAF_PATTERN, backgroundSize: "120px 120px" }} />
        <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(115deg, rgba(31,58,42,0.012) 0 2px, transparent 2px 18px)" }} />
      </div>

      {/* === Gold corner ornaments === */}
      <div className="pointer-events-none absolute inset-x-0 top-10 z-0 flex justify-between px-8 opacity-60" aria-hidden="true">
        <svg width="36" height="36" viewBox="0 0 42 42" fill="none" className="rotate-180 text-[#C7A55B]">
          <path d="M1 41 V21 C1 10 10 1 21 1 H41" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="21" cy="21" r="3" stroke="currentColor" strokeWidth="1.2" />
          <path d="M1 30 C8 30 12 26 12 19" stroke="currentColor" strokeWidth="1" opacity="0.7" />
        </svg>
        <svg width="36" height="36" viewBox="0 0 42 42" fill="none" className="text-[#C7A55B]">
          <path d="M1 41 V21 C1 10 10 1 21 1 H41" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="21" cy="21" r="3" stroke="currentColor" strokeWidth="1.2" />
          <path d="M1 30 C8 30 12 26 12 19" stroke="currentColor" strokeWidth="1" opacity="0.7" />
        </svg>
      </div>

      <Container className="relative z-10 pt-10 pb-10">
        {/* === HERO: Thank You card === */}
        <section className="relative overflow-hidden rounded-[24px] border border-[#EDE4D3] bg-white shadow-[0_24px_60px_rgba(31,58,42,0.10)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(199,165,91,0.08),transparent_55%)]" aria-hidden="true" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: LOTUS_PATTERN }} aria-hidden="true" />
          <div className="relative flex flex-col items-center px-6 py-8 text-center md:px-10 md:py-9">
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-emerald-100/60 blur-xl" aria-hidden="true" />
              <div className="relative flex size-16 items-center justify-center rounded-full border-[5px] border-[#EDF5EE] bg-gradient-to-br from-[#E8F3EA] to-[#D3E7D8] shadow-[0_12px_30px_rgba(47,125,90,0.25)]">
                <CheckCircle2 size={32} className="text-[#2F7D5A]" strokeWidth={1.6} />
              </div>
            </div>

            <span className={`mt-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${paymentBadgeClass(order.paymentStatus, paymentVerified)}`}>
              <ShieldCheck size={11} />
              {isPaid ? "Payment Successful" : "Order Received"}
            </span>

            <h1 className="mt-3 text-2xl font-medium tracking-tight text-[#1F3A2A] md:text-4xl">
              Thank You for Your Order
            </h1>
            <p className="mt-2 max-w-2xl text-xs leading-6 text-[#5f665b] md:text-sm">
              Your ENSIS wellness order has been received. Our dedicated team is reviewing the details
              and will contact you shortly to confirm delivery and installation support.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EDE4D3] bg-[#FBF8F2] px-3 py-1.5 text-[11px] font-semibold tracking-wide text-[#1F3A2A]">
                <ShoppingBag size={12} className="text-[#C7A55B]" />
                {order.items.reduce((sum, item) => sum + item.quantity, 0)} item
                {order.items.reduce((sum, item) => sum + item.quantity, 0) !== 1 ? "s" : ""}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EDE4D3] bg-[#FBF8F2] px-3 py-1.5 text-[11px] font-semibold tracking-wide text-[#1F3A2A]">
                <Clock size={12} className="text-[#C7A55B]" />
                Confirmation sent to your phone
              </span>
            </div>
          </div>
        </section>

        {/* === ORDER INFORMATION CARDS === */}
        <section className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {infoCards.map((card) => (
            <div
              key={card.label}
              className="group rounded-[20px] border border-[#EDE4D3] bg-white p-3 shadow-[0_10px_28px_rgba(31,58,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D8C9A8] hover:shadow-[0_18px_40px_rgba(31,58,42,0.12)]"
            >
              <div className="flex size-8 items-center justify-center rounded-xl bg-[#F2EDE2] text-[#8d6a3a] transition-colors duration-300 group-hover:bg-[#1F3A2A] group-hover:text-[#C7A55B]">
                <card.icon size={15} strokeWidth={1.8} />
              </div>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8d6a3a]">{card.label}</p>
              <p className={`mt-1 truncate text-xs font-semibold text-[#1F3A2A] ${card.mono ? "font-mono text-[11px]" : ""} ${card.accent ?? ""}`}>
                {card.value}
              </p>
            </div>
          ))}
        </section>

        {/* === MAIN GRID: Summary + Shipping/Payment === */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          {/* ORDER SUMMARY */}
          <section className="self-start rounded-[24px] border border-[#EDE4D3] bg-white shadow-[0_14px_36px_rgba(31,58,42,0.06)]">
            <div className="flex items-center justify-between border-b border-[#F0E8DC] px-4 py-3 md:px-5">
              <h3 className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.16em] text-[#1F3A2A]">
                <span className="flex size-7 items-center justify-center rounded-lg bg-[#1F3A2A] text-[#C7A55B]">
                  <ShoppingBag size={13} />
                </span>
                Order Summary
              </h3>
              <span className="rounded-full bg-[#F7F2E9] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#8d6a3a]">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="px-4 py-2 md:px-5">
              {/* Header row — flex with fixed column widths so it always aligns in one row */}
              <div className="hidden items-center gap-4 px-1 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#a89a82] md:flex">
                <span className="w-[56px] shrink-0">Item</span>
                <span className="flex-1">Product</span>
                <span className="w-[48px] shrink-0 text-center">Qty</span>
                <span className="w-[80px] shrink-0 text-right">Unit Price</span>
                <span className="w-[90px] shrink-0 text-right">Total</span>
              </div>

              <div className="divide-y divide-[#F3EBDE]">
                {order.items.map((item, index) => (
                  <div
                    key={`${itemName(item)}-${index}`}
                    className="flex flex-wrap items-center gap-4 py-3 md:flex-nowrap md:px-1"
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#F0E8DC] bg-[#FBF8F2] md:w-[56px]">
                      {itemImage(item) ? (
                        <Image
                          src={itemImage(item)}
                          alt={itemName(item)}
                          width={44}
                          height={44}
                          crossOrigin="anonymous"
                          className="size-full object-cover"
                        />
                      ) : (
                        <Package size={18} className="text-[#C7A55B]" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <Link
                          href={`/products/${typeof item.product === "object" ? item.product._id : ""}`}
                          className="block"
                        >
                        <p className="truncate text-xs font-semibold text-[#1F3A2A] transition-colors hover:text-[#8d6a3a]">
                          {itemName(item)}
                        </p>
                      </Link>
                      {itemCode(item) && (
                        <p className="mt-0.5 text-[10px] font-medium tracking-wide text-[#a89a82]">
                          SKU: {itemCode(item)}
                        </p>
                      )}
                      {(item.finish || item.size) && (
                        <p className="mt-0.5 text-[10px] font-semibold text-[#8d6a3a]">
                          {[item.finish && `Finish: ${item.finish}`, item.size && `Size: ${item.size}`]
                            .filter(Boolean)
                            .join("  |  ")}
                        </p>
                      )}
                      <p className="mt-0.5 text-[10px] text-[#8d6a3a] md:hidden">
                        {formatCurrency(item.price)} x {item.quantity}
                      </p>
                    </div>

                    <span className="hidden shrink-0 text-center text-[11px] font-semibold text-[#5f665b] md:block md:w-[48px]">{item.quantity}</span>
                    <span className="hidden shrink-0 text-right text-[11px] font-medium text-[#5f665b] md:block md:w-[80px]">{formatCurrency(item.price)}</span>
                    <span className="hidden shrink-0 text-right text-xs font-semibold text-[#1F3A2A] md:block md:w-[90px]">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-1 space-y-1.5 border-t border-[#F3EBDE] pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#5f665b]">Subtotal</span>
                  <span className="font-semibold text-[#1F3A2A]">
                    {formatCurrency(order.items.reduce((s, i) => s + i.price * i.quantity, 0))}
                  </span>
                </div>
                {order.discount ? (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#5f665b]">Promo Discount (8%)</span>
                    <span className="font-semibold text-[#2F7D5A]">- {formatCurrency(order.discount)}</span>
                  </div>
                ) : null}
                {order.couponDiscount ? (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#5f665b]">Coupon Discount</span>
                    <span className="font-semibold text-[#2F7D5A]">- {formatCurrency(order.couponDiscount)}</span>
                  </div>
                ) : null}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#5f665b]">Shipping</span>
                  <span className="font-semibold text-[#1F3A2A]">
                    {order.shipping && order.shipping > 0 ? formatCurrency(order.shipping) : "FREE"}
                  </span>
                </div>
                {(() => {
                  const lines = gstBreakdown(order.items);
                  if (!lines.length) {
                    return order.tax ? (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#5f665b]">GST</span>
                        <span className="font-semibold text-[#1F3A2A]">{formatCurrency(order.tax)}</span>
                      </div>
                    ) : null;
                  }
                  return (
                    <>
                      {lines.map((t) => (
                        <div key={t.rate} className="flex items-center justify-between text-xs">
                          <span className="text-[#5f665b]">GST ({t.rate}%)</span>
                          <span className="font-semibold text-[#1F3A2A]">{formatCurrency(t.amount)}</span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#5f665b]">Total GST</span>
                        <span className="font-semibold text-[#1F3A2A]">
                          {formatCurrency(lines.reduce((s, t) => s + t.amount, 0))}
                        </span>
                      </div>
                    </>
                  );
                })()}
                <div className="flex items-center justify-between border-t border-[#F3EBDE] pt-2.5">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#1F3A2A]">Grand Total (incl. GST)</span>
                  <span className="text-base font-semibold text-[#1F3A2A]">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </section>

          {/* SHIPPING + PAYMENT */}
          <div className="space-y-3">
            <section className="rounded-[24px] border border-[#EDE4D3] bg-white shadow-[0_14px_36px_rgba(31,58,42,0.06)]">
              <div className="border-b border-[#F0E8DC] px-4 py-3 md:px-5">
                <h3 className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.16em] text-[#1F3A2A]">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-[#1F3A2A] text-[#C7A55B]">
                    <MapPin size={13} />
                  </span>
                  Shipping Details
                </h3>
              </div>
              <div className="px-4 py-3 md:px-5">
                <div className="flex items-center gap-4.5">
                  <div className="flex size-9 items-center justify-center rounded-full bg-[#F2EDE2] text-[#8d6a3a]">
                    <MapPin size={15} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#1F3A2A]">{recipientName}</p>
                    {order.shippingAddress.phone && (
                      <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#5f665b]">
                        <Phone size={10} /> {order.shippingAddress.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-3 space-y-1.5 border-t border-[#F3EBDE] pt-3 text-xs">
                  <p className="leading-5 text-[#5f665b]">
                    {order.shippingAddress.street}
                    {order.shippingAddress.landmark ? `, ${order.shippingAddress.landmark}` : ""}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <p className="text-[11px] text-[#8d6a3a]">
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-[#a89a82]">City</span>
                      <span className="font-medium text-[#1F3A2A]">{order.shippingAddress.city}</span>
                    </p>
                    <p className="text-[11px] text-[#8d6a3a]">
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-[#a89a82]">State</span>
                      <span className="font-medium text-[#1F3A2A]">{order.shippingAddress.state}</span>
                    </p>
                    <p className="text-[11px] text-[#8d6a3a]">
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-[#a89a82]">Postal Code</span>
                      <span className="font-medium text-[#1F3A2A]">{order.shippingAddress.postalCode}</span>
                    </p>
                    <p className="text-[11px] text-[#8d6a3a]">
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-[#a89a82]">Country</span>
                      <span className="font-medium text-[#1F3A2A]">{order.shippingAddress.country}</span>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[24px] border border-[#EDE4D3] bg-white shadow-[0_14px_36px_rgba(31,58,42,0.06)]">
              <div className="border-b border-[#F0E8DC] px-4 py-3 md:px-5">
                <h3 className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.16em] text-[#1F3A2A]">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-[#1F3A2A] text-[#C7A55B]">
                    <CreditCard size={13} />
                  </span>
                  Payment Details
                </h3>
              </div>
              <div className="px-4 py-3 md:px-5">
                {isPaid && (
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                    <BadgeCheck size={11} /> Payment Verified
                  </div>
                )}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#5f665b]">Payment Method</span>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-[#1F3A2A]">
                      <ShieldCheck size={12} className="text-[#2F7D5A]" /> Razorpay (Secure Gateway)
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#5f665b]">Payment Status</span>
                    <span className={`font-semibold ${isPaid ? "text-[#2F7D5A]" : "text-[#8d6a3a]"}`}>
                      {isPaid ? "Successful" : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#5f665b]">Transaction ID</span>
                    <span className="max-w-[55%] truncate font-mono text-[11px] font-semibold text-[#1F3A2A]">
                      {transactionRef}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-[#F3EBDE] pt-2.5">
                    <span className="text-[#5f665b]">Billing Amount</span>
                    <span className="text-sm font-semibold text-[#1F3A2A]">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* === WHAT HAPPENS NEXT — Timeline === */}
        <section id="whats-next" className="mt-4 rounded-[24px] border border-[#EDE4D3] bg-white px-4 py-5 shadow-[0_14px_36px_rgba(31,58,42,0.06)] md:px-6">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.16em] text-[#1F3A2A]">
              <span className="flex size-7 items-center justify-center rounded-lg bg-[#1F3A2A] text-[#C7A55B]">
                <Truck size={13} />
              </span>
              What Happens Next
            </h3>
            <span className="hidden text-[11px] font-medium text-[#a89a82] md:block">Estimated journey of your order</span>
          </div>

          <div className="relative mt-5 grid gap-5 md:grid-cols-5 md:gap-0">
            <div className="absolute top-4 right-[10%] left-[10%] hidden h-px bg-gradient-to-r from-[#D8C9A8] via-[#C7A55B]/60 to-[#D8C9A8] md:block" aria-hidden="true" />
            {TIMELINE_STEPS.map((step, index) => (
              <div key={step.title} className="relative flex items-start gap-4 md:flex-col md:items-center md:gap-0 md:text-center">
                <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-[#D8C9A8] bg-white text-[#8d6a3a] shadow-sm transition-all duration-300 hover:border-[#C7A55B] hover:bg-[#1F3A2A] hover:text-[#C7A55B]">
                  <step.icon size={14} strokeWidth={1.8} />
                </div>
                <div className="md:mt-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1F3A2A]">
                    <span className="mr-1 text-[#C7A55B]">{String(index + 1).padStart(2, "0")}</span>
                    {step.title}
                  </p>
                  <p className="mt-0.5 max-w-[200px] text-[10px] leading-5 text-[#8d6a3a] md:text-[11px]">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* === TRUST SECTION === */}
        <section className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-4 rounded-[20px] border border-[#EDE4D3] bg-white/80 px-3 py-4 text-center shadow-[0_10px_28px_rgba(31,58,42,0.04)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D8C9A8] hover:shadow-[0_16px_36px_rgba(31,58,42,0.10)]"
            >
              <div className="flex size-9 items-center justify-center rounded-full bg-[#F2EDE2] text-[#8d6a3a] transition-colors duration-300 group-hover:bg-[#1F3A2A]">
                <item.icon size={16} strokeWidth={1.6} />
              </div>
              <p className="text-[10px] font-semibold leading-4 text-[#1F3A2A]">{item.label}</p>
            </div>
          ))}
        </section>

        {/* === ACTION BUTTONS === */}
        <section className="mt-5 flex flex-col items-center gap-4.5 sm:flex-row sm:flex-wrap sm:justify-center">
          <Link
            href="/products"
            className="inline-flex h-10 items-center justify-center gap-4 rounded-full bg-[#1F3A2A] px-6 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(31,58,42,0.28)] transition-all duration-300 hover:bg-[#2F4A3A] hover:shadow-[0_16px_38px_rgba(31,58,42,0.36)] active:scale-[0.98]"
          >
            <div className="flex items-center gap-1.5 text-white">

            <ShoppingBag size={13} /> Continue Shopping
            </div>
          </Link>
          <button
            type="button"
            onClick={handleDownloadInvoice}
            className="inline-flex h-10 items-center justify-center gap-4 rounded-full border border-[#1F3A2A]/20 bg-white px-6 text-xs font-bold uppercase tracking-[0.16em] text-[#1F3A2A] shadow-[0_10px_26px_rgba(31,58,42,0.08)] transition-all duration-300 hover:border-[#C7A55B] hover:text-[#8d6a3a] hover:shadow-[0_14px_32px_rgba(31,58,42,0.14)] active:scale-[0.98]"
          >
            <Download size={13} /> Download Invoice
          </button>
          <button
            type="button"
            onClick={handleTrackOrder}
            className="inline-flex h-10 items-center justify-center gap-4 rounded-full border border-[#1F3A2A]/20 bg-white px-6 text-xs font-bold uppercase tracking-[0.16em] text-[#1F3A2A] shadow-[0_10px_26px_rgba(31,58,42,0.08)] transition-all duration-300 hover:border-[#C7A55B] hover:text-[#8d6a3a] hover:shadow-[0_14px_32px_rgba(31,58,42,0.14)] active:scale-[0.98]"
          >
            <Truck size={13} /> Track Order
          </button>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center gap-4 rounded-full border border-[#EDE4D3] bg-transparent px-6 text-xs font-bold uppercase tracking-[0.16em] text-[#8d6a3a] transition-all duration-300 hover:border-[#D8C9A8] hover:bg-white hover:text-[#1F3A2A] hover:shadow-[0_10px_26px_rgba(31,58,42,0.08)] active:scale-[0.98]"
          >
            <Home size={13} /> Return Home
          </Link>
        </section>

        {/* === HELP SECTION === */}
        <section className="mt-5 overflow-hidden rounded-[24px] bg-[#1F3A2A] shadow-[0_20px_50px_rgba(31,58,42,0.30)]">
          <div className="relative px-5 py-6 md:px-8">
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: LOTUS_PATTERN }} aria-hidden="true" />
            <div className="absolute -top-24 -right-24 size-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(199,165,91,0.15),transparent_70%)]" aria-hidden="true" />
            <div className="relative">
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h3 className="text-lg font-medium tracking-tight text-white">Need Help With Your Order?</h3>
                  <p className="mt-1 text-[11px] leading-5 text-white/60">
                    Our wellness specialists are available Mon–Sat, 9:30 AM – 7:00 PM IST.
                    <span className="ml-1 text-[#C7A55B]">Average response time: under 2 hours.</span>
                  </p>
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {HELP_CHANNELS.map((channel) => (
                  <div
                    key={channel.label}
                    className="group flex items-center gap-4.5 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2.5 backdrop-blur-sm transition-all duration-300 hover:border-[#C7A55B]/50 hover:bg-white/[0.10]"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#C7A55B]/15 text-[#C7A55B] transition-colors duration-300 group-hover:bg-[#C7A55B] group-hover:text-[#1F3A2A]">
                      <channel.icon size={14} strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-white">{channel.label}</p>
                      <p className="mt-0.5 truncate text-[10px] text-white/60">{channel.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* === RECOMMENDED PRODUCTS === */}
        {recommended.length > 0 && (
          <section className="mt-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C7A55B]">Curated for you</p>
                <h3 className="mt-1 text-xl font-medium tracking-tight text-[#1F3A2A] md:text-2xl">You may also like</h3>
              </div>
              <Link
                href="/products"
                className="hidden items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#1F3A2A] transition-colors hover:text-[#8d6a3a] sm:inline-flex"
              >
                <Search size={12} /> View all products
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recommended.map((product) => (
                <div
                  key={product._id}
                  className="group overflow-hidden rounded-[22px] border border-[#EDE4D3] bg-white shadow-[0_12px_32px_rgba(31,58,42,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#D8C9A8] hover:shadow-[0_22px_48px_rgba(31,58,42,0.14)]"
                >
                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="relative h-36 overflow-hidden bg-[#FBF8F2]">
                      {getImageUrl(product.images[0]) ? (
                        <Image
                          src={getImageUrl(product.images[0])}
                          alt={product.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          crossOrigin="anonymous"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-[#C7A55B]">
                          <Package size={30} strokeWidth={1.2} />
                        </div>
                      )}
                      <span className="absolute top-2 left-2 rounded-full bg-[#1F3A2A]/85 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#C7A55B] backdrop-blur-sm">
                        {categoryLabel(product.category)}
                      </span>
                    </div>
                  </Link>
                  <div className="p-3">
                    <Link href={`/products/${product.slug}`}>
                      <h4 className="line-clamp-2 min-h-9 text-[13px] font-semibold leading-5 text-[#1F3A2A] transition-colors group-hover:text-[#8d6a3a]">
                        {product.title}
                      </h4>
                    </Link>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <Stars rating={product.averageRating} />
                      <span className="text-[10px] font-semibold text-[#8d6a3a]">
                        {product.averageRating.toFixed(1)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-[#1F3A2A]">{formatCurrency(product.price)}</span>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-[#F2EDE2] px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1F3A2A] transition-all duration-300 hover:bg-[#1F3A2A] hover:text-[#C7A55B] hover:shadow-md active:scale-[0.97]"
                      >
                        <ShoppingBag size={11} /> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
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
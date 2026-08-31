"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  Loader2,
  Package,
  ShoppingBag,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { formatCurrency } from "@/utils";
import { API_URL, getImageUrl } from "@/lib/api/api";
import { authStore } from "@/lib/auth";

const jost = { fontFamily: "var(--font-montserrat), Arial, sans-serif" };

interface OrderItem {
  product:
    | { _id: string; title: string; images?: string[]; code?: string }
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
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  createdAt: string;
}

function itemName(item: OrderItem): string {
  return (
    item.name ||
    (typeof item.product === "object" ? item.product.title : "Product")
  );
}

function itemImage(item: OrderItem): string {
  const raw =
    typeof item.product === "object" && item.product.images?.[0]
      ? item.product.images[0]
      : "";
  return getImageUrl(raw);
}

function paymentBadge(status: Order["paymentStatus"]) {
  if (status === "paid")
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "failed") return "border-rose-200 bg-rose-50 text-rose-700";
  return "border-[#ead28b] bg-[#fff6df] text-[#8d6a3a]";
}

function orderStatusBadge(status: Order["orderStatus"]) {
  if (status === "delivered")
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "shipped")
    return "border-blue-200 bg-blue-50 text-blue-700";
  if (status === "cancelled")
    return "border-rose-200 bg-rose-50 text-rose-700";
  if (status === "confirmed")
    return "border-[#d8e3cf] bg-[#f2f7ee] text-[#3a6b24]";
  return "border-[#ead28b] bg-[#fff6df] text-[#8d6a3a]";
}

const LOTUS_PATTERN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='92' height='92' viewBox='0 0 92 92'%3E%3Cg fill='none' stroke='%231F3A2A' stroke-width='1'%3E%3Cpath d='M46 8 C28 20 28 40 46 58 C64 40 64 20 46 8Z'/%3E%3Cpath d='M46 20 C34 28 34 44 46 52 C58 44 58 28 46 20Z'/%3E%3Cpath d='M46 8 C30 34 30 62 46 84 C62 62 62 34 46 8Z' opacity='.5'/%3E%3C/g%3E%3C/svg%3E\")";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = authStore.isLoggedIn() ? authStore.getToken() : "";
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const payload = await res.json();
        if (!res.ok || payload.status === "error") {
          throw new Error(payload.message || "Failed to load orders.");
        }
        setOrders(payload.data as Order[]);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#FCFAF6]" style={jost}>
      {/* Decorative premium background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-40 top-32 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(199,165,91,0.12),transparent_65%)]" />
        <div className="absolute -right-48 top-[38%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(31,58,42,0.08),transparent_65%)]" />
        <div className="absolute -bottom-48 left-[30%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(199,165,91,0.10),transparent_62%)]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: LOTUS_PATTERN }} />
      </div>

      <Container className="relative z-10 py-8 md:py-12">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#8a7c63] transition-colors hover:text-[#1F3A2A]"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F3A2A]">
            <ShoppingBag size={18} className="text-[#C7A55B]" />
          </div>
          <div>
            <h1 className="text-lg font-bold uppercase tracking-[0.14em] text-[#1F3A2A] md:text-xl">
              My Orders
            </h1>
            <p className="text-[11px] uppercase tracking-[0.1em] text-[#8a7c63]">
              {orders.length} order{orders.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <Loader2 size={28} className="animate-spin text-[#1F3A2A]" />
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a7c63]">
              Loading your orders...
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-[20px] border border-rose-200 bg-rose-50 p-6 text-center shadow-[0_10px_28px_rgba(31,58,42,0.05)]">
            <p className="text-sm font-semibold text-rose-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-rose-500 hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-[24px] border border-[#EDE4D3] bg-white py-20 shadow-[0_14px_36px_rgba(31,58,42,0.06)]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1F3A2A]/5">
              <Package size={28} className="text-[#c7a55b]" />
            </div>
            <p className="text-sm font-semibold text-[#5f665b]">
              You have no orders yet.
            </p>
            <Link
              href="/products"
              className="mt-2 inline-flex items-center gap-4 rounded-full bg-[#1F3A2A] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_30px_rgba(31,58,42,0.28)] transition-all duration-300 hover:bg-[#18301f]"
            >
              Browse Products
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const date = new Date(order.createdAt).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              );
              const itemCount = order.items.reduce(
                (sum, i) => sum + i.quantity,
                0
              );

              return (
                <div
                  key={order._id}
                  className="rounded-[20px] border border-[#EDE4D3] bg-white p-4 shadow-[0_10px_28px_rgba(31,58,42,0.05)] transition-all duration-300 hover:shadow-[0_16px_36px_rgba(31,58,42,0.10)] md:p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1F3A2A]/5">
                        <Package size={16} className="text-[#1F3A2A]" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-bold uppercase tracking-[0.1em] text-[#8a7c63]">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="mt-0.5 text-xs text-[#5f665b]">
                          {date} &middot; {itemCount} item
                          {itemCount !== 1 ? "s" : ""}
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] ${paymentBadge(order.paymentStatus)}`}
                          >
                            {order.paymentStatus}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] ${orderStatusBadge(order.orderStatus)}`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <p className="text-sm font-bold text-[#1F3A2A]">
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <Link
                        href={`/orders/${order._id}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#EDE4D3] bg-[#FBF8F2] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#1F3A2A] transition-all duration-300 hover:border-[#1F3A2A] hover:bg-[#1F3A2A] hover:text-white"
                      >
                        <Eye size={12} />
                        View
                      </Link>
                    </div>
                  </div>

                  {order.items.length > 0 && (
                    <div className="mt-4 border-t border-[#F0E8DC] pt-3">
                      <div className="flex flex-wrap gap-2">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 rounded-xl bg-[#FBF8F2] px-2.5 py-1.5"
                          >
                            <span className="text-[11px] font-medium text-[#5f665b]">
                              {itemName(item)}
                              {item.quantity > 1
                                ? ` × ${item.quantity}`
                                : ""}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <span className="flex items-center rounded-xl bg-[#FBF8F2] px-2.5 py-1.5 text-[11px] font-medium text-[#8a7c63]">
                            +{order.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}

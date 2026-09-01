"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Eye,
  Loader2,
  Package,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { formatCurrency } from "@/utils";
import { API_URL, getImageUrl, productApi } from "@/lib/api/api";
import { authStore } from "@/lib/auth";
import type { Product } from "@/constants";
import YouMightCarousel from "@/components/ui/YouMightCarousel";
import ProductCard from "@/components/products/ProductCard";

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
  const [recommended, setRecommended] = useState<Product[]>([]);

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

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await productApi.list(10);
        if (res?.products && Array.isArray(res.products)) {
          setRecommended(res.products);
        }
      } catch (err) {
        console.error("Failed to load products slider", err);
      }
    };
    fetchProductsRecommended();
    function fetchProductsRecommended() {
      fetchRecommended();
    }
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#FCFAF6] pb-12" style={jost}>
      {/* Decorative premium background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-40 top-32 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(199,165,91,0.12),transparent_65%)]" />
        <div className="absolute -right-48 top-[38%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(31,58,42,0.08),transparent_65%)]" />
        <div className="absolute -bottom-48 left-[30%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(199,165,91,0.10),transparent_62%)]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: LOTUS_PATTERN }} />
      </div>

      <Container className="relative z-10 py-5 md:py-7">
        <button
          onClick={() => router.back()}
          className="mb-3.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#8a7c63] transition-colors hover:text-[#1F3A2A]"
        >
          <ArrowLeft size={13} />
          Back
        </button>

        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1F3A2A]">
              <ShoppingBag size={14} className="text-[#C7A55B]" />
            </div>
            <div>
              <h1 className="text-sm font-bold uppercase tracking-[0.12em] text-[#1F3A2A] sm:text-base">
                My Orders
              </h1>
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#8a7c63]">
                {orders.length} order{orders.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#EDE4D3] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#1F3A2A] shadow-sm transition-all duration-300 hover:border-[#1F3A2A] hover:bg-[#1F3A2A] hover:text-white"
          >
            Browse Store <ArrowRight size={12} />
          </Link>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-2.5 py-10">
            <Loader2 size={22} className="animate-spin text-[#1F3A2A]" />
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a7c63]">
              Loading your orders...
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-center shadow-sm">
            <p className="text-xs font-semibold text-rose-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-1.5 text-xs font-bold uppercase tracking-[0.1em] text-rose-500 hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-[#EDE4D3] bg-white py-10 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1F3A2A]/5">
              <Package size={20} className="text-[#c7a55b]" />
            </div>
            <p className="text-xs font-semibold text-[#5f665b]">
              You have no orders yet.
            </p>
            <Link
              href="/products"
              className="mt-1.5 inline-flex items-center gap-2 rounded-full bg-[#1F3A2A] px-5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-sm transition-all duration-300 hover:bg-[#18301f]"
            >
              Browse Products
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-3">
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
                  className="rounded-xl border border-[#EDE4D3] bg-white p-3 shadow-sm transition-all duration-300 hover:border-[#D8C9A8] sm:p-3.5"
                >
                  <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1F3A2A]/5 mt-0.5">
                        <Package size={13} className="text-[#1F3A2A]" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold uppercase tracking-[0.08em] text-[#1F3A2A]">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#8a7c63]">
                          {date} &middot; {itemCount} item
                          {itemCount !== 1 ? "s" : ""}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] ${paymentBadge(order.paymentStatus)}`}
                          >
                            {order.paymentStatus}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] ${orderStatusBadge(order.orderStatus)}`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#F0E8DC] pt-2 sm:border-t-0 sm:pt-0 sm:flex-col sm:items-end sm:gap-1.5">
                      <div>
                        <span className="text-[10px] font-medium text-[#8a7c63] sm:hidden mr-1">Total:</span>
                        <span className="text-sm font-bold text-[#1F3A2A]">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>
                      <Link
                        href={`/orders/${order._id}`}
                        className="inline-flex items-center gap-1 rounded-full border border-[#EDE4D3] bg-[#FBF8F2] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#1F3A2A] transition-all duration-300 hover:border-[#1F3A2A] hover:bg-[#1F3A2A] hover:text-white"
                      >
                        <Eye size={11} />
                        View
                      </Link>
                    </div>
                  </div>

                  {/* Product list inside each order */}
                  {order.items.length > 0 && (
                    <div className="mt-2.5 border-t border-[#F0E8DC] pt-2">
                      <div className="space-y-1.5">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2.5 rounded-lg bg-[#FBF8F2] px-2.5 py-1.5"
                          >
                            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border border-[#eee6d9] bg-white">
                              {itemImage(item) ? (
                                <Image
                                  src={itemImage(item)}
                                  alt={itemName(item)}
                                  fill
                                  className="object-cover"
                                  sizes="36px"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <Package size={12} className="text-[#c7a55b]" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-semibold text-[#2b2a26]">
                                {itemName(item)}
                              </p>
                              <p className="text-[11px] text-[#8a7c63]">
                                {formatCurrency(item.price)} × {item.quantity}
                                {item.finish ? ` | ${item.finish}` : ""}
                                {item.size ? ` | ${item.size}` : ""}
                              </p>
                            </div>
                            <span className="shrink-0 text-xs font-bold text-[#1F3A2A]">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Products Slider Section */}
        {recommended.length > 0 && (
          <section className="mt-9 pt-4">
            <div className="mb-3.5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C7A55B]">
                  Curated for you
                </p>
                <h2 className="mt-0.5 text-sm font-bold text-[#1F3A2A] sm:text-base">
                  Explore Wellness Products
                </h2>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.1em] text-[#8d6a3a] transition-colors hover:text-[#1F3A2A]"
              >
                View All <ArrowRight size={12} />
              </Link>
            </div>
            <div className="overflow-hidden">
              <YouMightCarousel>
                {recommended.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </YouMightCarousel>
            </div>
          </section>
        )}
      </Container>
    </section>
  );
}

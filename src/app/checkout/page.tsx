"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  LockKeyhole,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Truck,
  ArrowLeft,
  Leaf,
  Sparkles,
  Headset,
  Wallet,
  Landmark,
  Smartphone,
  CreditCard,
  BadgeCheck,
  Factory,
  Compass,
  PackageCheck,
  MessageCircle,
  Phone,
  Mail,
  Loader2,
  ArrowRight,
  ShieldCheck as ShieldOutline,
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { Container } from "@/components/ui/Container";
import { formatCurrency } from "@/utils";
import { RazorpayCheckout } from "@/components/RazorpayCheckout";
import { API_URL } from "@/lib/api/api";
import { authStore } from "@/lib/auth";

interface ShippingAddress {
  label: string;
  fullName: string;
  phone: string;
  email: string;
  street: string;
  landmark: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
}

interface CheckoutSnapshot {
  items: {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  cartCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  estimatedTax: number;
  couponDiscount: number;
  grandTotal: number;
}

const serif = { fontFamily: "var(--font-cormorant-garamond), Georgia, serif" };
const jost = { fontFamily: "var(--font-jost), var(--font-montserrat), sans-serif" };

// Compact local classes for this page only
const inputClass =
  "w-full rounded-xl border border-[#e4dccb] bg-white/80 px-3 py-2 text-[13px] text-[#2b2a26] placeholder:text-[#a79d8c] outline-none transition-all duration-200 focus:border-[#c7a55b] focus:ring-2 focus:ring-[#c7a55b]/20 focus:bg-white";
const labelClass =
  "mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a7c63]";

const trustBadges = [
  { icon: ShieldCheck, label: "SSL Secure Checkout" },
  { icon: LockKeyhole, label: "100% Secure Payment" },
  { icon: BadgeCheck, label: "Manufacturer Warranty" },
  { icon: PackageCheck, label: "Genuine Products" },
  { icon: Truck, label: "Fast Shipping" },
  { icon: Compass, label: "International Delivery" },
];

const whyBuy = [
  { icon: BadgeCheck, title: "Manufacturer Warranty", desc: "Every piece backed by our direct manufacturer warranty." },
  { icon: Factory, title: "Custom Manufacturing", desc: "Bespoke wellness furniture tailored to your space." },
  { icon: Compass, title: "International Shipping", desc: "Trusted worldwide logistics for global delivery." },
  { icon: Sparkles, title: "Expert Consultancy", desc: "Ayurveda & Panchkarma experts guide your layout." },
  { icon: Leaf, title: "White Glove Delivery", desc: "Careful handling, assembly and premium placement." },
  { icon: PackageCheck, title: "Secure Packaging", desc: "Industrial-grade packing for flawless transit." },
];

const helpChannels = [
  { icon: Phone, label: "Call Support", value: "+91 9654900525" },
  { icon: MessageCircle, label: "WhatsApp", value: "Chat with us" },
  { icon: Mail, label: "Email", value: "info@ensis.in" },
  { icon: Headset, label: "Live Chat", value: "Available 9-7 IST" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartCount, subtotal, clearCart } = useShop();

  const [token, setToken] = useState<string>("");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    label: "Home",
    fullName: "",
    phone: "",
    email: "",
    street: "",
    landmark: "",
    postalCode: "",
    city: "",
    state: "",
    country: "India",
  });

  const [orderId, setOrderId] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [checkoutSnapshot, setCheckoutSnapshot] = useState<CheckoutSnapshot | null>(null);

  // Authentication check / session validity (redirect if token missing / expired)
  useEffect(() => {
    queueMicrotask(() => setIsMounted(true));
    if (!authStore.isLoggedIn()) {
      router.push("/login?redirect=checkout");
      return;
    }
    queueMicrotask(() => setToken(authStore.getToken()));
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Cart calculations
  const hasItems = cartItems.length > 0;
  const freeShippingAt = 50000;
  const discount = hasItems ? Math.round(subtotal * 0.08) : 0;
  const couponDiscount = couponApplied ? Math.round(subtotal * 0.05) : 0;
  const shipping = subtotal >= freeShippingAt || !hasItems ? 0 : 999;
  const estimatedTax = hasItems ? Math.round((subtotal - discount - couponDiscount) * 0.05) : 0;
  const grandTotal = Math.max(0, subtotal - discount - couponDiscount + shipping + estimatedTax);
  const summary = checkoutSnapshot ?? {
    items: cartItems,
    cartCount,
    subtotal,
    discount,
    shipping,
    estimatedTax,
    couponDiscount,
    grandTotal,
  };

  const applyCoupon = () => {
    const code = coupon.trim();
    if (!code) {
      setCouponMessage("Enter a coupon code to apply.");
      setCouponApplied(false);
      return;
    }
    if (["ENSIS10", "WELLNESS", "PANCHKARMA"].includes(code.toUpperCase())) {
      setCouponApplied(true);
      setCouponMessage(`Coupon "${code.toUpperCase()}" applied — you saved 5%!`);
    } else {
      setCouponApplied(false);
      setCouponMessage("Invalid coupon code.");
    }
  };

  // Place internal MongoDB Order
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (
      !shippingAddress.fullName.trim() ||
      !shippingAddress.phone.trim() ||
      !shippingAddress.street.trim() ||
      !shippingAddress.city.trim() ||
      !shippingAddress.state.trim() ||
      !shippingAddress.postalCode.trim() ||
      !shippingAddress.country.trim()
    ) {
      setError("Please complete all required shipping address fields.");
      return;
    }

    setIsPlacingOrder(true);
    setError(null);

    try {
      const items = cartItems.map((item) => ({
        product: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));
      const snapshot = {
        items: cartItems.map((item) => ({ ...item })),
        cartCount,
        subtotal,
        discount,
        shipping,
        estimatedTax,
        couponDiscount,
        grandTotal,
      };

      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shippingAddress,
          items,
          totalAmount: grandTotal,
        }),
      });

      const payload = await res.json();
      if (!res.ok || payload.status === "error") {
        if (res.status === 401 || res.status === 403) {
          authStore.clear();
        }
        throw new Error(payload.message || "Failed to create order on server.");
      }

      const createdOrder = payload.data;
      setCheckoutSnapshot(snapshot);
      setOrderId(createdOrder._id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred while placing order.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handlePaymentSuccess = (paymentId: string, internalOrderId: string) => {
    const paidSnapshot = checkoutSnapshot ?? summary;
    const orderSnapshot = {
      _id: internalOrderId,
      items: paidSnapshot.items.map((item) => ({
        product: {
          _id: item.id,
          title: item.name,
          images: [item.image],
        },
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount: paidSnapshot.grandTotal,
      discount: paidSnapshot.discount,
      couponDiscount: paidSnapshot.couponDiscount,
      shipping: paidSnapshot.shipping,
      tax: paidSnapshot.estimatedTax,
      paymentStatus: "paid",
      orderStatus: "confirmed",
      shippingAddress,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(`ensis_order_${internalOrderId}`, JSON.stringify(orderSnapshot));
    clearCart();
    router.push(`/orders/${internalOrderId}?payment=success`);
  };

  const handlePaymentFailure = (paymentError: string) => {
    setError(paymentError);
  };

  if (!isMounted) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FCFAF6] pt-10" style={jost}>
      {/* Decorative premium background — very low opacity */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-40 top-32 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(199,165,91,0.14),transparent_65%)]" />
        <div className="absolute -right-48 top-[38%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(31,58,42,0.10),transparent_65%)]" />
        <div className="absolute -bottom-48 left-[30%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(199,165,91,0.12),transparent_62%)]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='92' height='92' viewBox='0 0 92 92'%3E%3Cg fill='none' stroke='%231F3A2A' stroke-width='1'%3E%3Cpath d='M46 8 C28 20 28 40 46 58 C64 40 64 20 46 8Z'/%3E%3Cpath d='M46 20 C34 28 34 44 46 52 C58 44 58 28 46 20Z'/%3E%3Cpath d='M46 8 C30 34 30 62 46 84 C62 62 62 34 46 8Z' opacity='.5'/%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <Container className="relative">
        {/* Clearance below the fixed header */}
        <div className="pb-8">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a79a8c]">
            <Link
              href="/cart"
              className="flex items-center gap-1.5 transition-colors hover:text-[#8d6a3a]"
            >
              <ArrowLeft size={13} /> Back to Cart
            </Link>
            <span>/</span>
            <span className="text-[#1F3A2A]">Checkout</span>
          </nav>

          {cartItems.length === 0 && !orderId ? (
            <div className="relative mx-auto max-w-lg overflow-hidden rounded-3xl border border-[#e8dfce] bg-white/80 p-6 text-center shadow-[0_25px_60px_-20px_rgba(31,58,42,0.25)] backdrop-blur">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#1F3A2A]/5">
                <ShoppingBag size={28} className="text-[#c7a55b]" />
              </div>
              <h1 className="text-[#1F3A2A]" >
                Your session is inactive
              </h1>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#7a7062]">
                Your cart is empty. Please add some wellness essentials to begin your spa journey home.
              </p>
              <Link
                href="/products"
                className="mt-4 inline-flex h-10 items-center justify-center gap-4 rounded-full bg-[#1F3A2A] px-6 text-xs font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#c7a55b]"
              >
                Browse Products <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid items-start gap-4 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_410px]">
              {/* ───────── Left Column : Shipping Form ───────── */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1F3A2A]/8">
                    <LockKeyhole size={17} className="text-[#c7a55b]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold leading-none text-[#1F3A2A]" >
                      Checkout
                    </h2>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#a79a8c]">
                      Complete your secure wellness order
                    </p>
                  </div>
                </div>

                {/* Form Block */}
                <div className="relative overflow-hidden rounded-3xl border border-[#ece3d2] bg-white/90 p-4 shadow-[0_20px_50px_-24px_rgba(31,58,42,0.28)] backdrop-blur-sm sm:p-5">
                  <div className="mb-4 flex items-center gap-4 border-b border-[#ece3d2] pb-3">
                    <MapPin size={16} className="text-[#c7a55b]" />
                    <h2 className="text-lg font-semibold uppercase tracking-[0.12em] text-[#1F3A2A]" >
                      Shipping Destination
                    </h2>
                  </div>

                  {!orderId ? (
                    <form onSubmit={handlePlaceOrder} className="space-y-3">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className={labelClass}>Address Label</label>
                          <input
                            className={inputClass}
                            type="text"
                            name="label"
                            placeholder="e.g. Home"
                            value={shippingAddress.label}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Full Name *</label>
                          <input
                            className={inputClass}
                            type="text"
                            name="fullName"
                            placeholder="Your full name"
                            value={shippingAddress.fullName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className={labelClass}>Phone Number *</label>
                          <input
                            className={inputClass}
                            type="tel"
                            name="phone"
                            placeholder="+91 98765 43210"
                            value={shippingAddress.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Email Address *</label>
                          <input
                            className={inputClass}
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={shippingAddress.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className={labelClass}>Street Address *</label>
                          <input
                            className={inputClass}
                            type="text"
                            name="street"
                            placeholder="House no., Apartment, Street name"
                            value={shippingAddress.street}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Landmark</label>
                          <input
                            className={inputClass}
                            type="text"
                            name="landmark"
                            placeholder="Near ... (optional)"
                            value={shippingAddress.landmark}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                          <label className={labelClass}>Postal Code *</label>
                          <input
                            className={inputClass}
                            type="text"
                            name="postalCode"
                            placeholder="110001"
                            value={shippingAddress.postalCode}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <label className={labelClass}>City *</label>
                          <input
                            className={inputClass}
                            type="text"
                            name="city"
                            placeholder="City"
                            value={shippingAddress.city}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <label className={labelClass}>State *</label>
                          <input
                            className={inputClass}
                            type="text"
                            name="state"
                            placeholder="State"
                            value={shippingAddress.state}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Country *</label>
                        <select
                          className={inputClass}
                          name="country"
                          value={shippingAddress.country}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="India">India</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                          <option value="Canada">Canada</option>
                          <option value="Germany">Germany</option>
                          <option value="UAE">UAE</option>
                          <option value="Singapore">Singapore</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {error && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-600">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isPlacingOrder}
                        className="group relative mt-1 flex w-full items-center justify-center gap-4 overflow-hidden rounded-full bg-[#1F3A2A] px-5 py-2.5 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_20px_40px_-12px_rgba(31,58,42,0.6)] transition-all duration-300 hover:bg-[#18301f] hover:shadow-[0_24px_45px_-12px_rgba(199,165,91,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isPlacingOrder ? (
                          <>
                            <Loader2 size={15} className="animate-spin" />
                            Placing Order...
                          </>
                        ) : (
                          <>
                            <LockKeyhole size={15} className="text-[#e9d7a8] transition-transform group-hover:scale-110" />
                            Proceed to Secure Payment
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-3">
                      <div className="rounded-2xl border border-[#d8e3cf] bg-[#f2f7ee] p-3">
                        <p className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.14em] text-[#516a35]">
                          <BadgeCheck size={15} /> Order created successfully
                        </p>
                        <p className="mt-1.5 text-xs text-[#5c6f50]">
                          Order ID:{" "}
                          <code className="rounded bg-white/70 px-1.5 py-0.5 font-mono text-[#1F3A2A]">{orderId}</code>
                        </p>
                        <div className="mt-2 border-t border-[#d8e3cf] pt-2 text-xs leading-5 text-[#5c6f50]">
                          <p className="font-bold">Deliver to:</p>
                          <p className="mt-1">
                            {shippingAddress.fullName || shippingAddress.label} • {shippingAddress.street}
                            {shippingAddress.landmark ? `, ${shippingAddress.landmark}` : ""},{" "}
                            {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode},{" "}
                            {shippingAddress.country}. Tel: {shippingAddress.phone}
                          </p>
                        </div>
                      </div>

                      {/* Payment */}
                      <div className="rounded-2xl border border-[#ece3d2] bg-[#fbf9f4] p-3">
                        <p className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-[#1F3A2A]">
                          Select payment method
                        </p>
                        <RazorpayCheckout
                          orderId={orderId}
                          token={token}
                          onSuccess={handlePaymentSuccess}
                          onFailure={handlePaymentFailure}
                          amount={summary.grandTotal}
                        />
                      </div>

                      {error && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-600">
                          {error}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Back button */}
                <Link
                  href="/cart"
                  className="inline-flex items-center gap-4 text-sm font-semibold text-[#5c5546] transition-colors hover:text-[#8d6a3a]"
                >
                  <ArrowLeft size={16} /> Return to Shopping Cart
                </Link>
              </div>

              {/* ─────────────── Right : Order Summary + Payment ───────────── */}
              <aside className="space-y-3 lg:sticky lg:top-28">
                {/* Order Summary */}
                <div className="overflow-hidden rounded-3xl border border-[#ece3d2] bg-white/90 p-4 shadow-[0_28px_50px_-24px_rgba(31,58,42,0.3)] backdrop-blur-sm">
                  <div className="mb-3 flex items-center justify-between border-b border-[#ece3d2] pb-2">
                    <h2 className="text-base font-semibold uppercase tracking-[0.12em] text-[#1F3A2A]" >
                      Order Summary
                    </h2>
                    <span className="rounded-full bg-[#1F3A2A] px-2 py-0.5 text-[10px] font-bold text-[#e9d7a8]">
                      {summary.cartCount} items
                    </span>
                  </div>

                  <div className="max-h-52 space-y-2.5 overflow-y-auto pr-1">
                    {summary.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4.5">
                        <div className="relative aspect-square h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#eee6d9] bg-[#f8f4ec]">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            crossOrigin="anonymous"
                            sizes="48px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12px] font-semibold text-[#2b2a26]">{item.name}</p>
                          <p className="mt-0.5 text-[11px] text-[#8a7c63]">
                            {formatCurrency(item.price)} × {item.quantity}
                          </p>
                        </div>
                        <span className="shrink-0 text-[12px] font-bold text-[#1F3A2A]">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Coupon */}
                  <div className="mt-3 border-t border-[#ece3d2] pt-3">
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a79a8c]">
                      Apply coupon
                    </p>
                    <div className="flex gap-1.5">
                      <input
                        className={inputClass}
                        type="text"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        placeholder="ENSIS10"
                      />
                      <button
                        type="button"
                        onClick={applyCoupon}
                        className="shrink-0 rounded-xl bg-[#1F3A2A] px-3 text-[11px] font-bold uppercase tracking-wider text-[#e9d7a8] transition-colors hover:bg-[#18301f]"
                      >
                        Apply
                      </button>
                    </div>
                    {couponMessage && (
                      <p className={`mt-1.5 text-[11px] font-semibold ${couponApplied ? "text-[#4e7d3a]" : "text-rose-500"}`}>
                        {couponMessage}
                      </p>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="mt-3 space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#6f6658]">Subtotal</span>
                      <span className="font-semibold text-[#1F3A2A]">{formatCurrency(summary.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6f6658]">Promo Discount (8%)</span>
                      <span className="font-semibold text-[#4a7c3a]">- {formatCurrency(summary.discount)}</span>
                    </div>
                    {summary.couponDiscount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[#6f6658]">Coupon savings</span>
                        <span className="font-semibold text-[#4a7c3a]">- {formatCurrency(summary.couponDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-[#6f6658]">Shipping</span>
                      <span className="font-semibold text-[#4a7c3a]">
                        {summary.shipping === 0 ? "FREE" : formatCurrency(summary.shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6f6658]">GST / Tax (5%)</span>
                      <span className="font-semibold">{formatCurrency(summary.estimatedTax)}</span>
                    </div>

                    <div className="mt-2 flex items-center justify-between border-t-2 border-[#c7a55b]/60 pt-2.5">
                      <span className="text-base font-bold uppercase tracking-wide text-[#1F3A2A]">Grand Total</span>
                      <span className="text-lg font-bold text-[#1F3A2A]" >
                        {formatCurrency(summary.grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="rounded-3xl border border-[#ece3d2] bg-white/90 p-4 shadow-[0_28px_50px_-24px_rgba(31,58,42,0.3)] backdrop-blur-sm">
                  <h3 className="mb-3 flex items-center gap-4 text-sm font-bold uppercase tracking-[0.14em] text-[#1F3A2A]">
                    <Wallet size={15} className="text-[#c7a55b]" /> Payment Methods
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: CreditCard, label: "Credit / Debit" },
                      { icon: Smartphone, label: "UPI" },
                      { icon: Landmark, label: "Net Banking" },
                      { icon: Wallet, label: "Wallets" },
                    ].map((m, i) => (
                      <div
                        key={i}
                        className="group flex items-center gap-4 rounded-xl border border-[#e8dfce] bg-[#fdfcf9] px-2.5 py-2 text-[11px] font-semibold text-[#5c5546] transition-all hover:border-[#c7a55b] hover:text-[#1F3A2A]"
                      >
                        <m.icon size={13} className="text-[#c7a55b] transition-transform group-hover:scale-110" />
                        {m.label}
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-[10px] text-[#a79a8c]">
                    Secured by <span className="font-bold text-[#1F3A2A]">Razorpay</span> • 256-bit SSL Encryption
                  </p>
                </div>

                {/* Trust badges */}
                <div className="rounded-3xl border border-[#ece3d2] bg-white/90 p-3 shadow-[0_22px_45px_-24px_rgba(31,58,42,0.28)] backdrop-blur-sm">
                  <div className="grid grid-cols-3 gap-4">
                    {trustBadges.map((t, i) => (
                      <div key={i} className="flex flex-col items-center gap-1 text-center">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1F3A2A]/5">
                          <t.icon size={13} className="text-[#c7a55b]" />
                        </div>
                        <span className="text-[9px] font-semibold uppercase tracking-wide text-[#6f6658]">
                          {t.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* ─────────── Why Buy From ENSIS ─────────── */}
          <div className="mt-8">
            <div className="mb-4 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#c7a55b]">Why Buy From ENSIS</p>
              <h2 className="mt-1 text-3xl font-bold text-[#1F3A2A]" >
                Crafted for Wellness, Built to Last
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {whyBuy.map((b, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-3xl border border-[#ece3d2] bg-white/80 p-3 shadow-[0_18px_40px_-24px_rgba(31,58,42,0.25)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_50px_-24px_rgba(199,165,91,0.4)]"
                >
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1F3A2A] transition-colors duration-300 group-hover:bg-[#c7a55b]">
                    <b.icon size={17} className="text-[#e9d7a8] transition-colors group-hover:text-[#1F3A2A]" />
                  </div>
                  <h3 className="text-base font-semibold text-[#1F3A2A]">{b.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#8a7c63]">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ─────────── Need Help ─────────── */}
          <div className="mt-7">
            <div className="relative overflow-hidden rounded-3xl border border-[#1F3A2A]/20 bg-[#1F3A2A] p-5 text-white shadow-[0_30px_60px_-24px_rgba(31,58,42,0.6)] sm:p-6">
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#c7a55b]/20 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-[#c7a55b]/10 blur-2xl" />
              <div className="relative flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#e9d7a8]">Need Help?</p>
                  <h2 className="mt-1 text-2xl font-bold" >
                    Our wellness experts are here
                  </h2>
                  <p className="mt-1 max-w-md text-sm leading-6 text-[#d9d4c9]">
                    Speak with our design & order specialists for assistance with your purchase or installation.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4">
                    {helpChannels.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-[12px] font-semibold backdrop-blur-sm transition-colors hover:border-[#c7a55b]"
                      >
                        <c.icon size={13} className="text-[#e9d7a8]" />
                        <span>
                          {c.label}
                          <span className="block text-[10px] font-normal text-white/60">{c.value}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex h-10 shrink-0 items-center gap-4 rounded-full bg-[#c7a55b] px-6 text-xs font-bold uppercase tracking-[0.16em] text-[#1F3A2A] transition-all duration-300 hover:bg-[#e0b472]"
                >
                  Contact Us <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
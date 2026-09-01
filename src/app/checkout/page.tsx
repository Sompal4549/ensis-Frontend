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
  Home,
  ChevronRight,
  Pencil,
  Shield,
  Clock,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { Container } from "@/components/ui/Container";
import { formatCurrency } from "@/utils";
import { RazorpayCheckout } from "@/components/RazorpayCheckout";
import { API_URL } from "@/lib/api/api";
import { authStore } from "@/lib/auth";
import needHelpBg from "@/assets/need-help.png";
import GreenButton from "@/components/ui/GreenButton";

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
    gstRate?: number;
    finish?: string;
    size?: string;
  }[];
  cartCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  estimatedTax: number;
  grandTotal: number;
}

const jost = { fontFamily: "var(--font-montserrat), Arial, sans-serif" };

const cardShadow = "shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,rgba(0,0,0,0.3)_0px_3px_7px_-3px]";

// Compact local classes for this page only
const inputClass =
  "w-full rounded-xl border border-[#e4dccb] bg-white/80 px-3 py-2 text-sm text-[#2b2a26] placeholder:text-[#a79d8c] outline-none transition-all duration-200 focus:border-[#c7a55b] focus:ring-2 focus:ring-[#c7a55b]/20 focus:bg-white";
const labelClass =
  "mb-1 block text-sm font-semibold uppercase tracking-[0.16em] text-[#8a7c63]";

const trustBadges = [
  { icon: ShieldCheck, label: "SSL Secure Checkout" },
  { icon: Shield, label: "Secure Payment" },
  { icon: PackageCheck, label: "Genuine Products" },
  { icon: BadgeCheck, label: "Manufacturer Warranty" },
  { icon: Truck, label: "Fast Shipping" },
  { icon: Globe, label: "International Delivery" },
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
  { icon: Phone, label: "Call Support", value: "+91 9654900525", href: "tel:+919654900525" },
  { icon: MessageCircle, label: "WhatsApp", value: "Chat with us", href: "https://wa.me/919654900525" },
  { icon: Mail, label: "Email", value: "info@ensis.in", href: "mailto:info@ensis.in" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartCount, subtotal, clearCart } = useShop();

  const [token, setToken] = useState<string>("");
  const [idempotencyKey] = useState<string>(() =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
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
  const [editingAddress, setEditingAddress] = useState(false);

  // Authentication check / pre-fill address from user data
  useEffect(() => {
    queueMicrotask(() => setIsMounted(true));
    if (!authStore.isLoggedIn()) {
      router.push("/login?redirect=checkout");
      return;
    }
    queueMicrotask(() => setToken(authStore.getToken()));

    // Pre-fill address from registered user/lead data
    try {
      const userData = authStore.getUser<{ name?: string; firstName?: string; lastName?: string; email?: string; phone?: string; addressLine?: string; city?: string; state?: string; country?: string; zipCode?: string; postalCode?: string }>();
      console.log("Checkout userData:", userData);
      if (userData) {
        const fullName = userData.name || [userData.firstName, userData.lastName].filter(Boolean).join(" ") || "";
        const rawPostal = userData.zipCode || userData.postalCode || "";

        setShippingAddress((prev) => {
          let street = userData.addressLine || prev.street;
          let postalCode = rawPostal;

          if (!postalCode && street) {
            const m = street.match(/(\d{6})\s*,?\s*(India)?\s*$/);
            if (m) {
              postalCode = m[1];
              street = street.replace(/\s*\d{6}\s*,?\s*(India)?\s*$/, "").trim();
            }
          }

          return {
            ...prev,
            fullName: fullName || prev.fullName,
            email: userData.email || prev.email,
            phone: userData.phone
              ? (userData.phone.startsWith("+") ? userData.phone : `+91${userData.phone}`.replace(/\D/g, '').replace(/^(\d{2})(\d+)$/, '+$1 $2'))
              : prev.phone,
            street,
            city: userData.city || prev.city,
            state: userData.state || prev.state,
            country: userData.country || prev.country,
            postalCode: postalCode || prev.postalCode,
          };
        });
      }
    } catch {}
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Cart calculations (mirror the server-side rules so the displayed total matches the charged amount)
  const hasItems = cartItems.length > 0;
  const freeShippingAt = 50000;
  const discount = hasItems ? Math.round(subtotal * 0.08) : 0;
  const shipping = subtotal >= freeShippingAt || !hasItems ? 0 : 999;
  const gstTotal = hasItems
    ? Math.round(cartItems.reduce((sum, item) => sum + (item.price * item.quantity * (item.gstRate ?? 5)) / 100, 0))
    : 0;
  const grandTotal = Math.max(0, subtotal - discount + shipping + gstTotal);
  const summary = checkoutSnapshot ?? {
    items: cartItems,
    cartCount,
    subtotal,
    discount,
    shipping,
    estimatedTax: gstTotal,
    couponDiscount: 0,
    grandTotal,
  };
  const gstSlabs = hasItems
    ? cartItems.reduce<Record<number, number>>((acc, item) => {
        const rate = item.gstRate ?? 5;
        acc[rate] = (acc[rate] ?? 0) + (item.price * item.quantity * rate) / 100;
        return acc;
      }, {})
    : {};

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
        gstRate: item.gstRate ?? 5,
        finish: item.finish,
        size: item.size,
      }));
      const snapshot = {
        items: cartItems.map((item) => ({ ...item })),
        cartCount,
        subtotal,
        discount,
        shipping,
        estimatedTax: gstTotal,
        couponDiscount: 0,
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
          idempotencyKey,
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
        gstRate: item.gstRate ?? 5,
        finish: item.finish,
        size: item.size,
      })),
      totalAmount: paidSnapshot.grandTotal,
      discount: paidSnapshot.discount,
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
        <div className="pb-6">
          <nav className="mb-4 flex items-center gap-2 text-base text-[#8a7c63]">
            <Link href="/" className="transition-colors hover:text-[#1F3A2A]">Home</Link>
            <ChevronRight size={14} className="text-[#c7a55b]" />
            <Link href="/cart" className="transition-colors hover:text-[#1F3A2A]">Cart</Link>
            <ChevronRight size={14} className="text-[#c7a55b]" />
            <span className="font-semibold text-[#1F3A2A]">Checkout</span>
          </nav>

          {cartItems.length === 0 && !orderId ? (
            <div className="relative mx-auto max-w-lg overflow-hidden rounded-3xl border border-[#e8dfce] bg-white/80 p-8 text-center backdrop-blur" style={{ boxShadow: "rgba(50,50,93,0.25) 0px 6px 12px -2px, rgba(0,0,0,0.3) 0px 3px 7px -3px" }}>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1F3A2A]/5">
                <ShoppingBag size={28} className="text-[#c7a55b]" />
              </div>
              <h1 className="text-2xl font-bold text-[#1F3A2A]" >
                Your session is inactive
              </h1>
              <p className="mx-auto mt-3 max-w-xs text-base leading-6 text-[#7a7062]">
                Your cart is empty. Please add some wellness essentials to begin your spa journey home.
              </p>
              <Link
                href="/products"
                className="mt-5 inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-[#1F3A2A] px-8 text-sm font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#c7a55b]"
              >
                Browse Products <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
                <div className="grid items-start gap-4 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_410px]">
              {/* ───────── Left Column : Shipping Form ───────── */}
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold leading-none text-[#1F3A2A]" >
                      Checkout
                    </h1>
                    <p className="mt-2 text-sm text-[#8a7c63]">
                      Complete your secure wellness order
                    </p>
                  </div>
                </div>

                {/* Form Block */}
                <div className="relative overflow-hidden rounded-3xl border border-[#ece3d2] bg-white/90 p-4 backdrop-blur-sm sm:p-5" style={{ boxShadow: "rgba(50,50,93,0.25) 0px 6px 12px -2px, rgba(0,0,0,0.3) 0px 3px 7px -3px" }}>
                  <div className="mb-4 flex items-center gap-3 border-b border-[#ece3d2] pb-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1F3A2A] text-sm font-bold text-white">
                      1
                    </div>
                    <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#1F3A2A]">
                      Shipping Destination
                    </h2>
                  </div>

                  {!orderId ? (
                    <div className="space-y-3">
                      {!editingAddress ? (
                        /* Read-only address display */
                        <div className="space-y-3">
                          <div className="rounded-xl border border-[#e4dccb] bg-[#faf8f4] p-3 space-y-2">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Home size={14} className="text-[#c7a55b]" />
                                <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#8a7c63]">{shippingAddress.label || "Address"}</span>
                              </div>
                              <button type="button" onClick={() => setEditingAddress(true)} className="flex items-center gap-1.5 rounded-lg border border-[#e4dccb] px-3 py-1 text-sm font-semibold text-[#1F3A2A] transition-colors hover:border-[#c7a55b] hover:bg-[#c7a55b]/10">
                                <Pencil size={12} />
                                Change
                              </button>
                            </div>
                            <p className="text-base font-semibold text-[#1F3A2A]">{shippingAddress.fullName}</p>
                            <p className="text-base text-[#7a7062]">{shippingAddress.street}{shippingAddress.landmark ? `, ${shippingAddress.landmark}` : ""}</p>
                            <p className="text-base text-[#7a7062]">{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}</p>
                            <p className="text-base text-[#7a7062]">{shippingAddress.country}</p>
                            <div className="pt-2 border-t border-[#e4dccb] flex gap-4">
                              <span className="flex items-center gap-1.5 text-sm text-[#7a7062]"><Phone size={12} /> {shippingAddress.phone}</span>
                              <span className="flex items-center gap-1.5 text-sm text-[#7a7062]"><Mail size={12} /> {shippingAddress.email}</span>
                            </div>
                          </div>

                      {error && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-600">
                          {error}
                        </div>
                      )}

                          <button suppressHydrationWarning
                            type="button"
                            disabled={isPlacingOrder}
                            onClick={handlePlaceOrder}
                            className="group relative mt-1 flex w-full items-center justify-center gap-4 overflow-hidden rounded-xl bg-[#1F3A2A] px-5 py-3 text-base font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-[#18301f] disabled:cursor-not-allowed disabled:opacity-60"
                            style={{ boxShadow: "rgba(50,50,93,0.25) 0px 6px 12px -2px, rgba(0,0,0,0.3) 0px 3px 7px -3px" }}
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
                                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                              </>
                            )}
                          </button>
                          <p className="mt-3 flex items-center justify-center gap-2 text-base text-[#8a7c63]">
                            <ShieldCheck size={12} className="text-[#c7a55b]" />
                            Secure checkout • SSL encrypted payment
                          </p>
                        </div>
                      ) : (
                        /* Editable address form */
                        <>
                          <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#8a7c63]">Editing Address</span>
                              <button type="button" onClick={() => setEditingAddress(false)} className="text-sm font-semibold uppercase tracking-[0.1em] text-[#c7a55b] hover:underline">
                              Cancel
                            </button>
                          </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className={labelClass}>Address Label</label>
                          <input suppressHydrationWarning
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
                          <input suppressHydrationWarning
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
                          <input suppressHydrationWarning
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
                          <input suppressHydrationWarning
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
                          <input suppressHydrationWarning
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
                          <input suppressHydrationWarning
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
                          <input suppressHydrationWarning
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
                          <input suppressHydrationWarning
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
                          <input suppressHydrationWarning
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
                        <select suppressHydrationWarning
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

                      <button suppressHydrationWarning
                        type="submit"
                        disabled={isPlacingOrder}
                        className="group relative mt-1 flex w-full items-center justify-center gap-4 overflow-hidden rounded-xl bg-[#1F3A2A] px-5 py-3 text-base font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-[#18301f] disabled:cursor-not-allowed disabled:opacity-60"
                        style={{ boxShadow: "rgba(50,50,93,0.25) 0px 6px 12px -2px, rgba(0,0,0,0.3) 0px 3px 7px -3px" }}
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
                            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </button>
                      <p className="mt-3 flex items-center justify-center gap-2 text-xs text-[#8a7c63]">
                        <ShieldCheck size={12} className="text-[#c7a55b]" />
                        Secure checkout • SSL encrypted payment
                      </p>
                    </>
                    )}
                  </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="rounded-2xl border border-[#d8e3cf] bg-[#f2f7ee] p-4">
                        <p className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.14em] text-[#516a35]">
                          <BadgeCheck size={18} /> Order created successfully
                        </p>
                        <p className="mt-2 text-sm text-[#5c6f50]">
                          Order ID:{" "}
                          <code className="rounded bg-white/70 px-2 py-0.5 font-mono text-[#1F3A2A]">{orderId}</code>
                        </p>
                        <div className="mt-3 border-t border-[#d8e3cf] pt-3 text-sm leading-5 text-[#5c6f50]">
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
                      <div className="rounded-2xl border border-[#ece3d2] bg-[#fbf9f4] p-4">
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
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#5c5546] transition-colors hover:text-[#1F3A2A]"
                >
                  <ArrowLeft size={16} /> Return to Shopping Cart
                </Link>
              </div>

              {/* ─────────────── Right : Order Summary + Payment ───────────── */}
              <aside className="space-y-3 lg:sticky lg:top-28">
                {/* Order Summary */}
                <div className="overflow-hidden rounded-3xl border border-[#ece3d2] bg-white/90 p-5 backdrop-blur-sm" style={{ boxShadow: "rgba(50,50,93,0.25) 0px 6px 12px -2px, rgba(0,0,0,0.3) 0px 3px 7px -3px" }}>
                  <div className="mb-4 flex items-center justify-between border-b border-[#ece3d2] pb-3">
                    <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#1F3A2A]">
                      Order Summary
                    </h2>
                    <span className="rounded-full bg-[#1F3A2A] px-3 py-1 text-xs font-bold text-[#e9d7a8]">
                      {summary.cartCount} items
                    </span>
                  </div>

                  <div className="max-h-52 space-y-4 overflow-y-auto pr-1">
                    {summary.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="relative aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#eee6d9] bg-[#f8f4ec]">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            crossOrigin="anonymous"
                            sizes="64px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[#2b2a26]">{item.name}</p>
                          {item.finish || item.size ? (
                            <p className="mt-0.5 text-xs font-semibold text-[#c7a55b]">
                              {[item.finish && `Finish: ${item.finish}`, item.size && `Size: ${item.size}`]
                                .filter(Boolean)
                                .join("  |  ")}
                            </p>
                          ) : null}
                          <p className="mt-0.5 text-xs text-[#8a7c63]">
                            {formatCurrency(item.price)} × {item.quantity}
                          </p>
                        </div>
                        <span className="tabular-nums shrink-0 text-sm font-bold text-[#1F3A2A]">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#6f6658]">Subtotal</span>
                      <span className="tabular-nums font-semibold text-[#1F3A2A]">{formatCurrency(summary.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6f6658]">Promo Discount (8%)</span>
                      <span className="font-semibold text-[#4a7c3a]">- {formatCurrency(summary.discount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6f6658]">Shipping</span>
                      <span className="font-semibold text-[#4a7c3a]">
                        {summary.shipping === 0 ? "FREE" : formatCurrency(summary.shipping)}
                      </span>
                    </div>
                    {Object.entries(gstSlabs).length > 0 && (
                      <div className="border-t border-[#ece3d2] pt-2">
                        <div className="space-y-2">
                          {Object.entries(gstSlabs).map(([rate, amount]) => (
                            <div key={rate} className="flex justify-between">
                              <span className="text-[#6f6658]">GST ({rate}%)</span>
                              <span className="font-semibold text-[#1F3A2A]">{formatCurrency(Math.round(amount))}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 flex justify-between border-t border-[#ece3d2] pt-2">
                          <span className="font-semibold text-[#6f6658]">Total GST</span>
                          <span className="font-semibold text-[#1F3A2A]">{formatCurrency(summary.estimatedTax)}</span>
                        </div>
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between border-t-2 border-[#c7a55b]/60 pt-3">
                      <span className="text-base font-bold uppercase tracking-wide text-[#1F3A2A]">Grand Total</span>
                      <span className="tabular-nums text-xl font-bold text-[#1F3A2A]">
                        {formatCurrency(summary.grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* ─────────── Payment Methods & Trust — Full Width ─────────── */}
          {!orderId && cartItems.length > 0 && (
            <>
              {/* Payment Methods */}
              <div className="mt-6 rounded-3xl border border-[#2a4a38] bg-[#1F3A2A] p-5" style={{ boxShadow: "rgba(50,50,93,0.25) 0px 6px 12px -2px, rgba(0,0,0,0.3) 0px 3px 7px -3px" }}>
                <h3 className="mb-4 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.14em] text-[#e9d7a8]">
                  <Wallet size={16} className="text-[#c7a55b]" /> Payment Methods
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { icon: CreditCard, label: "Credit / Debit", sub: "Cards, Visa, MasterCard" },
                    { icon: Smartphone, label: "UPI", sub: "Google Pay, PhonePe" },
                    { icon: Landmark, label: "Net Banking", sub: "All major banks" },
                    { icon: Wallet, label: "Wallets", sub: "Paytm, Amazon Pay" },
                  ].map((m, i) => (
                    <div
                      key={i}
                      className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 transition-all hover:border-[#c7a55b] hover:bg-white/10"
                    >
                      <m.icon size={14} className="shrink-0 text-[#c7a55b] transition-transform group-hover:scale-110" />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-white">{m.label}</p>
                        <p className="truncate text-[11px] text-white/50">{m.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-white/40">
                  Secured by <span className="font-bold text-[#e9d7a8]">Razorpay</span> • 256-bit SSL Encryption
                </p>
              </div>

              {/* Trust badges — full width strap */}
              <div className="mt-4 rounded-3xl border border-[#ece3d2] bg-white/90 px-6 py-4 backdrop-blur-sm" style={{ boxShadow: "rgba(50,50,93,0.25) 0px 6px 12px -2px, rgba(0,0,0,0.3) 0px 3px 7px -3px" }}>
                <div className="flex items-center justify-between divide-x divide-[#ece3d2]">
                  {trustBadges.map((t, i) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-1">
                      <t.icon size={16} className="shrink-0 text-[#c7a55b]" />
                      <span className="text-xs font-semibold text-[#6f6658] whitespace-nowrap">
                        {t.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ─────────── Why Buy From ENSIS ─────────── */}
          <div className="mt-10">
            <div className="mb-6 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#c7a55b]">Why Buy From ENSIS</p>
              <h2 className="mt-2 text-3xl font-bold text-[#1F3A2A]" >
                Crafted for Wellness, Built to Last
              </h2>
              <p className="mt-2 text-sm text-[#8a7c63]">Every ENSIS product is designed with quality, expertise and long-term wellness in mind.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {whyBuy.map((b, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-3xl border border-[#ece3d2] bg-white/80 p-4 shadow-[0_18px_40px_-24px_rgba(31,58,42,0.25)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_50px_-24px_rgba(199,165,91,0.4)]"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1F3A2A] transition-colors duration-300 group-hover:bg-[#c7a55b]">
                    <b.icon size={20} className="text-[#e9d7a8] transition-colors group-hover:text-[#1F3A2A]" />
                  </div>
                  <h3 className="text-base font-semibold text-[#1F3A2A]">{b.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#8a7c63]">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ─────────── Need Help ─────────── */}
          <div className="mt-10">
            <div className="relative overflow-hidden rounded-3xl border border-[#1F3A2A]/20 bg-cover bg-center bg-no-repeat p-6 text-white shadow-[0_30px_60px_-24px_rgba(31,58,42,0.6)] sm:p-8" style={{ backgroundImage: `url(${needHelpBg.src || needHelpBg})` }}>
              <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#e9d7a8]">Need Help?</p>
                  <h2 className="mt-2 text-2xl font-bold" >
                    Our wellness experts are here
                  </h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-[#d9d4c9]">
                    Speak with our design & order specialists for assistance with your purchase or installation.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4">
                    {helpChannels.map((c, i) => (
                      <a
                        key={i}
                        href={c.href}
                        target={c.href.startsWith("http") ? "_blank" : undefined}
                        rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold backdrop-blur-sm transition-colors hover:border-[#c7a55b]"
                      >
                        <c.icon size={16} className="text-[#e9d7a8]" />
                        <span>
                          {c.label}
                          <span className="block text-xs font-normal text-white/60">{c.value}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
                <GreenButton
                  path="/contact"
                  text="Contact Us"
                  rightIcon={<ArrowRight size={14} className="text-[#050A1A]" />}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
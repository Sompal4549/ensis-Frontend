"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { Container } from "@/components/ui/Container";
import { formatCurrency } from "@/utils";
import { RazorpayCheckout } from "@/components/RazorpayCheckout";
import { API_URL } from "@/app/lib/api";

interface ShippingAddress {
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
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
  grandTotal: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartCount, subtotal, clearCart } = useShop();

  const [token, setToken] = useState<string>("");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    label: "Home",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const [orderId, setOrderId] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [checkoutSnapshot, setCheckoutSnapshot] = useState<CheckoutSnapshot | null>(null);

  // Authentication check and dynamic mounting
  useEffect(() => {
    queueMicrotask(() => setIsMounted(true));
    const savedToken = localStorage.getItem("ensis_access_token");
    if (!savedToken) {
      router.push("/login");
    } else {
      queueMicrotask(() => setToken(savedToken));
    }
  }, [router]);

  // Handle shipping address changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Cart calculations matching cart/page.tsx
  const hasItems = cartItems.length > 0;
  const freeShippingAt = 50000;
  const discount = hasItems ? Math.round(subtotal * 0.08) : 0;
  const shipping = subtotal >= freeShippingAt || !hasItems ? 0 : 999;
  const estimatedTax = hasItems ? Math.round((subtotal - discount) * 0.05) : 0;
  const grandTotal = Math.max(0, subtotal - discount + shipping + estimatedTax);
  const summary = checkoutSnapshot ?? {
    items: cartItems,
    cartCount,
    subtotal,
    discount,
    shipping,
    estimatedTax,
    grandTotal,
  };

  // Place internal MongoDB Order
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    // Validate shipping address
    if (
      !shippingAddress.street.trim() ||
      !shippingAddress.city.trim() ||
      !shippingAddress.state.trim() ||
      !shippingAddress.postalCode.trim() ||
      !shippingAddress.country.trim()
    ) {
      setError("Please complete all shipping address fields.");
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
        throw new Error(payload.message || "Failed to create order on server.");
      }

      // Store created MongoDB order ID
      const createdOrder = payload.data;
      setCheckoutSnapshot(snapshot);
      setOrderId(createdOrder._id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred while placing order.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Success payment callback
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
      paymentStatus: "paid",
      orderStatus: "confirmed",
      shippingAddress,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(`ensis_order_${internalOrderId}`, JSON.stringify(orderSnapshot));
    // Clear items in local state cart context
    clearCart();
    // Redirect to success page
    router.push(`/orders/${internalOrderId}?payment=success`);
  };

  // Failure payment callback
  const handlePaymentFailure = (paymentError: string) => {
    setError(paymentError);
  };

  if (!isMounted) return null;

  return (
    <div className="">
      <Container>
        <h2 className="text-2xl font-serif mb-2 font-medium">Checkout Experience</h2>

        {cartItems.length === 0 && !orderId ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#eee5d8] bg-white p-4 text-center shadow-sm">
            <ShoppingBag size={48} className="text-[#c8a45d] mb-2" />
            <h2 className="text-xl font-bold">Your checkout is inactive</h2>
            <p className="mt-2 text-sm max-w-sm">
              Your cart is empty. Please add some wellness products to checkout.
            </p>
            <Link
              href="/products"
              className="mt-2 inline-flex h-10 items-center justify-center rounded-md bg-[#313b30] px-6 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#172015]"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] items-start">
            {/* Left Side: Shipping Address & Payment Form */}
            <div className="space-y-6">
              {/* Form Block */}
              <div className="rounded-2xl border border-[#eee5d8] bg-white p-2 shadow-[0_8px_24px_rgba(49,59,48,0.02)]">
                <h2 className="flex items-center gap-2 text-lg font-bold border-b border-[#eee5d8] pb-4 mb-2">
                  <MapPin size={20} className="" />
                  Shipping Destination
                </h2>

                {!orderId ? (
                  <form onSubmit={handlePlaceOrder} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <label className="block text-xs font-bold uppercase tracking-wide">
                        Address Label (e.g. Home, Office)
                        <input
                          className="mt-2 w-full border border-[#d8cbb9] px-4 py-3 text-sm font-medium  outline-none focus:border-[#8d6a3a] bg-[#faf8f4] rounded-md"
                          type="text"
                          name="label"
                          value={shippingAddress.label}
                          onChange={handleInputChange}
                          required
                        />
                      </label>
                      <label className="block text-xs font-bold uppercase tracking-wide">
                        Postal Code
                        <input
                          className="mt-2 w-full border border-[#d8cbb9] px-4 py-3 text-sm font-medium outline-none focus:border-[#8d6a3a] bg-[#faf8f4] rounded-md"
                          type="text"
                          name="postalCode"
                          placeholder="e.g. 110001"
                          value={shippingAddress.postalCode}
                          onChange={handleInputChange}
                          required
                        />
                      </label>
                    </div>

                    <label className="block text-xs font-bold uppercase tracking-wide">
                      Street Address
                      <input
                        className="mt-2 w-full border border-[#d8cbb9] px-4 py-3 text-sm font-medium  outline-none focus:border-[#8d6a3a] bg-[#faf8f4] rounded-md"
                        type="text"
                        name="street"
                        placeholder="House no., Apartment, Street name"
                        value={shippingAddress.street}
                        onChange={handleInputChange}
                        required
                      />
                    </label>

                    <div className="grid grid-cols-3 gap-4">
                      <label className="block text-xs font-bold uppercase tracking-wide">
                        City
                        <input
                          className="mt-2 w-full border border-[#d8cbb9] px-4 py-3 text-sm font-medium outline-none focus:border-[#8d6a3a] bg-[#faf8f4] rounded-md"
                          type="text"
                          name="city"
                          value={shippingAddress.city}
                          onChange={handleInputChange}
                          required
                        />
                      </label>
                      <label className="block text-xs font-bold uppercase tracking-wide">
                        State
                        <input
                          className="mt-2 w-full border border-[#d8cbb9] px-4 py-3 text-sm font-medium  outline-none focus:border-[#8d6a3a] bg-[#faf8f4] rounded-md"
                          type="text"
                          name="state"
                          value={shippingAddress.state}
                          onChange={handleInputChange}
                          required
                        />
                      </label>
                      <label className="block text-xs font-bold uppercase tracking-wide">
                        Country
                        <input
                          className="mt-2 w-full border border-[#d8cbb9] px-4 py-3 text-sm font-medium outline-none focus:border-[#8d6a3a] bg-[#faf8f4] rounded-md"
                          type="text"
                          name="country"
                          value={shippingAddress.country}
                          onChange={handleInputChange}
                          required
                        />
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isPlacingOrder}
                      className="w-full mt-2 py-2 flex items-center justify-center gap-2 rounded-xl bg-[#313b30] text-sm font-bold text-white transition-colors hover:bg-[#1a2119] cursor-pointer"
                    >
                      <LockKeyhole size={16} />
                      {isPlacingOrder ? "Placing Order..." : "Confirm Shipping & Place Order"}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="rounded-xl bg-[#eef6e9] border border-[#516a35]/20 p-4">
                      <p className="text-xs font-bold text-[#516a35] uppercase tracking-wide">
                        Order Created Successfully!
                      </p>
                      <p className="text-xs mt-1">
                        Order ID: <code className="font-mono bg-white/60 px-1 py-0.5 rounded">{orderId}</code>
                      </p>
                      <div className="mt-4 pt-3 border-t border-[#516a35]/10 text-xs">
                        <p className="font-bold">Deliver To:</p>
                        <p className="mt-1 text-slate-700">
                          {shippingAddress.label} • {shippingAddress.street}, {shippingAddress.city},{" "}
                          {shippingAddress.state} - {shippingAddress.postalCode},{" "}
                          {shippingAddress.country}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <p className="text-sm font-bold">Select payment method:</p>
                      <RazorpayCheckout
                        orderId={orderId}
                        token={token}
                        onSuccess={handlePaymentSuccess}
                        onFailure={handlePaymentFailure}
                        amount={summary.grandTotal} // total is in rupees
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-600">
                    {error}
                  </div>
                )}
              </div>

              {/* Back Button */}
              <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-[#8d6a3a]">
                <ArrowLeft size={16} />
                Return to Shopping Cart
              </Link>
            </div>

            {/* Right Side: Order Summary */}
            <aside className="space-y-6 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-[#eee5d8] bg-white p-2 shadow-[0_8px_24px_rgba(49,59,48,0.02)]">
                <h2 className="text-lg font-bold mb-5">Order Summary</h2>

                {/* Items List */}
                <div className="max-h-60 overflow-y-auto divide-y divide-[#eee5d8] pr-2 scrollbar-thin">
                  {summary.items.map((item) => (
                    <div key={item.id} className="py-3 flex gap-3 text-xs items-center first:pt-0">
                      <div className="relative aspect-square h-12 w-12 shrink-0 overflow-hidden rounded-md bg-[#f7f3ec]">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold truncate leading-tight">{item.name}</p>
                        <p className="mt-1 text-slate-400 font-semibold">
                          {formatCurrency(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold shrink-0 text-right">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing Totals */}
                <div className="mt-4 border-t border-[#eee5d8] pt-4 space-y-2.5 text-xs ">
                  <div className="flex justify-between">
                    <span>Subtotal ({summary.cartCount} items)</span>
                    <span className="font-bold text-[#1a1a1a]">{formatCurrency(summary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount (8% Promo)</span>
                    <span className="font-bold text-[#3d7c39]">- {formatCurrency(summary.discount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span className="font-bold text-[#3d7c39]">
                      {summary.shipping === 0 ? "FREE" : formatCurrency(summary.shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax (5%)</span>
                    <span className="font-bold">{formatCurrency(summary.estimatedTax)}</span>
                  </div>

                  <div className="mt-4 border-t border-[#eee5d8] pt-4 flex items-center justify-between ">
                    <span className="text-base font-bold">Total Amount</span>
                    <span className="text-xl font-bold">{formatCurrency(summary.grandTotal)}</span>
                  </div>
                </div>

                {/* SSL badges */}
                <div className="mt-6 pt-5 border-t border-[#eee5d8] flex items-center justify-center gap-3">
                  <div className="flex items-center gap-1 text-[10px] font-semibold">
                    <ShieldCheck size={14} className="text-[#3d7c39]" />
                    <span>SSL Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-semibold">
                    <Truck size={14} className="" />
                    <span>Insured Delivery</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </Container>
    </div>
  );
}

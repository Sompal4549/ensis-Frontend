"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  CreditCard,
  Gift,
  Heart,
  Leaf,
  LockKeyhole,
  Minus,
  PackageCheck,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";
import { useShop, cartItemKey, type CartItem, type ShopProduct } from "@/context/ShopContext";
import { Container } from "@/components/ui/Container";
import { type Product } from "@/constants";
import { formatCurrency } from "@/utils";
import YouMightCarousel from "@/components/ui/YouMightCarousel";
import { productApi, getImageUrl } from "@/lib/api/api";
import { useEffect, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import { sanitizeInlineHtml } from "@/lib/sanitize-html";

const LOTUS_PATTERN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='92' height='92' viewBox='0 0 92 92'%3E%3Cg fill='none' stroke='%231F3A2A' stroke-width='1'%3E%3Cpath d='M46 8 C28 20 28 40 46 58 C64 40 64 20 46 8Z'/%3E%3Cpath d='M46 20 C34 28 34 44 46 52 C58 44 58 28 46 20Z'/%3E%3Cpath d='M46 8 C30 34 30 62 46 84 C62 62 62 34 46 8Z' opacity='.5'/%3E%3C/g%3E%3C/svg%3E\")";

function imageSource(image: string | StaticImageData) {
  return typeof image === "string" ? image : image.src;
}

function productToShopProduct(product: Product): ShopProduct {
  return {
    id: product.id.toString(),
    slug: product.slug,
    name: product.title,
    category: product.category,
    price: product.price,
    image: imageSource(product.images[0]),
    gstRate: product.gstRate,
  };
}

function TrustItem({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-center gap-4 px-2 py-2">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1F3A2A]/5">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-[#1F3A2A]">{title}</p>
        <p className="mt-0.5 text-[11px] font-medium text-[#8a7c63]">{text}</p>
      </div>
    </div>
  );
}

function QuantityControl({ item }: { item: CartItem }) {
  const { decreaseQuantity, increaseQuantity } = useShop();
  return (
    <div className="inline-flex h-8.5 w-[104px] items-center justify-between overflow-hidden rounded-lg border border-[#e4dccb] bg-white">
      <button type="button" aria-label={`Decrease ${item.name} quantity`} onClick={() => decreaseQuantity(cartItemKey(item))} className="flex h-full w-8 items-center justify-center text-[#1F3A2A] transition-colors hover:bg-[#f6f0e8]">
        <Minus size={13} />
      </button>
      <span className="min-w-6 text-center text-xs font-semibold text-[#1F3A2A]">{item.quantity}</span>
      <button type="button" aria-label={`Increase ${item.name} quantity`} onClick={() => increaseQuantity(cartItemKey(item))} className="flex h-full w-8 items-center justify-center text-[#1F3A2A] transition-colors hover:bg-[#f6f0e8]">
        <Plus size={13} />
      </button>
    </div>
  );
}

function CartTableRow({ item }: { item: CartItem }) {
  const { removeFromCart, toggleLike, isLiked } = useShop();
  const liked = isLiked(item.id);

  const categoryName = typeof item.category === "object" && item.category !== null
    ? (item.category as any).name ?? ""
    : item.category ?? "";

  return (
    <div className="grid gap-3 border-t border-[#EDE4D3] p-1.5 md:grid-cols-[1fr_110px_140px_110px_34px] md:items-center md:px-4 md:py-2">
      <div className="grid grid-cols-[72px_1fr] gap-3">
        <Link href={`/products/${item.slug || item.id}`} className="relative aspect-square overflow-hidden rounded-lg bg-[#FBF8F2]">
          <Image src={item.image} alt={item.name} fill sizes="72px" className="object-cover" crossOrigin="anonymous" />
        </Link>
        <div className="min-w-0 py-0.5">
          <Link href={`/products/${item.slug || item.id}`}>
            <h3
              className="line-clamp-2 text-sm font-semibold leading-5 text-[#1F3A2A]"
              dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(item.name) }}
            />
          </Link>
          <p className="mt-1 text-xs font-medium text-[#8a7c63]">{categoryName}</p>
          {(item.finish || item.size) && (
            <p className="mt-1 text-[11px] font-semibold text-[#8d6a3a]">
              {[item.finish && `Finish: ${item.finish}`, item.size && `Size: ${item.size}`]
                .filter(Boolean)
                .join("  |  ")}
            </p>
          )}
          <button type="button" onClick={() => toggleLike(item)} className={`mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold transition-colors ${liked ? "text-red-600" : "text-[#8a7c63]"}`}>
            <Heart size={13} className={liked ? "fill-red-500" : ""} />
            {liked ? "In wishlist" : "Add to wishlist"}
          </button>
        </div>
      </div>
      <div className="hidden text-sm font-semibold text-[#1F3A2A] md:block">{formatCurrency(item.price)}</div>
      <div><QuantityControl item={item} /></div>
      <div className="flex items-center justify-between gap-4 md:block">
        <span className="text-xs font-semibold text-[#8a7c63] md:hidden">Total</span>
        <span className="text-sm font-semibold text-[#1F3A2A]">{formatCurrency(item.price * item.quantity)}</span>
      </div>
      <button type="button" aria-label={`Remove ${item.name}`} onClick={() => removeFromCart(cartItemKey(item))} className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#8a7c63] transition-colors hover:bg-[#f6f0e8] hover:text-[#1F3A2A] md:static">
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export default function CartPage() {
  const { cartItems, clearCart, cartCount, subtotal } = useShop();
  const hasItems = cartItems.length > 0;
  const freeShippingAt = 50000;
  const amountToFreeShipping = Math.max(0, freeShippingAt - subtotal);
  const discount = 0;
  const shipping = subtotal >= freeShippingAt || !hasItems ? 0 : 999;
  const gstTotal = hasItems
    ? Math.round(cartItems.reduce((sum, item) => sum + (item.price * item.quantity * (item.gstRate ?? 5)) / 100, 0))
    : 0;
  const total = Math.max(0, subtotal - discount + shipping + gstTotal);

  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    productApi.list(100).then((res) => {
      const cartSlugs = new Set(cartItems.map((i) => i.slug));
      const filtered = res.products
        .filter((p: any) => !cartSlugs.has(p.slug))
        .map((p: any) => ({
          ...p,
          id: p._id,
          image: p.images?.[0] ? getImageUrl(p.images[0]) : "",
        }))
        .slice(0, 10);
      setSuggestions(filtered);
    }).catch(() => {});
  }, [cartItems]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FCFAF6] pt-3 pb-8 sm:pt-4 sm:pb-10">
      {/* Decorative premium background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-40 top-32 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(199,165,91,0.12),transparent_65%)]" />
        <div className="absolute -right-48 top-[38%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(31,58,42,0.08),transparent_65%)]" />
        <div className="absolute -bottom-48 left-[30%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(199,165,91,0.10),transparent_62%)]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: LOTUS_PATTERN }}
        />
      </div>

      <Container className="relative z-10 py-1 sm:py-2">
        <div className="">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold leading-tight text-[#1F3A2A] md:text-xl">
                Your Cart {hasItems ? `(${cartCount})` : ""}
              </h1>
            </div>
            {hasItems && (
              <button type="button" onClick={clearCart} className="inline-flex h-8 items-center gap-2 rounded-full border border-[#EDE4D3] bg-white px-3 text-xs font-semibold transition-all duration-300 hover:border-[#C7A55B] hover:text-[#8d6a3a]">
                <Trash2 size={13} /> Clear Cart
              </button>
            )}
          </div>

          <section className="mt-2.5 grid rounded-xl border border-[#EDE4D3] bg-white p-1 sm:p-1.5 shadow-[0_8px_24px_rgba(31,58,42,0.04)] sm:grid-cols-2 lg:grid-cols-4">
            <TrustItem icon={<Truck size={17} className="text-[#1F3A2A]" />} title="Free Shipping" text={`On orders over ${formatCurrency(freeShippingAt)}`} />
            <TrustItem icon={<RotateCcw size={17} className="text-[#1F3A2A]" />} title="30-Day Support" text="Hassle-free product guidance" />
            <TrustItem icon={<CreditCard size={17} className="text-[#1F3A2A]" />} title="Secure Payments" text="100% secure checkout" />
            <TrustItem icon={<ShieldCheck size={17} className="text-[#1F3A2A]" />} title="1 Year Warranty" text="Quality you can trust" />
          </section>

          {hasItems ? (
            <div className="mt-2.5 grid gap-3 lg:grid-cols-[1fr_370px] lg:items-start">
              <section className="overflow-hidden rounded-xl border border-[#EDE4D3] bg-white shadow-[0_10px_28px_rgba(31,58,42,0.05)]">
                <div className="hidden grid-cols-[1fr_110px_140px_110px_34px] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a89a82] md:grid">
                  <span>Product</span><span>Price</span><span>Quantity</span><span>Total</span><span />
                </div>
                <div className="relative">
                  {cartItems.map((item) => (<CartTableRow key={cartItemKey(item)} item={item} />))}
                </div>
                <div className="grid gap-3 border-t border-[#EDE4D3] p-2 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="flex gap-2.5">
                    <label className="relative flex-1">
                      <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a7c63]" />
                      <input type="text" placeholder="Enter promo code" className="h-8 w-full rounded-lg border border-[#e4dccb] bg-white/80 pl-9 pr-3 text-xs outline-none transition-all duration-200 placeholder:text-[#a79d8c] focus:border-[#c7a55b] focus:ring-2 focus:ring-[#c7a55b]/20" />
                    </label>
                    <button type="button" className="h-8 rounded-full border border-[#1F3A2A] px-4 text-xs font-semibold transition-all duration-300 hover:bg-[#1F3A2A] hover:text-white">Apply</button>
                  </div>
                  <div className="rounded-lg bg-[#f2f7ee] px-3 py-1.5 text-[11px] font-semibold text-[#516a35]">
                    <Truck size={13} className="mr-1.5 inline-block" />
                    {amountToFreeShipping > 0 ? "Add more items to unlock free shipping." : "Great news. Free shipping is active."}
                  </div>
                </div>
              </section>

              <aside className="space-y-3 lg:sticky lg:top-24">
                <section className="rounded-xl border border-[#EDE4D3] bg-white p-3.5 sm:p-4 shadow-[0_10px_28px_rgba(31,58,42,0.05)]">
                  <h2 className="text-base font-semibold text-[#1F3A2A]">Order Summary</h2>
                  <div className="mt-2 space-y-2 text-xs">
                    <div className="flex justify-between gap-3"><span className="text-[#5f665b]">Subtotal ({cartCount} items)</span><span className="tabular-nums font-semibold text-[#1F3A2A]">{formatCurrency(subtotal)}</span></div>
                    {discount > 0 && (
                      <div className="flex justify-between gap-3"><span className="text-[#5f665b]">Discount</span><span className="tabular-nums font-semibold text-[#2F7D5A]">- {formatCurrency(discount)}</span></div>
                    )}
                    <div className="flex justify-between gap-3"><span className="text-[#5f665b]">Shipping</span><span className="tabular-nums font-semibold text-[#2F7D5A]">{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span></div>
                    <div className="flex justify-between gap-3"><span className="text-[#5f665b]">GST</span><span className="tabular-nums font-semibold text-[#1F3A2A]">{formatCurrency(gstTotal)}</span></div>
                  </div>
                  <div className="mt-2.5 border-t border-[#EDE4D3] pt-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold uppercase tracking-wide text-[#1F3A2A]">Total</span>
                      <span className="tabular-nums text-lg font-semibold text-[#1F3A2A]">{formatCurrency(total)}</span>
                    </div>
                    <p className="mt-1 text-[10.5px] leading-4 text-[#8a7c63]">Pay securely online or request support from our wellness equipment team.</p>
                  </div>
                  <Link href="/checkout" className="mt-3 flex w-full items-center justify-center gap-3 rounded-full bg-[#1F3A2A] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_30px_rgba(31,58,42,0.28)] transition-all duration-300 hover:bg-[#18301f] hover:shadow-[0_16px_38px_rgba(31,58,42,0.36)]">
                    <LockKeyhole size={14} /> Proceed to Checkout
                  </Link>
                  <p className="mt-2 text-center text-[10.5px] font-medium text-[#a89a82]">Guaranteed safe and secure checkout</p>
                </section>
              </aside>
            </div>
          ) : (
            <section className="mt-3 flex py-8 flex-col items-center justify-center rounded-2xl border border-[#EDE4D3] bg-white px-6 text-center shadow-[0_14px_36px_rgba(31,58,42,0.06)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1F3A2A]/5">
                <ShoppingBag size={24} className="text-[#c7a55b]" />
              </div>
              <h2 className="mt-3 text-xl font-semibold text-[#1F3A2A]">Your cart is empty</h2>
              <p className="mt-2 max-w-md text-xs leading-5 text-[#5f665b]">Browse our wellness equipment and add products here to review quantities, shipping benefits, and order totals.</p>
              <Link href="/products" className="mt-4 inline-flex items-center gap-3 rounded-full bg-[#1F3A2A] px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-[0_12px_30px_rgba(31,58,42,0.28)] transition-all duration-300 hover:bg-[#18301f] hover:shadow-[0_16px_38px_rgba(31,58,42,0.36)]">
                Browse Products
              </Link>
            </section>
          )}

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <Link href="/products" className="inline-flex items-center gap-2 text-xs font-semibold text-[#8d6a3a] hover:text-[#8d6a3a]">
              <ArrowLeft size={14} /> Continue Shopping
            </Link>
            {hasItems && (
              <button type="button" onClick={clearCart} className="inline-flex items-center gap-2 text-xs font-semibold text-[#8a7c63] hover:text-[#1F3A2A]">
                <Trash2 size={14} /> Clear Cart
              </button>
            )}
          </div>

          {suggestions.length > 0 && (
            <section className="mt-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C7A55B]">Curated for you</p>
              <h2 className="mt-0.5 text-lg font-semibold text-[#1F3A2A] md:text-xl">You May Also Like</h2>
              <div className="mt-2.5">
                <YouMightCarousel>
                  {suggestions.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </YouMightCarousel>
              </div>
            </section>
          )}

          <section className="mt-5 grid gap-3 rounded-xl border border-[#EDE4D3] bg-white p-3 shadow-[0_10px_28px_rgba(31,58,42,0.04)] sm:grid-cols-4">
            {[
              [BadgeCheck, "Quality Checked", "Safe and effective"],
              [Leaf, "Clean Materials", "Built for wellness spaces"],
              [PackageCheck, "Secure Packing", "Protected dispatch"],
              [Gift, "Project Support", "Bulk order guidance"],
            ].map(([Icon, title, text]) => {
              const DisplayIcon = Icon as typeof BadgeCheck;
              return (
                <div key={title as string} className="flex items-center gap-3 border-[#EDE4D3] sm:border-r sm:last:border-r-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1F3A2A]/5">
                    <DisplayIcon size={16} className="text-[#1F3A2A]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#1F3A2A]">{title as string}</p>
                    <p className="text-[10.5px] font-medium text-[#8a7c63]">{text as string}</p>
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </Container>
    </div>
  );
}

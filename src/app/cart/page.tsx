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
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5efe6]">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold">{title}</p>
        <p className="mt-0.5 text-[11px] font-medium">{text}</p>
      </div>
    </div>
  );
}

function QuantityControl({ item }: { item: CartItem }) {
  const { decreaseQuantity, increaseQuantity } = useShop();
  return (
    <div className="inline-flex h-11 w-[118px] items-center justify-between overflow-hidden rounded-md border border-[#e5ded5] bg-white">
      <button type="button" aria-label={`Decrease ${item.name} quantity`} onClick={() => decreaseQuantity(cartItemKey(item))} className="flex h-full w-10 items-center justify-center text-[#313b30] transition-colors hover:bg-[#f6f0e8]">
        <Minus size={15} />
      </button>
      <span className="min-w-8 text-center text-sm font-semibold text-[#1a1a1a]">{item.quantity}</span>
      <button type="button" aria-label={`Increase ${item.name} quantity`} onClick={() => increaseQuantity(cartItemKey(item))} className="flex h-full w-10 items-center justify-center text-[#313b30] transition-colors hover:bg-[#f6f0e8]">
        <Plus size={15} />
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
    <div className="grid gap-4 border-t border-[#eee5d8] p-2 md:grid-cols-[1fr_110px_150px_110px_34px] md:items-center md:px-5">
      <div className="grid grid-cols-[86px_1fr] gap-4">
        <Link href={`/products/${item.slug || item.id}`} className="relative aspect-square overflow-hidden rounded-md bg-[#f7f3ec]">
          <Image src={item.image} alt={item.name} fill sizes="86px" className="object-cover" crossOrigin="anonymous" />
        </Link>
        <div className="min-w-0 py-1">
          <Link href={`/products/${item.slug || item.id}`}>
            <h3 className="line-clamp-2 text-sm font-bold leading-5 text-[#1a1a1a]">{item.name}</h3>
          </Link>
          <p className="mt-1 text-xs font-medium">{categoryName}</p>
          {(item.finish || item.size) && (
            <p className="mt-1 text-[11px] font-semibold text-[#8d6a3a]">
              {[item.finish && `Finish: ${item.finish}`, item.size && `Size: ${item.size}`]
                .filter(Boolean)
                .join("  |  ")}
            </p>
          )}
          <button type="button" onClick={() => toggleLike(item)} className={`mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold transition-colors ${liked ? "text-red-600" : ""}`}>
            <Heart size={13} className={liked ? "fill-red-500" : ""} />
            {liked ? "In wishlist" : "Add to wishlist"}
          </button>
        </div>
      </div>
      <div className="hidden text-sm font-semibold text-[#1a1a1a] md:block">{formatCurrency(item.price)}</div>
      <div><QuantityControl item={item} /></div>
      <div className="flex items-center justify-between gap-4 md:block">
        <span className="text-xs font-semibold text-[#6c7068] md:hidden">Total</span>
        <span className="text-sm font-semibold text-[#1a1a1a]">{formatCurrency(item.price * item.quantity)}</span>
      </div>
      <button type="button" aria-label={`Remove ${item.name}`} onClick={() => removeFromCart(cartItemKey(item))} className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-[#7d8378] transition-colors hover:bg-[#f6f0e8] hover:text-[#1a1a1a] md:static">
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
  const discount = hasItems ? Math.round(subtotal * 0.08) : 0;
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
    <div className="min-h-screen bg-[#fbfaf7] text-[#101010] pt-10">
      <Container>
        <div className="">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
            <h1 className="text-xl font-semibold leading-tight md:text-2xl">
                Your Cart {hasItems ? `(${cartCount})` : ""}
              </h1>
            </div>
            {hasItems && (
              <button type="button" onClick={clearCart} className="inline-flex h-10 items-center gap-4 rounded-md border border-[#d8d0c4] bg-white px-4 text-xs font-bold transition-colors hover:bg-[#f2ebe1]">
                <Trash2 size={15} /> Clear Cart
              </button>
            )}
          </div>

          <section className="mt-2 grid rounded-lg border border-[#eee5d8] bg-white shadow-[0_8px_24px_rgba(49,59,48,0.04)] sm:grid-cols-2 lg:grid-cols-4">
            <TrustItem icon={<Truck size={19} />} title="Free Shipping" text={`On orders over ${formatCurrency(freeShippingAt)}`} />
            <TrustItem icon={<RotateCcw size={19} />} title="30-Day Support" text="Hassle-free product guidance" />
            <TrustItem icon={<CreditCard size={19} />} title="Secure Payments" text="100% secure checkout" />
            <TrustItem icon={<ShieldCheck size={19} />} title="1 Year Warranty" text="Quality you can trust" />
          </section>

          {hasItems ? (
            <div className="mt-2 grid gap-4 lg:grid-cols-[1fr_360px] lg:items-start xl:grid-cols-[1fr_400px]">
              <section className="overflow-hidden rounded-lg border border-[#eee5d8] bg-white shadow-[0_8px_24px_rgba(49,59,48,0.04)]">
                <div className="hidden grid-cols-[1fr_110px_150px_110px_34px] px-5 py-4 text-xs font-bold md:grid">
                  <span>Product</span><span>Price</span><span>Quantity</span><span>Total</span><span />
                </div>
                <div className="relative">
                  {cartItems.map((item) => (<CartTableRow key={cartItemKey(item)} item={item} />))}
                </div>
                <div className="grid gap-4 border-t border-[#eee5d8] p-2 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="flex gap-4">
                    <label className="relative flex-1">
                      <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2" />
                      <input type="text" placeholder="Enter promo code" className="h-8 w-full rounded-md border border-[#e5ded5] bg-white pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-black focus:border-[#313b30]" />
                    </label>
                    <button type="button" className="h-8 rounded-md border border-[#313b30] px-5 text-xs font-bold transition-colors hover:bg-[#313b30] hover:text-white">Apply</button>
                  </div>
                  <div className="rounded-md bg-[#eef6e9] px-4 py-2 text-xs font-semibold text-[#516a35]">
                    <Truck size={15} className="mr-2 inline-block" />
                    {amountToFreeShipping > 0 ? "Add more items to unlock free shipping." : "Great news. Free shipping is active."}
                  </div>
                </div>
              </section>

              <aside className="space-y-2 lg:sticky lg:top-24">
                <section className="rounded-lg border border-[#eee5d8] bg-white p-2 shadow-[0_8px_24px_rgba(49,59,48,0.04)]">
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                  <div className="mt-2 space-y-2 text-xs">
                    <div className="flex justify-between gap-4"><span>Subtotal ({cartCount} items)</span><span className="tabular-nums font-semibold">{formatCurrency(subtotal)}</span></div>
                    <div className="flex justify-between gap-4"><span>Discount</span><span className="tabular-nums font-semibold text-[#3d7c39]">- {formatCurrency(discount)}</span></div>
                    <div className="flex justify-between gap-4"><span>Shipping</span><span className="tabular-nums font-semibold text-[#3d7c39]">{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span></div>
                    <div className="flex justify-between gap-4"><span>GST</span><span className="tabular-nums font-semibold text-[#1a1a1a]">{formatCurrency(gstTotal)}</span></div>
                  </div>
                  <div className="mt-2 border-t border-[#eee5d8] pt-2">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="tabular-nums text-2xl font-semibold">{formatCurrency(total)}</span>
                    </div>
                    <p className="mt-1 text-xs">Pay securely online or request support from our wellness equipment team.</p>
                  </div>
                  <Link href="/checkout" className="mt-2 py-2 w-full flex items-center justify-center gap-4 rounded-xl bg-[#313b30] text-base font-semibold text-white transition-colors hover:bg-[#172015]">
                    <div className="text-white flex items-center gap-4">
                      <LockKeyhole size={16} /> Proceed to Checkout
                    </div>
                  </Link>
                  <p className="mt-2 text-center text-[11px]">Guaranteed safe and secure checkout</p>
                </section>
              </aside>
            </div>
          ) : (
            <section className="mt-2 flex py-4 flex-col items-center justify-center rounded-lg border border-[#eee5d8] bg-white px-6 text-center shadow-[0_8px_24px_rgba(49,59,48,0.04)]">
              <ShoppingBag size={44} className="mb-5 text-[#c8a45d]" />
              <h2 className="text-2xl font-semibold text-[#101010]">Your cart is empty</h2>
              <p className="mt-3 max-w-md text-sm">Browse our wellness equipment and add products here to review quantities, shipping benefits, and order totals.</p>
              <Link href="/products" className="mt-2 inline-flex py-2 items-center justify-center rounded-md bg-[#313b30] px-6 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#172015]">
                <span className="text-white">Browse Products</span>
              </Link>
            </section>
          )}

          <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
            <Link href="/products" className="inline-flex items-center gap-4 text-sm font-semibold text-[#8d6a3a] hover:text-[#8d6a3a]">
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
            {hasItems && (
              <button type="button" onClick={clearCart} className="inline-flex items-center gap-4 text-sm font-semibold">
                <Trash2 size={16} /> Clear Cart
              </button>
            )}
          </div>

          {suggestions.length > 0 && (
            <section className="mt-2">
              <h2 className="text-2xl font-semibold">You May Also Like</h2>
              <div className="mt-2">
                <YouMightCarousel>
                  {suggestions.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </YouMightCarousel>
              </div>
            </section>
          )}

          <section className="mt-2 grid gap-4 rounded-lg border border-[#eee5d8] bg-white p-4 sm:grid-cols-4">
            {[
              [BadgeCheck, "Quality Checked", "Safe and effective"],
              [Leaf, "Clean Materials", "Built for wellness spaces"],
              [PackageCheck, "Secure Packing", "Protected dispatch"],
              [Gift, "Project Support", "Bulk order guidance"],
            ].map(([Icon, title, text]) => {
              const DisplayIcon = Icon as typeof BadgeCheck;
              return (
                <div key={title as string} className="flex items-center gap-4 border-[#eee5d8] sm:border-r sm:last:border-r-0">
                  <DisplayIcon size={24} />
                  <div>
                    <p className="text-xs font-semibold">{title as string}</p>
                    <p className="text-[11px] font-medium">{text as string}</p>
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
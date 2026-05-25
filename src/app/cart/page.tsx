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
  Sparkles,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";
import { useShop, type CartItem, type ShopProduct } from "@/context/ShopContext";
import { Container } from "@/components/ui/Container";
import { allProducts, type Product } from "@/constants";
import { formatCurrency } from "@/utils";
import YouMightCarousel from "@/components/ui/YouMightCarousel";
import CartAndDetailHeroBanner from "@/components/products/ProductDetailBanner";
import product_cart from "@/assets/products/cart.webp"
function imageSource(image: string | StaticImageData) {
  return typeof image === "string" ? image : image.src;
}

function productToShopProduct(product: Product): ShopProduct {
  return {
    id: product.id.toString(),
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: product.price,
    image: imageSource(product.image),
  };
}

function TrustItem({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 px-2 py-2">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5efe6] text-[#313b30]">
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
      <button
        type="button"
        aria-label={`Decrease ${item.name} quantity`}
        onClick={() => decreaseQuantity(item.id)}
        className="flex h-full w-10 items-center justify-center text-[#313b30] transition-colors hover:bg-[#f6f0e8]"
      >
        <Minus size={15} />
      </button>
      <span className="min-w-8 text-center text-sm font-semibold text-[#1a1a1a]">
        {item.quantity}
      </span>
      <button
        type="button"
        aria-label={`Increase ${item.name} quantity`}
        onClick={() => increaseQuantity(item.id)}
        className="flex h-full w-10 items-center justify-center text-[#313b30] transition-colors hover:bg-[#f6f0e8]"
      >
        <Plus size={15} />
      </button>
    </div>
  );
}

function CartTableRow({ item }: { item: CartItem }) {
  const { removeFromCart, toggleLike, isLiked } = useShop();
  const liked = isLiked(item.id);

  return (
    <div className="grid gap-4 border-t border-[#eee5d8] p-4 md:grid-cols-[1fr_110px_150px_110px_34px] md:items-center md:px-5">
      <div className="grid grid-cols-[86px_1fr] gap-4">
        <Link
          href={`/products/${item.slug}`}
          className="relative aspect-square overflow-hidden rounded-md bg-[#f7f3ec]"
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="86px"
            className="object-cover"
          />
        </Link>
        <div className="min-w-0 py-1">
          <Link href={`/products/${item.slug}`}>
            <h2 className="line-clamp-2 text-sm font-bold leading-5 text-[#1a1a1a]">
              {item.name}
            </h2>
          </Link>
          <p className="mt-1 text-xs font-medium">{item.category}</p>
          <button
            type="button"
            onClick={() => toggleLike(item)}
            className={`mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold transition-colors ${liked ? "text-red-600" : ""
              }`}
          >
            <Heart size={13} className={liked ? "fill-red-500" : ""} />
            {liked ? "In wishlist" : "Add to wishlist"}
          </button>
        </div>
      </div>

      <div className="hidden text-sm font-semibold text-[#1a1a1a] md:block">
        {formatCurrency(item.price)}
      </div>

      <div>
        <QuantityControl item={item} />
      </div>

      <div className="flex items-center justify-between gap-3 md:block">
        <span className="text-xs font-semibold text-[#6c7068] md:hidden">
          Total
        </span>
        <span className="text-sm font-semibold text-[#1a1a1a]">
          {formatCurrency(item.price * item.quantity)}
        </span>
      </div>

      <button
        type="button"
        aria-label={`Remove ${item.name}`}
        onClick={() => removeFromCart(item.id)}
        className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-[#7d8378] transition-colors hover:bg-[#f6f0e8] hover:text-[#1a1a1a] md:static"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function RecommendationCard({ product }: { product: Product }) {
  const { addToCart, toggleLike, isLiked } = useShop();
  const shopProduct = productToShopProduct(product);
  const liked = isLiked(shopProduct.id);

  return (
    <div className="rounded-lg  bg-white p-2 transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(49,59,48,0.08)]">
      <div className="relative aspect-[2/1] overflow-hidden rounded-md bg-[#f7f3ec]">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 45vw, 150px"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </Link>
        <button
          type="button"
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggleLike(shopProduct)}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#313b30] shadow-sm"
        >
          <Heart size={15} className={liked ? "fill-red-500 text-red-500" : ""} />
        </button>
      </div>
      <div className="px-1 py-2">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-9 text-xs font-semibold leading-5">
            {product.name}
          </h3>
        </Link>
        {/* <p className="mt-1 text-[11px]">
          4.7 <span className="text-[#d5a642]">*</span>
        </p> */}
        <p className="mt-1 text-sm font-bold text-[#1a1a1a]">
          {formatCurrency(product.price)}
        </p>
        {/* <button
          type="button"
          onClick={() => addToCart(shopProduct)}
          className="mt-3 flex h-9 w-full items-center justify-center rounded-md border border-[#313b30] text-xs font-bold text-[#313b30] transition-colors hover:bg-[#313b30] hover:text-white"
        >
          Add to Cart
        </button> */}
      </div>
    </div>
  );
}

export default function CartPage() {
  const { cartItems, clearCart, cartCount, subtotal } = useShop();
  const hasItems = cartItems.length > 0;
  const freeShippingAt = 50000;
  const amountToFreeShipping = Math.max(0, freeShippingAt - subtotal);
  const progress = Math.min(100, (subtotal / freeShippingAt) * 100);
  const discount = hasItems ? Math.round(subtotal * 0.08) : 0;
  const shipping = subtotal >= freeShippingAt || !hasItems ? 0 : 999;
  const estimatedTax = hasItems ? Math.round((subtotal - discount) * 0.05) : 0;
  const total = Math.max(0, subtotal - discount + shipping + estimatedTax);
  const suggestions = allProducts
    .filter((product) => !cartItems.some((item) => item.slug === product.slug))
    .slice(0, 5);
  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#101010]">
<CartAndDetailHeroBanner imageSrc={product_cart.src} imageAlt="Therapy Table" />
      <Container>
        <div className="">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold leading-tight md:text-2xl">
                Your Cart {hasItems ? `(${cartCount})` : ""}
              </h2>
              {/* <p className="text-xs text-[#4f574d]">
                {amountToFreeShipping > 0
                  ? `Almost there. Add ${formatCurrency(
                      amountToFreeShipping
                    )} more for free shipping.`
                  : "Great news. You get free shipping on this order."}
              </p> */}
            </div>

            {hasItems && (
              <button
                type="button"
                onClick={clearCart}
                className="inline-flex h-10 items-center gap-2 rounded-md border border-[#d8d0c4] bg-white px-4 text-xs font-bold transition-colors hover:bg-[#f2ebe1]"
              >
                <Trash2 size={15} />
                Clear Cart
              </button>
            )}
          </div>

          {/* <div className="mt-5 flex items-center gap-4">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e4e0d8]">
              <div
                className="h-full rounded-full bg-[#313b30]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="w-28 text-xs font-bold text-[#313b30]">
              {amountToFreeShipping > 0
                ? `${formatCurrency(amountToFreeShipping)} to go`
                : "Unlocked"}
            </span>
          </div> */}

          <section className="mt-2 grid rounded-lg border border-[#eee5d8] bg-white shadow-[0_8px_24px_rgba(49,59,48,0.04)] sm:grid-cols-2 lg:grid-cols-4">
            <TrustItem
              icon={<Truck size={19} />}
              title="Free Shipping"
              text={`On orders over ${formatCurrency(freeShippingAt)}`}
            />
            <TrustItem
              icon={<RotateCcw size={19} />}
              title="30-Day Support"
              text="Hassle-free product guidance"
            />
            <TrustItem
              icon={<CreditCard size={19} />}
              title="Secure Payments"
              text="100% secure checkout"
            />
            <TrustItem
              icon={<ShieldCheck size={19} />}
              title="1 Year Warranty"
              text="Quality you can trust"
            />
          </section>

          {hasItems ? (
            <div className="mt-2 grid gap-4 lg:grid-cols-[1fr_360px] lg:items-start xl:grid-cols-[1fr_400px]">
              <section className="overflow-hidden rounded-lg border border-[#eee5d8] bg-white shadow-[0_8px_24px_rgba(49,59,48,0.04)]">
                <div className="hidden grid-cols-[1fr_110px_150px_110px_34px] px-5 py-4 text-xs font-bold md:grid">
                  <span>Product</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span>Total</span>
                  <span />
                </div>

                <div className="relative">
                  {cartItems.map((item) => (
                    <CartTableRow key={item.id} item={item} />
                  ))}
                </div>

                <div className="grid gap-4 border-t border-[#eee5d8] p-4 md:grid-cols-[1fr_auto] md:items-center md:p-5">
                  <div className="flex gap-2">
                    <label className="relative flex-1">
                      <Tag
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 "
                      />
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        className="h-8 w-full rounded-md border border-[#e5ded5] bg-white pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-black focus:border-[#313b30]"
                      />
                    </label>
                    <button
                      type="button"
                      className="h-8 rounded-md border border-[#313b30] px-5 text-xs font-bold transition-colors hover:bg-[#313b30] hover:text-white"
                    >
                      Apply
                    </button>
                  </div>

                  <div className="rounded-md bg-[#eef6e9] px-4 py-2 text-xs font-semibold text-[#516a35]">
                    <Truck size={15} className="mr-2 inline-block" />
                    {amountToFreeShipping > 0
                      ? "Add more items to unlock free shipping."
                      : "Great news. Free shipping is active."}
                  </div>
                </div>
              </section>

              <aside className="space-y-5 lg:sticky lg:top-24">
                <section className="rounded-lg border border-[#eee5d8] bg-white p-4 shadow-[0_8px_24px_rgba(49,59,48,0.04)]">
                  <h2 className="text-xl font-semibold">
                    Order Summary
                  </h2>
                  <div className="mt-2 space-y-2 text-xs">
                    <div className="flex justify-between gap-4">
                      <span className="">
                        Subtotal ({cartCount} items)
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="">Discount</span>
                      <span className="font-semibold text-[#3d7c39]">
                        - {formatCurrency(discount)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="">Shipping</span>
                      <span className="font-semibold text-[#3d7c39]">
                        {shipping === 0 ? "FREE" : formatCurrency(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="">Estimated Tax</span>
                      <span className="font-semibold text-[#1a1a1a]">
                        {formatCurrency(estimatedTax)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 border-t border-[#eee5d8] pt-5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-lg font-semibold ">
                        Total
                      </span>
                      <span className="text-2xl font-semibold">
                        {formatCurrency(total)}
                      </span>
                    </div>
                    <p className="mt-3 text-xs">
                      Pay securely online or request support from our wellness
                      equipment team.
                    </p>
                  </div>

                  <Link
                    href="/checkout"
                    className="mt-4 h-12 w-full flex items-center justify-center gap-2 rounded-xl bg-[#313b30] text-base font-semibold text-white transition-colors hover:bg-[#172015]"
                  >
                    <div className="text-white flex gap-2 items-center justify-center">
                      <LockKeyhole size={16} />
                      Proceed to Checkout
                    </div>
                  </Link>

                  <p className="mt-2 text-center text-[11px]">
                    Guaranteed safe and secure checkout
                  </p>
                  <div className="mt-3 grid grid-cols-5 gap-2 text-center text-[10px] font-bold">
                    {["VISA", "MC", "AMEX", "Apple", "GPay"].map((item) => (
                      <span
                        key={item}
                        className="rounded border border-[#e5ded5] bg-[#fbfaf7] py-2"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </section>

                {/* <section className="rounded-lg border border-[#eee5d8] bg-[#fbf2df] p-6">
                  <div className="flex items-start gap-3">
                    <Sparkles size={18} className="mt-1 text-[#8d6a3a]" />
                    <div>
                      <h2 className="text-sm font-bold text-[#1a1a1a]">
                        Ensis Rewards
                      </h2>
                      <p className="mt-2 text-sm font-semibold text-[#4f574d]">
                        You will earn {Math.max(1, Math.round(total / 1000))} points
                        on this order.
                      </p>
                      <p className="mt-2 text-xs text-[#6c7068]">
                        Join now to get special project pricing and order support.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/login"
                    className="mt-5 flex py-2 px-4 items-center justify-center rounded-md border border-[#313b30] text-xs font-bold text-[#313b30] transition-colors hover:bg-[#313b30] hover:text-white"
                  >
                    Join Now
                  </Link>
                </section> */}
              </aside>
            </div>
          ) : (
            <section className="mt-2 flex py-4 flex-col items-center justify-center rounded-lg border border-[#eee5d8] bg-white px-6 text-center shadow-[0_8px_24px_rgba(49,59,48,0.04)]">
              <ShoppingBag size={44} className="mb-5 text-[#c8a45d]" />
              <h2 className="text-2xl font-semibold text-[#101010]">
                Your cart is empty
              </h2>
              <p className="mt-3 max-w-md text-sm">
                Browse our wellness equipment and add products here to review
                quantities, shipping benefits, and order totals.
              </p>
              <Link
                href="/products"
                className="mt-2 inline-flex py-2 items-center justify-center rounded-md bg-[#313b30] px-6 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#172015]"
              >
                <span className="text-white">
                  Browse Products
                </span>
              </Link>
            </section>
          )}

          <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold hover:text-[#8d6a3a]"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
            {hasItems && (
              <button
                type="button"
                onClick={clearCart}
                className="inline-flex items-center gap-2 text-sm font-semibold "
              >
                <Trash2 size={16} />
                Clear Cart
              </button>
            )}
          </div>

          <section className="mt-2">
            <h2 className="text-2xl font-semibold ">
              You May Also Like
            </h2>
            <div className="mt-2">
              <YouMightCarousel>

              {suggestions.map((product) => (
                <RecommendationCard key={product.id} product={product} />
              ))}
              </YouMightCarousel>
            </div>
          </section>

          <section className="mt-2 grid gap-3 rounded-lg border border-[#eee5d8] bg-white p-4 sm:grid-cols-4">
            {[
              [BadgeCheck, "Quality Checked", "Safe and effective"],
              [Leaf, "Clean Materials", "Built for wellness spaces"],
              [PackageCheck, "Secure Packing", "Protected dispatch"],
              [Gift, "Project Support", "Bulk order guidance"],
            ].map(([Icon, title, text]) => {
              const DisplayIcon = Icon as typeof BadgeCheck;
              return (
                <div
                  key={title as string}
                  className="flex items-center gap-3 border-[#eee5d8] sm:border-r sm:last:border-r-0"
                >
                  <DisplayIcon size={24} className="" />
                  <div>
                    <p className="text-xs font-semibold">
                      {title as string}
                    </p>
                    <p className="text-[11px] font-medium">
                      {text as string}
                    </p>
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

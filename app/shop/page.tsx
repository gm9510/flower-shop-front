"use client";

import { Suspense, startTransition, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Navigation from "@/components/navigation";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { ensureSessionToken, loadCartFromCookie } from "@/lib/session";
import { ViewType } from "@/types/shop";
import HeroSection from "@/components/shop/HeroSection";
import ProductsViewComponent from "@/components/shop/ProductsView";
import ProductDetailViewComponent from "@/components/shop/ProductDetailView";
import CartViewComponent from "@/components/shop/CartView";
import AboutViewComponent from "@/components/shop/AboutView";

// 👇 Toda tu lógica actual la metemos en este componente interno
function ShopPageInner() {
  const [currentView, setCurrentView] = useState<ViewType>("home");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const syncProductQuery = useCallback(
    (productId?: number) => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      if (productId) {
        params.set("product", productId.toString());
      } else {
        params.delete("product");
      }
      const query = params.toString();
      const url = query ? `${pathname}?${query}` : pathname;
      router.replace(url, { scroll: false });
    },
    [pathname, router]
  );

  const handleNavigate = useCallback(
    (view: string, productId?: number) => {
      const nextView = view as ViewType;
      setCurrentView(nextView);

      if (nextView === "detail" && productId) {
        setSelectedProductId(productId);
        syncProductQuery(productId);
      } else {
        setSelectedProductId(null);
        syncProductQuery(undefined);
      }
    },
    [syncProductQuery]
  );

  useEffect(() => {
    ensureSessionToken();
    if (typeof window !== "undefined") {
      const storedCart = loadCartFromCookie();
      if (storedCart.length) {
        useCart.setState({ items: storedCart });
      }
    }
  }, []);

  useEffect(() => {
    const productParam = searchParams.get("product");
    const parsedId = productParam ? Number(productParam) : null;

    if (parsedId && !Number.isNaN(parsedId)) {
      startTransition(() => {
        setCurrentView("detail");
        setSelectedProductId(parsedId);
      });
      return;
    }

    startTransition(() => {
      setSelectedProductId((prev) => (prev !== null ? null : prev));
      setCurrentView((prev) => (prev === "detail" ? "products" : prev));
    });
  }, [searchParams]);

  const handleAddToCart = (
    product: { id: number; name: string; price: number; image: string },
    quantity: number
  ) => {
    addToCart(product, quantity);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onNavigate={handleNavigate} />

      <main className="py-12">
        {currentView === "home" && <HeroSection onNavigate={handleNavigate} />}
        {currentView === "products" && (
          <ProductsViewComponent
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
          />
        )}
        {currentView === "detail" && selectedProductId && (
          <ProductDetailViewComponent
            productId={selectedProductId}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
          />
        )}
        {currentView === "cart" && <CartViewComponent onNavigate={handleNavigate} />}
        {currentView === "about" && <AboutViewComponent />}
      </main>
    </div>
  );
}

// 👇 Este es el default export que Next usa como page "/shop"
// Lo único que hace es envolver tu lógica en un <Suspense>
export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading shop…</div>}>
      <ShopPageInner />
    </Suspense>
  );
}

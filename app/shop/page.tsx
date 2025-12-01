"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"
import { ViewType } from "@/types/shop"
import HeroSection from "@/components/shop/HeroSection"
import ProductsViewComponent from "@/components/shop/ProductsView"
import ProductDetailViewComponent from "@/components/shop/ProductDetailView"
import CartViewComponent from "@/components/shop/CartView"
import AboutViewComponent from "@/components/shop/AboutView"

export default function ShopPage() {
  const [currentView, setCurrentView] = useState<ViewType>("home")
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleNavigate = (view: string, productId?: number) => {
    setCurrentView(view as ViewType)
    if (productId) {
      setSelectedProductId(productId)
    }
  }

  const handleAddToCart = (product: { id: number; name: string; price: number; image: string }, quantity: number) => {
    addToCart(product, quantity)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation onNavigate={handleNavigate} />

      <main className="py-12">
        {currentView === "home" && <HeroSection onNavigate={handleNavigate} />}
        {currentView === "products" && <ProductsViewComponent onNavigate={handleNavigate} onAddToCart={handleAddToCart} />}
        {currentView === "detail" && selectedProductId && (
          <ProductDetailViewComponent productId={selectedProductId} onNavigate={handleNavigate} onAddToCart={handleAddToCart} />
        )}
        {currentView === "cart" && <CartViewComponent onNavigate={handleNavigate} />}
        {currentView === "about" && <AboutViewComponent />}
      </main>
    </div>
  )
}


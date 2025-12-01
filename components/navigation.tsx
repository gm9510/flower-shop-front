"use client"

import { useState } from "react"
import { Heart, ShoppingCart, Menu, X } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"

interface NavigationProps {
  onNavigate?: (view: string) => void
}

export default function Navigation({ onNavigate }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { items } = useCart()

  const navItems = [
    { label: "Home", view: "home" },
    { label: "Shop", view: "products" },
    { label: "About", view: "about" },
  ]

  const handleNavClick = (view: string) => {
    if (onNavigate) {
      onNavigate(view)
      setMobileMenuOpen(false)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary fill-primary" />
          <span className="text-xl font-bold text-primary">Bloom & Petals</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => handleNavClick(item.view)}
              className="font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => handleNavClick("cart")}
            className="relative text-foreground hover:text-primary transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
          </button>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-foreground">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => handleNavClick(item.view)}
              className="block w-full text-left py-2 font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}

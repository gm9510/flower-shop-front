"use client"

import { useState } from "react"
import Link from "next/link"

interface ProductDetailProps {
  productId: number
  onAddToCart: (product: { id: number; name: string; price: number; image: string }, quantity: number) => void
  onBack: () => void
}

export default function ProductDetail({ productId, onAddToCart, onBack }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)

  const products = [
    {
      id: 1,
      name: "Romantic Rose Bouquet",
      price: 89.99,
      image: "/romantic-red-roses-bouquet.jpg",
      description: "A stunning arrangement of premium red roses perfect for expressing your deepest feelings.",
      features: ["12 Premium Red Roses", "Lush Greenery", "Free Delivery", "Handcrafted Design"],
    },
    {
      id: 2,
      name: "Sunflower Sunshine",
      price: 79.99,
      image: "/vibrant-sunflower-arrangement.jpg",
      description: "Bright and cheerful sunflowers to bring warmth and joy to any space.",
      features: ["10 Golden Sunflowers", "Premium Vase", "Free Delivery", "Long Lasting"],
    },
    {
      id: 3,
      name: "Wedding Elegance",
      price: 199.99,
      image: "/elegant-white-and-pink-wedding-flowers.jpg",
      description: "A sophisticated arrangement designed specifically for weddings and formal events.",
      features: ["Premium Florals", "Luxury Packaging", "Delivery & Setup", "Custom Design Available"],
    },
    {
      id: 4,
      name: "Sympathy White Lilies",
      price: 129.99,
      image: "/white-lilies-sympathy-arrangement.jpg",
      description: "Elegant white lilies expressing your condolences with grace and respect.",
      features: ["Premium White Lilies", "Sympathy Arrangement", "Free Delivery", "Respectful Design"],
    },
    {
      id: 5,
      name: "Birthday Rainbow Mix",
      price: 99.99,
      image: "/colorful-rainbow-mixed-flower-arrangement.jpg",
      description: "A vibrant mix of colorful flowers perfect for birthday celebrations.",
      features: ["Mixed Rainbow Flowers", "Festive Design", "Free Delivery", "Joy & Happiness"],
    },
    {
      id: 6,
      name: "Classic Tulips",
      price: 69.99,
      image: "/classic-pink-tulips-arrangement.jpg",
      description: "Beautiful pink tulips in a classic arrangement for timeless elegance.",
      features: ["Premium Pink Tulips", "Classic Design", "Free Delivery", "Fresh & Beautiful"],
    },
  ]

  const product = products.find((p) => p.id === productId)

  if (!product) return null

  return (
    <div className="max-w-6xl mx-auto px-4">
      <Link href="/shop" className="mb-6 text-primary hover:text-primary/80 inline-block">
        ← Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex items-center justify-center bg-secondary/10 rounded-lg p-8">
          <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-auto rounded-lg" />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">{product.name}</h1>
            <p className="text-2xl font-bold text-primary">${product.price}</p>
          </div>

          <p className="text-foreground/80">{product.description}</p>

          <div className="space-y-3">
            <h3 className="font-semibold text-primary">Features:</h3>
            <ul className="space-y-2">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-foreground/80">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4">
            <label className="font-semibold text-primary">Quantity:</label>
            <div className="flex items-center border border-border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-secondary/10"
              >
                −
              </button>
              <span className="px-4 py-2 font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-secondary/10">
                +
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              onAddToCart(product, quantity)
              setQuantity(1)
            }}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

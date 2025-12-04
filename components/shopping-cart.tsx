"use client"

import { useState } from "react"

export default function ShoppingCart({ isCheckout, onViewProduct, onAddToCart }: any) {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const products = [
    {
      id: 1,
      name: "Romantic Rose Bouquet",
      price: 89.99,
      image: "/romantic-red-roses-bouquet.jpg",
      category: "Weddings",
    },
    {
      id: 2,
      name: "Sunflower Sunshine",
      price: 79.99,
      image: "/vibrant-sunflower-arrangement.jpg",
      category: "Birthdays",
    },
    {
      id: 3,
      name: "Wedding Elegance",
      price: 199.99,
      image: "/elegant-white-and-pink-wedding-flowers.jpg",
      category: "Weddings",
    },
    {
      id: 4,
      name: "Sympathy White Lilies",
      price: 129.99,
      image: "/white-lilies-sympathy-arrangement.jpg",
      category: "Sympathy",
    },
    {
      id: 5,
      name: "Birthday Rainbow Mix",
      price: 99.99,
      image: "/colorful-rainbow-mixed-flower-arrangement.jpg",
      category: "Birthdays",
    },
    {
      id: 6,
      name: "Classic Tulips",
      price: 69.99,
      image: "/classic-pink-tulips-arrangement.jpg",
      category: "All",
    },
  ]

  const categories = ["All", "Weddings", "Birthdays", "Sympathy"]

  const filteredProducts =
    selectedCategory === "All" ? products : products.filter((p) => p.category === selectedCategory)

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-primary mb-8">Shop Our Collection</h1>

      {/* Category Filter */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/20 text-foreground hover:bg-secondary/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div
              onClick={() => onViewProduct(product.id)}
              className="relative overflow-hidden bg-secondary/10 aspect-square cursor-pointer group"
            >
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-4 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground text-lg mb-1">{product.name}</h3>
                <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
              </div>

              <button
                onClick={() => onAddToCart(product, 1)}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

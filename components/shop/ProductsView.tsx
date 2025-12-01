"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

const PRODUCTS = [
  {
    id: 1,
    name: "Ramo de Rosas Romántico",
    price: 89.99,
    image: "/romantic-red-roses-bouquet.jpg",
    category: "Bodas",
  },
  {
    id: 2,
    name: "Girasoles de Alegría",
    price: 79.99,
    image: "/vibrant-sunflower-arrangement.jpg",
    category: "Cumpleaños",
  },
  {
    id: 3,
    name: "Elegancia para Bodas",
    price: 199.99,
    image: "/elegant-white-and-pink-wedding-flowers.jpg",
    category: "Bodas",
  },
  {
    id: 4,
    name: "Azucenas Blancas de Condolencias",
    price: 129.99,
    image: "/white-lilies-sympathy-arrangement.jpg",
    category: "Condolencias",
  },
  {
    id: 5,
    name: "Arco Iris de Cumpleaños",
    price: 99.99,
    image: "/colorful-rainbow-mixed-flower-arrangement.jpg",
    category: "Cumpleaños",
  },
  {
    id: 6,
    name: "Tulipanes Clásicos",
    price: 69.99,
    image: "/classic-pink-tulips-arrangement.jpg",
    category: "Todos",
  },
]

const CATEGORIES = ["Todos", "Bodas", "Cumpleaños", "Condolencias"]

interface ProductsViewProps {
  onNavigate: (view: string, productId?: number) => void
  onAddToCart: (product: { id: number; name: string; price: number; image: string }, quantity: number) => void
}

export default function ProductsView({ onNavigate, onAddToCart }: ProductsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredProducts =
    selectedCategory === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === selectedCategory)

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-primary mb-8">Nuestra Colección</h1>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            variant={selectedCategory === cat ? "default" : "outline"}
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <button onClick={() => onNavigate("detail", product.id)} className="block w-full text-left">
              <div className="relative overflow-hidden bg-secondary/10 aspect-square group">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </button>

            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground text-lg mb-1">{product.name}</h3>
                <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                onClick={() => {
                  onAddToCart(product, 1)
                }}
                className="w-full"
              >
                Agregar al Carrito
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

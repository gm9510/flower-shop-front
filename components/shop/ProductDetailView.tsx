"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const PRODUCTS = [
  {
    id: 1,
    name: "Ramo de Rosas Romántico",
    price: 89.99,
    image: "/romantic-red-roses-bouquet.jpg",
    description: "Un hermoso arreglo de rosas premium perfectas para expresar tus sentimientos más profundos.",
    features: ["12 Rosas Rojas Premium", "Follaje Exuberante", "Envío Gratis", "Diseño Hecho a Mano"],
  },
  {
    id: 2,
    name: "Girasoles de Alegría",
    price: 79.99,
    image: "/vibrant-sunflower-arrangement.jpg",
    description: "Girasoles brillantes y alegres para traer calidez y felicidad a cualquier espacio.",
    features: ["10 Girasoles Dorados", "Jarrón Premium", "Envío Gratis", "Larga Duración"],
  },
  {
    id: 3,
    name: "Elegancia para Bodas",
    price: 199.99,
    image: "/elegant-white-and-pink-wedding-flowers.jpg",
    description: "Un arreglo sofisticado diseñado especialmente para bodas y eventos formales.",
    features: ["Flores Premium", "Embalaje Lujo", "Entrega e Instalación", "Diseño Personalizado Disponible"],
  },
  {
    id: 4,
    name: "Azucenas Blancas de Condolencias",
    price: 129.99,
    image: "/white-lilies-sympathy-arrangement.jpg",
    description: "Elegantes azucenas blancas expresando tus condolencias con gracia y respeto.",
    features: ["Azucenas Blancas Premium", "Arreglo de Condolencias", "Envío Gratis", "Diseño Respetuoso"],
  },
  {
    id: 5,
    name: "Arco Iris de Cumpleaños",
    price: 99.99,
    image: "/colorful-rainbow-mixed-flower-arrangement.jpg",
    description: "Una mezcla vibrante de flores coloridas perfectas para celebraciones de cumpleaños.",
    features: ["Flores Mixtas Arco Iris", "Diseño Festivo", "Envío Gratis", "Alegría y Felicidad"],
  },
  {
    id: 6,
    name: "Tulipanes Clásicos",
    price: 69.99,
    image: "/classic-pink-tulips-arrangement.jpg",
    description: "Hermosos tulipanes rosas en un arreglo clásico de elegancia atemporal.",
    features: ["Tulipanes Rosas Premium", "Diseño Clásico", "Envío Gratis", "Fresco y Hermoso"],
  },
]

interface ProductDetailViewProps {
  productId: number
  onNavigate: (view: string) => void
  onAddToCart: (product: { id: number; name: string; price: number; image: string }, quantity: number) => void
}

export default function ProductDetailView({ productId, onNavigate, onAddToCart }: ProductDetailViewProps) {
  const [quantity, setQuantity] = useState(1)

  const product = PRODUCTS.find((p) => p.id === productId)

  if (!product) return null

  return (
    <div className="max-w-6xl mx-auto px-4">
      <Button onClick={() => onNavigate("products")} variant="link" className="mb-6">
        ← Volver a la Tienda
      </Button>

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
            <h3 className="font-semibold text-primary">Características:</h3>
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
            <label className="font-semibold text-primary">Cantidad:</label>
            <div className="flex items-center border border-border rounded-lg">
              <Button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                variant="ghost"
                size="sm"
              >
                −
              </Button>
              <span className="px-4 py-2 font-semibold">{quantity}</span>
              <Button
                onClick={() => setQuantity(quantity + 1)}
                variant="ghost"
                size="sm"
              >
                +
              </Button>
            </div>
          </div>

          <Button
            onClick={() => {
              onAddToCart(product, quantity)
              setQuantity(1)
            }}
            className="w-full"
            size="lg"
          >
            Agregar al Carrito
          </Button>
        </div>
      </div>
    </div>
  )
}

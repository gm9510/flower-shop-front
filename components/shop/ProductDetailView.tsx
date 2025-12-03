"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { productService } from "@/services/api/products"
import type { Producto } from "@/types/shop"

interface ProductDetailViewProps {
  productId: number
  onNavigate: (view: string, productId?: number) => void
  onAddToCart: (product: { id: number; name: string; price: number; image: string }, quantity: number) => void
}

export default function ProductDetailView({ productId, onNavigate, onAddToCart }: ProductDetailViewProps) {
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<Producto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        const data = await productService.getProducto(productId)
        if (!isMounted) return
        setProduct(data)
        setError(null)
      } catch (err) {
        console.error("Error al cargar el producto", err)
        if (!isMounted) return
        setError("No pudimos cargar el producto. Intenta nuevamente.")
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchProduct()

    return () => {
      isMounted = false
    }
  }, [productId])

  const priceLabel = useMemo(() => {
    if (!product) return ""
    return new Intl.NumberFormat("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(
      product.precioVenta,
    )
  }, [product])

  const handleAddToCart = () => {
    if (!product) return
    onAddToCart(
      {
        id: product.id,
        name: product.nombre,
        price: product.precioVenta,
        image: product.imagenUrl || "/placeholder.svg",
      },
      quantity,
    )
    setQuantity(1)
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <Button onClick={() => onNavigate("products")} variant="link" className="mb-6">
        ← Volver a la Tienda
      </Button>

      {isLoading ? (
        <p className="text-muted-foreground">Cargando producto...</p>
      ) : error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-destructive">
          <p className="mb-4">{error}</p>
          <Button variant="secondary" onClick={() => onNavigate("products")}>Volver a la tienda</Button>
        </div>
      ) : !product ? (
        <p className="text-muted-foreground">No pudimos encontrar este producto.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex items-center justify-center bg-secondary/10 rounded-lg p-8">
            <div className="relative w-full max-w-md aspect-square">
              <Image
                src={product.imagenUrl || "/placeholder.svg"}
                alt={product.nombre}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">{product.nombre}</h1>
              <p className="text-2xl font-bold text-primary">${priceLabel}</p>
            </div>

            {product.descripcion && <p className="text-foreground/80 whitespace-pre-line">{product.descripcion}</p>}

            <div className="flex items-center gap-4">
              <label className="font-semibold text-primary">Cantidad:</label>
              <div className="flex items-center border border-border rounded-lg">
                <Button onClick={() => setQuantity(Math.max(1, quantity - 1))} variant="ghost" size="sm">
                  −
                </Button>
                <span className="px-4 py-2 font-semibold">{quantity}</span>
                <Button onClick={() => setQuantity(quantity + 1)} variant="ghost" size="sm">
                  +
                </Button>
              </div>
            </div>

            <Button onClick={handleAddToCart} className="w-full" size="lg">
              Agregar al Carrito
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import Image from "next/image"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { productService } from "@/services/api/products"
import type { Producto } from "@/types/shop"

interface ProductsViewProps {
  onNavigate: (view: string, productId?: number) => void
  onAddToCart: (product: { id: number; name: string; price: number; image: string }, quantity: number) => void
}

type ProductCardData = {
  id: number
  name: string
  price: number
  image: string
  category: string
  raw: Producto
}

export default function ProductsView({ onNavigate, onAddToCart }: ProductsViewProps) {
  const [productos, setProductos] = useState<Producto[]>([])
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMountedRef = useRef(false)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const fetchProductos = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await productService.getProductos({ estado: "AC", limit: 50 })
      console.log("Fetched Products:", data)
      console.log("Is Mounted Ref:", isMountedRef.current)
      if (!isMountedRef.current) return
      setProductos(data)
      setError(null)
    } catch (err) {
      console.error("Error al cargar productos", err)
      if (!isMountedRef.current) return
      setError("No pudimos cargar los productos. Intenta nuevamente.")
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    fetchProductos()
  }, [fetchProductos])

  const categories = useMemo(() => {
    const dynamic = new Set<string>()
    productos.forEach((producto) => {
      if (producto.categoria) {
        dynamic.add(producto.categoria)
      }
    })
    const unique = Array.from(dynamic).filter((cat) => cat !== "Todos")
    return ["Todos", ...unique]
  }, [productos])

  const normalizedProducts = useMemo<ProductCardData[]>(() => {
    return productos.map((producto) => ({
      id: producto.id,
      name: producto.nombre,
      price: producto.precioVenta,
      image: producto.imagenUrl || "/placeholder.svg",
      category: producto.categoria || "Todos",
      raw: producto,
    }))
  }, [productos])

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "Todos") {
      return normalizedProducts
    }
    return normalizedProducts.filter((producto) => producto.category === selectedCategory)
  }, [normalizedProducts, selectedCategory])


  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-4xl font-bold text-primary">Nuestra Colección</h1>
        {!isLoading && (
          <Button variant="ghost" onClick={fetchProductos} disabled={isLoading}>
            Actualizar
          </Button>
        )}
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            variant={selectedCategory === cat ? "default" : "outline"}
          >
            {cat}
          </Button>
        ))}
      </div>
      {isLoading ? (
        <p className="text-muted-foreground">Cargando productos...</p>
      ) : error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
          <p className="mb-4">{error}</p>
          <Button onClick={fetchProductos}>Intentar de nuevo</Button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <p className="text-muted-foreground">No encontramos productos para esta categoría.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <button onClick={() => onNavigate("detail", product.id)} className="block w-full text-left">
                <div className="relative overflow-hidden bg-secondary/10 aspect-square group">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </button>

              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground text-lg mb-1">{product.name}</h3>
                  <p className="text-xl font-bold text-primary">
                    ${new Intl.NumberFormat("es-CO", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(product.price)}
                  </p>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => {
                    onAddToCart(
                      {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                      },
                      1,
                    )
                  }}
                  className="w-full"
                >
                  Agregar al Carrito
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
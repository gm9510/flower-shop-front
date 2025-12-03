"use client"

import Image from "next/image"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { productService } from "@/services/api/products"
import type { Producto } from "@/types/shop"

interface HeroSectionProps {
  onNavigate: (view: string, productId?: number) => void
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  const [productos, setProductos] = useState<Producto[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    let isMounted = true

    const fetchHeroProducts = async () => {
      try {
        const data = await productService.getProductos({ estado: "AC", limit: 50 })
        if (!isMounted || data.length === 0) return
        const candidates = data.filter((producto) => Boolean(producto.imagenUrl))
        const pool = candidates.length > 0 ? candidates : data
        setProductos(pool)
        const randomIndex = Math.floor(Math.random() * pool.length)
        setCurrentIndex(randomIndex)
      } catch (error) {
        console.error("No pudimos cargar la imagen destacada", error)
      }
    }

    fetchHeroProducts()

    return () => {
      isMounted = false
    }
  }, [])

  const heroProduct = useMemo(() => {
    return productos[currentIndex] ?? null
  }, [productos, currentIndex])

  const heroImage = heroProduct?.imagenUrl || "https://imgur.com/XJlUcZM.jpg"

  const heroAlt = heroProduct?.nombre || "Hermoso arreglo floral"

  const handleNavigateToProduct = useCallback(() => {
    if (heroProduct) {
      onNavigate("detail", heroProduct.id)
    } else {
      onNavigate("products")
    }
  }, [heroProduct, onNavigate])

  const showPrev = useCallback(() => {
    setCurrentIndex((prev) => {
      if (productos.length === 0) return prev
      return prev === 0 ? productos.length - 1 : prev - 1
    })
  }, [productos.length])

  const showNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (productos.length === 0) return prev
      return prev === productos.length - 1 ? 0 : prev + 1
    })
  }, [productos.length])

  return (
    <section className="relative py-20 bg-linear-to-br from-secondary/20 to-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-12">
        <div className="flex-1 space-y-6 max-w-5xl">
          <h1 className="text-5xl md:text-5xl font-bold text-primary leading-tight text-balance">
            Celebra los momentos hermosos de la vida
          </h1>

          <p className="text-lg text-foreground/70 max-w-lg text-pretty">
            Arreglos florales hechos a mano entregados con cuidado. Perfectos para cualquier ocasión, creados por nuestros
            floristas expertos usando las flores más frescas.
          </p>

          <div className="flex gap-4 pt-4">
            <Button onClick={() => onNavigate("products")} size="lg">
              Comprar Ahora
            </Button>
            <Button onClick={() => onNavigate("about")} variant="outline" size="lg">
              Más Información
            </Button>
          </div>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="relative w-80 h-80">
            <button
              type="button"
              onClick={handleNavigateToProduct}
              className="absolute inset-0"
              aria-label="Ver detalle del producto destacado"
            >
              <Image
                src={heroImage}
                alt={heroAlt}
                fill
                sizes="320px"
                className="object-cover rounded-2xl shadow-2xl"
              />
            </button>

            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={showPrev}
                disabled={productos.length <= 1}
                aria-label="Ver producto anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={showNext}
                disabled={productos.length <= 1}
                aria-label="Ver siguiente producto"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

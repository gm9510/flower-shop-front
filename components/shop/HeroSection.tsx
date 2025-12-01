import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  onNavigate: (view: string) => void
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section className="relative py-20 bg-gradient-to-br from-secondary/20 to-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-12">
        <div className="flex-1 space-y-6 max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-bold text-primary leading-tight text-balance">
            Celebra los Momentos Hermosos de la Vida
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
            <img
              src="/beautiful-fresh-flower-arrangement-bouquet.jpg"
              alt="Beautiful floral arrangement"
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

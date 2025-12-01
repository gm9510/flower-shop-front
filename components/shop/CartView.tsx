"use client"

import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface CartViewProps {
  onNavigate: (view: string) => void
}

export default function CartView({ onNavigate }: CartViewProps) {
  const { items, removeFromCart, updateQuantity } = useCart()

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.19
  const total = subtotal + tax + 10000 // Fixed shipping cost

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-primary mb-8">Carrito de Compras</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-foreground/60 mb-4">Tu carrito está vacío</p>
          <Button onClick={() => onNavigate("products")} variant="link">
            Continuar Comprando
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="flex gap-4">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />

                <CardContent className="flex-1">
                  <h3 className="font-semibold text-primary mb-1">{item.name}</h3>
                  <p className="text-foreground/60">${item.price.toFixed(2)}</p>
                </CardContent>

                <CardFooter className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg">
                    <Button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      variant="ghost"
                      size="sm"
                    >
                      −
                    </Button>
                    <span className="px-3 py-1 font-semibold">{item.quantity}</span>
                    <Button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      variant="ghost"
                      size="sm"
                    >
                      +
                    </Button>
                  </div>

                  <Button
                    onClick={() => removeFromCart(item.id)}
                    variant="destructive"
                  >
                    Eliminar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="space-y-4">
              <h3 className="font-semibold text-primary">Resumen de Pedido</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA (19%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>$10,000</span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button className="w-full" size="lg">
                Proceder al Pago
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}

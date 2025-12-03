"use client"

import Image from "next/image"
import type { ChangeEvent, FormEvent } from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"
import { clientService } from "@/services/api/clients"
import { shippingService } from "@/services/api/shipping"
import { couponService } from "@/services/api/coupons"
import { orderService } from "@/services/api/orders"
import { orderItemService } from "@/services/api/order-items"
import { orderPaymentService } from "@/services/api/order-payments"
import { createMercadoPagoPreference } from "@/services/api/mercadopago"
import type { MetodoEnvio, Cupon, ClienteCreate } from "@/types/shop"
import { EstadoPago, EstadoPedido } from "@/types/shop"
import { getClientIdFromCookie, saveClientIdToCookie } from "@/lib/session"

type MetodoEnvioWithEstimate = MetodoEnvio & {
  tiempoEstimadoEntrega?: number | null
}

type LegacyClientePayload = {
  nit: string
  dv: number
  nombre: string
  telefono: string
  correo: string
  direccion: string
  estado: boolean
}

interface CartViewProps {
  onNavigate: (view: string) => void
}

export default function CartView({ onNavigate }: CartViewProps) {
  const { toast } = useToast()
  const { items, removeFromCart, updateQuantity, clearCart } = useCart()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isReadyToPay, setIsReadyToPay] = useState(false)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [clientId, setClientId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    documento: "",
    numeroValidacion: "",
    nombre: "",
    telefono: "",
    correo: "",
    direccion: "",
  })

  const [metodosEnvio, setMetodosEnvio] = useState<MetodoEnvio[]>([])
  const [isLoadingShipping, setIsLoadingShipping] = useState(true)
  const [shippingError, setShippingError] = useState<string | null>(null)
  const [selectedMetodoId, setSelectedMetodoId] = useState<number | null>(null)

  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<Cupon | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  useEffect(() => {
    const storedId = getClientIdFromCookie()
    if (storedId) {
      setClientId(storedId)
    }
  }, [])

  useEffect(() => {
    if (isFormOpen) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [isFormOpen])

  useEffect(() => {
    if (isReadyToPay) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [isReadyToPay])

  useEffect(() => {
    let isMounted = true
    const fetchMetodosEnvio = async () => {
      setIsLoadingShipping(true)
      try {
        const data = await shippingService.getMetodosEnvio({ limit: 20 })
        if (!isMounted) return
        setMetodosEnvio(data)
        if (data.length > 0) {
          setSelectedMetodoId(data[0].id)
        }
        setShippingError(null)
      } catch (error) {
        console.error("No pudimos cargar los métodos de envío", error)
        if (!isMounted) return
        setShippingError("No pudimos cargar los métodos de envío. Intenta nuevamente.")
      } finally {
        if (isMounted) {
          setIsLoadingShipping(false)
        }
      }
    }

    fetchMetodosEnvio()

    return () => {
      isMounted = false
    }
  }, [])

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items])
  const selectedMetodo = metodosEnvio.find((metodo) => metodo.id === selectedMetodoId) || null
  const shipping = selectedMetodo?.costo ?? 0

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0
    if (appliedCoupon.tipoDescuento === "monto_fijo") {
      return Math.min(appliedCoupon.valorDescuento, subtotal)
    }
    return subtotal * (appliedCoupon.valorDescuento / 100)
  }, [appliedCoupon, subtotal])

  const total = Math.max(subtotal - discountAmount, 0) + shipping

  const estimatedDelivery = useMemo(() => {
    if (!selectedMetodo) return null
    const metodoConEstimado = selectedMetodo as MetodoEnvioWithEstimate
    const rawDays =
      typeof metodoConEstimado.tiempoEstimadoEntrega === "number"
        ? metodoConEstimado.tiempoEstimadoEntrega
        : metodoConEstimado.tiempoEstimado
        ? parseInt(metodoConEstimado.tiempoEstimado, 10)
        : null
    const days = typeof rawDays === "number" && !Number.isNaN(rawDays) ? Math.max(rawDays, 0) : 0
    const targetDate = new Date()
    if (days > 0) {
      targetDate.setDate(targetDate.getDate() + days)
    }
    const formattedDate = new Intl.DateTimeFormat("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(targetDate)
    return {
      days,
      formattedDate,
      isoDate: targetDate.toISOString(),
    }
  }, [selectedMetodo])

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)
  }, [])

  const handleCreateOrder = async () => {
    if (!clientId) {
      setOrderError("Necesitamos tus datos antes de continuar.")
      setIsFormOpen(true)
      return
    }

    if (!selectedMetodoId) {
      setOrderError("Selecciona un método de envío para continuar.")
      return
    }

    if (items.length === 0) {
      setOrderError("Tu carrito está vacío. Agrega productos antes de continuar.")
      return
    }

    setIsCreatingOrder(true)
    setOrderError(null)
    try {
      const shortInvoice = Math.floor(1000 + Math.random() * 9000)
      const payload = {
        numeroFactura: shortInvoice,
        idEntidad: clientId,
        subTotal: subtotal,
        descuento: discountAmount > 0 ? discountAmount : undefined,
        montoTotal: total,
        estadoPedido: EstadoPedido.PENDIENTE,
        estadoPago: EstadoPago.PENDIENTE,
        metodoPago: "PASARELA",
        direccionEnvio: formData.direccion,
        fechaEntrega: estimatedDelivery?.isoDate ?? new Date().toISOString(),
        idCupon: appliedCoupon?.id,
        idEnvio: selectedMetodoId
      }

      const order = await orderService.createPedido(payload)

      await Promise.all(
        items.map((item) =>
          orderItemService.createPedidoDetalle({
            idPedido: order.id,
            idProducto: Number(item.id),
            cantidad: item.quantity,
            precioUnitario: item.price,
          }),
        ),
      )

      const preferenceItems = [
        ...items.map((item) => ({
          title: item.name,
          unit_price: item.price,
          quantity: item.quantity,
          currency_id: "COP",
        })),
        {
          title: `Envío - ${selectedMetodo?.nombre ?? "Método de envío"}`,
          unit_price: shipping,
          quantity: 1,
          currency_id: "COP",
        },
      ]

      const preference = await createMercadoPagoPreference({
        items: preferenceItems,
        payer: {
          email: formData.correo || "compras@example.com",
        },
        auto_return: "approved",
      })

      await orderPaymentService.createPedidoPago({
        idPedido: order.id,
        monto: total,
        fechaPago: new Date().toISOString(),
        metodoPago: "transferencia",
        pasarelaPagoId: preference.id,
      })

      setCreatedOrderId(order.id)
      toast({
        title: "Pedido listo",
        description: "Te estamos redirigiendo a Mercado Pago para completar tu compra.",
      })

      clearCart()
      window.location.href = preference.init_point
    } catch (error) {
      console.error("No pudimos crear el pedido", error)
      setOrderError("No pudimos crear el pedido ni el link de pago. Intenta nuevamente.")
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectMetodo = (metodoId: number) => {
    setSelectedMetodoId(metodoId)
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Ingresa un código de cupón válido.")
      return
    }

    setIsApplyingCoupon(true)
    try {
      const coupon = await couponService.validateCupon(couponCode.trim())
      if (!coupon) {
        setCouponError("El cupón no es válido o ya expiró.")
        setAppliedCoupon(null)
        return
      }
      setAppliedCoupon(coupon)
      setCouponError(null)
      toast({ title: "Cupón aplicado", description: `Aplicamos el cupón ${coupon.codigo}.` })
    } catch (error) {
      console.error("No pudimos validar el cupón", error)
      setCouponError("Ocurrió un error al validar el cupón.")
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
    setCouponError(null)
  }

  const validateForm = () => {
    for (const value of Object.values(formData)) {
      if (!value.trim()) {
        setFormError("Por favor completa todos los campos requeridos.")
        return false
      }
    }

    if (Number.isNaN(Number(formData.numeroValidacion))) {
      setFormError("El número de validación debe ser numérico.")
      return false
    }

    setFormError(null)
    return true
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const payload: LegacyClientePayload = {
        nit: formData.documento,
        dv: Number(formData.numeroValidacion),
        nombre: formData.nombre,
        telefono: formData.telefono,
        correo: formData.correo,
        direccion: formData.direccion,
        estado: true,
      }

      const apiPayload = payload as unknown as ClienteCreate
      let persistedId = clientId
      if (clientId) {
        await clientService.updateCliente(clientId, apiPayload)
      } else {
        const created = await clientService.createCliente(apiPayload)
        persistedId = created.id
      }

      if (persistedId) {
        saveClientIdToCookie(persistedId)
        setClientId(persistedId)
      }

      setIsFormOpen(false)
      setIsReadyToPay(true)
      setOrderError(null)
      setCreatedOrderId(null)
      toast({ title: "Datos guardados", description: "Tu información se registró correctamente." })
    } catch (error) {
      console.error("No pudimos guardar los datos del cliente", error)
      setFormError("Ocurrió un error al guardar tus datos. Intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderCartItems = () => (
    <div className="md:col-span-2 space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="flex gap-4">
          <div className="relative w-20 h-20">
            <Image src={item.image || "/placeholder.svg"} alt={item.name} fill sizes="80px" className="rounded object-cover" />
          </div>

          <CardContent className="flex-1">
            <h3 className="font-semibold text-primary mb-1">{item.name}</h3>
            <p className="text-foreground/60">${formatCurrency(item.price)}</p>
          </CardContent>

          <CardFooter className="flex items-center gap-4">
            <div className="flex items-center border border-border rounded-lg">
              <Button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} variant="ghost" size="sm">
                −
              </Button>
              <span className="px-3 py-1 font-semibold">{item.quantity}</span>
              <Button onClick={() => updateQuantity(item.id, item.quantity + 1)} variant="ghost" size="sm">
                +
              </Button>
            </div>

            <Button onClick={() => removeFromCart(item.id)} variant="destructive">
              Eliminar
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )

  const renderSummaryCard = (showActions: boolean) => (
    <Card>
      <CardContent className="space-y-5">
        <h3 className="font-semibold text-primary">Resumen de Pedido</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Método de Envío</p>
            {isLoadingShipping && <span className="text-xs text-muted-foreground">Cargando...</span>}
          </div>
          {shippingError ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {shippingError}
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {metodosEnvio.map((metodo) => (
                <label
                  key={metodo.id}
                  className={`flex items-center justify-between rounded-lg border p-3 text-sm cursor-pointer transition-colors ${
                    selectedMetodoId === metodo.id ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div>
                    <p className="font-medium">{metodo.nombre}</p>
                    {metodo.descripcion && <p className="text-xs text-muted-foreground">{metodo.descripcion}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">${formatCurrency(metodo.costo)}</span>
                    <input type="radio" className="h-4 w-4" checked={selectedMetodoId === metodo.id} onChange={() => handleSelectMetodo(metodo.id)} />
                  </div>
                </label>
              ))}
              {!isLoadingShipping && metodosEnvio.length === 0 && <p className="text-sm text-muted-foreground">No hay métodos de envío configurados.</p>}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="coupon">Cupón de descuento</Label>
          <div className="flex gap-2">
            <Input
              id="coupon"
              placeholder="Ingresa tu código"
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value)}
              disabled={isApplyingCoupon || Boolean(appliedCoupon)}
            />
            {appliedCoupon ? (
              <Button type="button" variant="secondary" onClick={handleRemoveCoupon}>
                Quitar
              </Button>
            ) : (
              <Button type="button" onClick={handleApplyCoupon} disabled={isApplyingCoupon}>
                {isApplyingCoupon ? "Validando..." : "Aplicar"}
              </Button>
            )}
          </div>
          {couponError && <p className="text-sm text-destructive">{couponError}</p>}
          {appliedCoupon && (
            <p className="text-xs text-muted-foreground">
              Cupón {appliedCoupon.codigo} aplicado ({appliedCoupon.tipoDescuento === "monto_fijo" ? "Monto fijo" : "Porcentaje"}).
            </p>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Envío</span>
            <span>${formatCurrency(shipping)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Descuento</span>
              <span>- ${formatCurrency(discountAmount)}</span>
            </div>
          )}
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${formatCurrency(total)}</span>
          </div>
        </div>

        {clientId && !isFormOpen && (
          <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-sm text-primary">
            Ya tenemos tus datos guardados. Puedes actualizarlos si lo necesitas.
          </div>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full"
            size="lg"
            onClick={() => {
              setIsReadyToPay(false)
              setIsFormOpen(true)
              setCreatedOrderId(null)
              setOrderError(null)
            }}
          >
            Finalizar Compra
          </Button>
        </CardFooter>
      )}
    </Card>
  )

  const renderCheckoutFormCard = () => (
    <Card>
      <CardHeader>
        <CardTitle>Datos para la entrega</CardTitle>
        <CardDescription>Usaremos esta información para crear tu pedido.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="checkout-form" className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="documento">Documento</Label>
              <Input id="documento" name="documento" value={formData.documento} onChange={handleInputChange} required autoComplete="off" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numeroValidacion">Número de validación</Label>
              <Input
                id="numeroValidacion"
                name="numeroValidacion"
                type="number"
                inputMode="numeric"
                value={formData.numeroValidacion}
                onChange={handleInputChange}
                required
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required autoComplete="name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleInputChange} required autoComplete="tel" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="correo">Correo electrónico</Label>
              <Input
                id="correo"
                name="correo"
                type="email"
                value={formData.correo}
                onChange={handleInputChange}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input id="direccion" name="direccion" value={formData.direccion} onChange={handleInputChange} required autoComplete="street-address" />
            </div>
          </div>

          {formError && <p className="text-sm text-destructive">{formError}</p>}
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button type="submit" form="checkout-form" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar y Continuar"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => {
            setIsFormOpen(false)
            setIsReadyToPay(false)
            setCreatedOrderId(null)
            setOrderError(null)
          }}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
      </CardFooter>
    </Card>
  )

  const renderFinalSummaryCard = () => (
    <Card>
      <CardHeader>
        <CardTitle>Resumen del Pedido</CardTitle>
        <CardDescription>Verifica la información antes de continuar con el pago.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Método de envío</p>
          <p className="font-medium">{selectedMetodo ? selectedMetodo.nombre : "Sin seleccionar"}</p>
          {selectedMetodo?.descripcion && <p className="text-sm text-muted-foreground">{selectedMetodo.descripcion}</p>}
        </div>
        {estimatedDelivery && (
          <div className="rounded-md border border-dashed border-border/60 p-3 text-left">
            <p className="text-sm text-muted-foreground">Tiempo estimado de entrega</p>
            <p className="font-semibold text-primary">
              {estimatedDelivery.formattedDate} (≈ {estimatedDelivery.days} {estimatedDelivery.days === 1 ? "día" : "días"})
            </p>
          </div>
        )}
        {appliedCoupon && (
          <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-sm">
            <p className="font-medium text-primary">Cupón {appliedCoupon.codigo}</p>
            <p className="text-muted-foreground">
              Aplicado ({appliedCoupon.tipoDescuento === "monto_fijo" ? "Monto fijo" : "Porcentaje"}).
            </p>
          </div>
        )}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Envío</span>
            <span>${formatCurrency(shipping)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Descuento</span>
              <span>- ${formatCurrency(discountAmount)}</span>
            </div>
          )}
        </div>
        <div className="border-t border-border pt-4">
          <div className="flex justify-between font-bold text-xl">
            <span>Total</span>
            <span>${formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

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
      ) : isReadyToPay ? (
        <div className="space-y-8 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-primary">¡Datos guardados!</h2>
              <p className="text-muted-foreground">Revisa tu resumen y continúa para completar el pago.</p>
            </div>

            {renderFinalSummaryCard()}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="sm:w-auto w-full"
                onClick={handleCreateOrder}
                disabled={isCreatingOrder || Boolean(createdOrderId)}
              >
                {isCreatingOrder ? "Guardando pedido..." : "Ir a Pagar"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="sm:w-auto w-full"
                onClick={() => {
                  setIsReadyToPay(false)
                  setCreatedOrderId(null)
                  setOrderError(null)
                }}
              >
                Editar carrito
              </Button>
            </div>
            {orderError && <p className="text-sm text-destructive">{orderError}</p>}
            {createdOrderId && (
              <p className="text-sm text-muted-foreground">
                Pedido #{createdOrderId} guardado. Te llevaremos al pago en el siguiente paso.
              </p>
            )}
          </div>
        </div>
      ) : isFormOpen ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setIsFormOpen(false)}>
              ← Volver al carrito
            </Button>
            <p className="text-sm text-muted-foreground hidden sm:block">Revisa tu resumen a la derecha antes de enviar.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {renderCheckoutFormCard()}
            {renderSummaryCard(false)}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid md:grid-cols-3 gap-8">
            {renderCartItems()}
            {renderSummaryCard(true)}
          </div>
        </div>
      )}
    </div>
  )
}

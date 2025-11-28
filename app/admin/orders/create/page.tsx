'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Save, User, CreditCard, Truck, Tag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { orderService } from '@/services/api/orders';
import { clientService } from '@/services/api/clients';
import { couponService } from '@/services/api/coupons';
import { shippingService } from '@/services/api/shipping';
import type { PedidosCreate, Cliente, Cupon, MetodoEnvio } from '@/types/shop';

// Form validation schema
const orderSchema = z.object({
  clienteId: z.number().min(1, 'Debe seleccionar un cliente'),
  montoTotal: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  estadoPedido: z
    .enum(['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'])
    .optional(),
  estadoPago: z.enum(['pendiente', 'pagado', 'fallido', 'reembolsado']).optional(),
  metodoPago: z.string().optional(),
  direccionEnvio: z.string().optional(),
  cuponId: z.number().optional(),
  metodoEnvioId: z.number().optional(),
  fechaEnvio: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

export default function CreateOrderPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<Cliente[]>([]);
  const [coupons, setCoupons] = useState<Cupon[]>([]);
  const [shippingMethods, setShippingMethods] = useState<MetodoEnvio[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      estadoPedido: 'pendiente',
      estadoPago: 'pendiente',
      metodoPago: '',
      direccionEnvio: '',
    },
  });

  const selectedClientId = watch('clienteId');
  const selectedCouponId = watch('cuponId');
  const selectedShippingId = watch('metodoEnvioId');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoadingData(true);
      const [clientsData, couponsData, shippingData] = await Promise.all([
        clientService.getClientes(),
        couponService.getCupones(),
        shippingService.getMetodosEnvio(),
      ]);

      setClients(clientsData);
      setCoupons(couponsData);
      setShippingMethods(shippingData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error al cargar los datos necesarios');
    } finally {
      setIsLoadingData(false);
    }
  };

  const onSubmit = async (data: OrderFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const orderData: PedidosCreate = {
        clienteId: data.clienteId,
        montoTotal: data.montoTotal,
        estadoPedido: data.estadoPedido || 'pendiente',
        estadoPago: data.estadoPago || 'pendiente',
        metodoPago: data.metodoPago || undefined,
        direccionEnvio: data.direccionEnvio || undefined,
        cuponId: data.cuponId || undefined,
        metodoEnvioId: data.metodoEnvioId || undefined,
        fechaEnvio: data.fechaEnvio || undefined,
      };

      const newOrder = await orderService.createPedido(orderData);
      router.push(`/admin/orders`);
    } catch (error: any) {
      console.error('Error creating order:', error);
      setError('Error al crear el pedido. Por favor intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/orders');
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <div className="text-lg">Cargando datos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Crear Nuevo Pedido</h1>
            <p className="text-muted-foreground mt-1">
              Complete la información necesaria para crear un nuevo pedido
            </p>
          </div>
        </div>
        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Creando...' : 'Crear Pedido'}
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-4">
            <p className="text-red-600 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="clienteId">Cliente *</Label>
                  <Select
                    value={selectedClientId?.toString()}
                    onValueChange={(value) => setValue('clienteId', Number(value))}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="clienteId">
                      <SelectValue placeholder="Seleccione un cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id.toString()}>
                          {client.nombre} - {client.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.clienteId && (
                    <p className="text-sm text-red-500 mt-1">{errors.clienteId.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="direccionEnvio">Dirección de Envío</Label>
                  <Textarea
                    id="direccionEnvio"
                    {...register('direccionEnvio')}
                    placeholder="Dirección completa de envío..."
                    rows={2}
                    disabled={isSubmitting}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Detalles del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="montoTotal">Monto Total *</Label>
                    <Input
                      id="montoTotal"
                      type="number"
                      step="0.01"
                      min="0"
                      {...register('montoTotal', { valueAsNumber: true })}
                      placeholder="0.00"
                      disabled={isSubmitting}
                    />
                    {errors.montoTotal && (
                      <p className="text-sm text-red-500 mt-1">{errors.montoTotal.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="metodoPago">Método de Pago</Label>
                    <Select
                      value={watch('metodoPago')}
                      onValueChange={(value) => setValue('metodoPago', value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="metodoPago">
                        <SelectValue placeholder="Seleccione método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="efectivo">Efectivo</SelectItem>
                        <SelectItem value="tarjeta">Tarjeta</SelectItem>
                        <SelectItem value="transferencia">Transferencia</SelectItem>
                        <SelectItem value="pse">PSE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="estadoPedido">Estado del Pedido</Label>
                    <Select
                      value={watch('estadoPedido')}
                      onValueChange={(value) => setValue('estadoPedido', value as any)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="estadoPedido">
                        <SelectValue placeholder="Seleccione estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="procesando">Procesando</SelectItem>
                        <SelectItem value="enviado">Enviado</SelectItem>
                        <SelectItem value="entregado">Entregado</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="estadoPago">Estado de Pago</Label>
                    <Select
                      value={watch('estadoPago')}
                      onValueChange={(value) => setValue('estadoPago', value as any)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="estadoPago">
                        <SelectValue placeholder="Seleccione estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="pagado">Pagado</SelectItem>
                        <SelectItem value="fallido">Fallido</SelectItem>
                        <SelectItem value="reembolsado">Reembolsado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Información de Envío
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="metodoEnvioId">Método de Envío</Label>
                    <Select
                      value={selectedShippingId?.toString()}
                      onValueChange={(value) => setValue('metodoEnvioId', Number(value))}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="metodoEnvioId">
                        <SelectValue placeholder="Seleccione método" />
                      </SelectTrigger>
                      <SelectContent>
                        {shippingMethods.map((method) => (
                          <SelectItem key={method.id} value={method.id.toString()}>
                            {method.nombre} - ${method.costo.toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="fechaEnvio">Fecha de Envío</Label>
                    <Input
                      id="fechaEnvio"
                      type="date"
                      {...register('fechaEnvio')}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coupon Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Cupón de Descuento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="cuponId">Cupón (Opcional)</Label>
                  <Select
                    value={selectedCouponId?.toString()}
                    onValueChange={(value) => setValue('cuponId', Number(value))}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="cuponId">
                      <SelectValue placeholder="Sin cupón" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sin cupón</SelectItem>
                      {coupons.map((coupon) => (
                        <SelectItem key={coupon.id} value={coupon.id.toString()}>
                          {coupon.codigo} - {coupon.valorDescuento}
                          {coupon.tipoDescuento === 'porcentaje' ? '%' : ' COP'} descuento
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado del pedido:</span>
                  <span className="font-medium capitalize">{watch('estadoPedido')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado de pago:</span>
                  <span className="font-medium capitalize">{watch('estadoPago')}</span>
                </div>
                {watch('metodoPago') && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Método de pago:</span>
                    <span className="font-medium capitalize">{watch('metodoPago')}</span>
                  </div>
                )}
                {watch('montoTotal') > 0 && (
                  <div className="flex justify-between pt-3 border-t">
                    <span className="font-medium">Monto total:</span>
                    <span className="font-bold text-lg">
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0,
                      }).format(watch('montoTotal') || 0)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle>Información</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Los campos con * son obligatorios</p>
                <p>• Selecciona un cliente existente</p>
                <p>• El estado predeterminado es "Pendiente"</p>
                <p>• Puedes agregar un cupón de descuento opcional</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

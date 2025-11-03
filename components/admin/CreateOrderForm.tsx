'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, CreditCard, Truck, Tag } from "lucide-react";
import { orderService } from '@/services/api/orders';
import { clientService } from '@/services/api/clients';
import { couponService } from '@/services/api/coupons';
import { shippingService } from '@/services/api/shipping';
import type { PedidosCreate, Cliente, Cupon, MetodoEnvio } from '@/types/shop';

// Form validation schema
const orderSchema = z.object({
  clienteId: z.number().min(1, 'Debe seleccionar un cliente'),
  montoTotal: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  estadoPedido: z.enum(['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado']).optional(),
  estadoPago: z.enum(['pendiente', 'pagado', 'fallido', 'reembolsado']).optional(),
  metodoPago: z.string().optional(),
  direccionEnvio: z.string().optional(),
  cuponId: z.number().optional(),
  metodoEnvioId: z.number().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface CreateOrderFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateOrderForm({ onSuccess, onCancel }: CreateOrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<Cliente[]>([]);
  const [coupons, setCoupons] = useState<Cupon[]>([]);
  const [shippingMethods, setShippingMethods] = useState<MetodoEnvio[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

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
    },
  });

  // Load form data on component mount
  useEffect(() => {
    const loadFormData = async () => {
      try {
        // Fetch data from APIs
        const [clientsData, couponsData, shippingData] = await Promise.all([
          clientService.getClientes({ limit: 100 }), // Get first 100 clients
          couponService.getActiveCupones(), // Get only active coupons
          shippingService.getMetodosEnvio(), // Get all shipping methods
        ]);

        setClients(clientsData);
        setCoupons(couponsData);
        setShippingMethods(shippingData);
      } catch (error) {
        console.error('Error loading form data:', error);
        // Fallback to mock data if API fails
        setClients([
          { id: 1, nombre: 'Juan', apellido: 'Pérez', email: 'juan@example.com', telefono: '3001234567', creadoEn: new Date().toISOString() },
          { id: 2, nombre: 'María', apellido: 'García', email: 'maria@example.com', telefono: '3019876543', creadoEn: new Date().toISOString() },
        ]);

        setCoupons([
          { id: 1, codigo: 'DESC10', tipoDescuento: 'porcentaje', valorDescuento: 10, fechaInicio: '2024-01-01', fechaVencimiento: '2024-12-31', activo: true, creadoEn: new Date().toISOString() },
          { id: 2, codigo: 'ENVIOGRATIS', tipoDescuento: 'fijo', valorDescuento: 15000, fechaInicio: '2024-01-01', fechaVencimiento: '2024-12-31', activo: true, creadoEn: new Date().toISOString() },
        ]);

        setShippingMethods([
          { id: 1, nombre: 'Envío Estándar', costo: 10000, tiempoEstimado: '3-5 días hábiles' },
          { id: 2, nombre: 'Envío Express', costo: 20000, tiempoEstimado: '1-2 días hábiles' },
          { id: 3, nombre: 'Recogida en Tienda', costo: 0, tiempoEstimado: 'Inmediato' },
        ]);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadFormData();
  }, []);

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    try {
      await orderService.createPedido(data);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating order:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Cargando datos...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Client Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <User className="h-4 w-4 mr-2" />
            Información del Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="clienteId">Cliente *</Label>
            <Select onValueChange={(value: string) => setValue('clienteId', parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.nombre} {client.apellido} - {client.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.clienteId && (
              <p className="text-sm text-red-600 mt-1">{errors.clienteId.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="direccionEnvio">Dirección de Envío</Label>
            <Textarea
              id="direccionEnvio"
              placeholder="Dirección completa de envío"
              {...register('direccionEnvio')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Detalles del Pedido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="montoTotal" className='pb-2'>Monto Total (COP) *</Label>
            <Input
              id="montoTotal"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register('montoTotal', { valueAsNumber: true })}
            />
            {errors.montoTotal && (
              <p className="text-sm text-red-600 mt-1">{errors.montoTotal.message}</p>
            )}
          </div>

            <div>
              <Label htmlFor="estadoPedido" className='pb-2'>Estado del Pedido</Label>
              <Select onValueChange={(value: string) => setValue('estadoPedido', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
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
              <Label htmlFor="estadoPago" className='pb-2'>Estado del Pago</Label>
              <Select onValueChange={(value: string) => setValue('estadoPago', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="pagado">Pagado</SelectItem>
                  <SelectItem value="fallido">Fallido</SelectItem>
                  <SelectItem value="reembolsado">Reembolsado</SelectItem>
                </SelectContent>
              </Select>
            </div>

          <div>
            <Label htmlFor="metodoPago" className='pb-2'>Método de Pago</Label>
            <Select onValueChange={(value: string) => setValue('metodoPago', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar método de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="tarjeta_credito">Tarjeta de Crédito</SelectItem>
                <SelectItem value="tarjeta_debito">Tarjeta de Débito</SelectItem>
                <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                <SelectItem value="pago_movil">Pago Móvil</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Shipping and Coupons */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Truck className="h-4 w-4 mr-2" />
            Envío y Descuentos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="metodoEnvioId" className='pb-2'>Método de Envío</Label>
            <Select onValueChange={(value: string) => setValue('metodoEnvioId', parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar método de envío" />
              </SelectTrigger>
              <SelectContent>
                {shippingMethods.map((method) => (
                  <SelectItem key={method.id} value={method.id.toString()}>
                    {method.nombre} - ${method.costo.toLocaleString()} COP ({method.tiempoEstimado})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="cuponId" className='pb-2'>Cupón de Descuento</Label>
            <Select onValueChange={(value: string) => setValue('cuponId', parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cupón (opcional)" />
              </SelectTrigger>
              <SelectContent>
                {coupons.filter(coupon => coupon.activo).map((coupon) => (
                  <SelectItem key={coupon.id} value={coupon.id.toString()}>
                    {coupon.codigo} - {coupon.tipoDescuento === 'porcentaje' ? `${coupon.valorDescuento}%` : `$${coupon.valorDescuento.toLocaleString()} COP`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Crear Pedido
        </Button>
      </div>
    </form>
  );
}
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
import { Loader2, User, CreditCard, Truck } from "lucide-react";
import { orderService } from '@/services/api/orders';
import { clientService } from '@/services/api/clients';
import { couponService } from '@/services/api/coupons';
import { shippingService } from '@/services/api/shipping';
import type { PedidosUpdate, PedidosDetail, Cliente, Cupon, MetodoEnvio } from '@/types/shop';

// Form validation schema
const orderSchema = z.object({
  montoTotal: z.number().min(0.01, 'El monto debe ser mayor a 0').optional(),
  estadoPedido: z.enum(['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado']).optional(),
  estadoPago: z.enum(['pendiente', 'pagado', 'fallido', 'reembolsado']).optional(),
  metodoPago: z.string().optional(),
  direccionEnvio: z.string().optional(),
  cuponId: z.number().optional().nullable(),
  metodoEnvioId: z.number().optional().nullable(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface EditOrderFormProps {
  orderId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EditOrderForm({ orderId, onSuccess, onCancel }: EditOrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);
  const [clients, setClients] = useState<Cliente[]>([]);
  const [coupons, setCoupons] = useState<Cupon[]>([]);
  const [shippingMethods, setShippingMethods] = useState<MetodoEnvio[]>([]);
  const [order, setOrder] = useState<PedidosDetail | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
  });

  // Load order and form data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load order details
        const orderData = await orderService.getPedido(orderId);
        setOrder(orderData);

        // Set form values with existing order data
        setValue('montoTotal', orderData.montoTotal);
        setValue('estadoPedido', orderData.estadoPedido as any);
        setValue('estadoPago', orderData.estadoPago as any);
        setValue('metodoPago', orderData.metodoPago || '');
        setValue('direccionEnvio', orderData.direccionEnvio || '');
        setValue('cuponId', orderData.cuponId || null);
        setValue('metodoEnvioId', orderData.metodoEnvioId || null);

        // Load dropdown data
        const [clientsData, couponsData, shippingData] = await Promise.all([
          clientService.getClientes({ limit: 100 }),
          couponService.getActiveCupones(),
          shippingService.getMetodosEnvio(),
        ]);

        setClients(clientsData);
        setCoupons(couponsData);
        setShippingMethods(shippingData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoadingOrder(false);
      }
    };

    loadData();
  }, [orderId, setValue]);

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    try {
      // Remove undefined values
      const updateData: PedidosUpdate = {};
      if (data.montoTotal !== undefined) updateData.montoTotal = data.montoTotal;
      if (data.estadoPedido !== undefined) updateData.estadoPedido = data.estadoPedido;
      if (data.estadoPago !== undefined) updateData.estadoPago = data.estadoPago;
      if (data.metodoPago !== undefined) updateData.metodoPago = data.metodoPago;
      if (data.direccionEnvio !== undefined) updateData.direccionEnvio = data.direccionEnvio;
      if (data.cuponId !== undefined && data.cuponId !== null) updateData.cuponId = data.cuponId;
      if (data.metodoEnvioId !== undefined && data.metodoEnvioId !== null) updateData.metodoEnvioId = data.metodoEnvioId;

      await orderService.updatePedido(orderId, updateData);
      onSuccess?.();
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingOrder) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Cargando datos del pedido...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-8 text-gray-500">
        No se pudo cargar la información del pedido
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Client Information (Read-only) */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <User className="h-4 w-4 mr-2" />
            Información del Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Cliente</Label>
            <div className="mt-1 p-2 bg-gray-50 rounded border">
              Cliente ID: {order.clienteId}
              {order.cliente_nombre && ` - ${order.cliente_nombre}`}
              {order.cliente_email && ` (${order.cliente_email})`}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              El cliente no puede ser modificado después de crear el pedido
            </p>
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
            <Select 
              defaultValue={order.estadoPedido}
              onValueChange={(value: string) => setValue('estadoPedido', value as any)}
            >
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
            <Select 
              defaultValue={order.estadoPago}
              onValueChange={(value: string) => setValue('estadoPago', value as any)}
            >
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
            <Select 
              defaultValue={order.metodoPago || undefined}
              onValueChange={(value: string) => setValue('metodoPago', value)}
            >
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
            <Select 
              defaultValue={order.metodoEnvioId?.toString()}
              onValueChange={(value: string) => setValue('metodoEnvioId', parseInt(value))}
            >
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
            <Select 
              defaultValue={order.cuponId?.toString()}
              onValueChange={(value: string) => setValue('cuponId', parseInt(value))}
            >
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
          Actualizar Pedido
        </Button>
      </div>
    </form>
  );
}

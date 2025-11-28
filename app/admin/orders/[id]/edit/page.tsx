'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Save, User, CreditCard, Truck, Tag, Loader2, Package, Plus, Trash2, X } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/header';
import { orderService } from '@/services/api/orders';
import { clientService } from '@/services/api/clients';
import { couponService } from '@/services/api/coupons';
import { shippingService } from '@/services/api/shipping';
import { orderItemService, type PedidoDetalle } from '@/services/api/order-items';
import { productService } from '@/services/api/products';
import type {
  PedidosUpdate,
  PedidosResponse,
  Cliente,
  Cupon,
  MetodoEnvio,
  Producto,
} from '@/types/shop';

// Form validation schema
const orderSchema = z.object({
  montoTotal: z.number().min(0.01, 'El monto debe ser mayor a 0').optional(),
  estadoPedido: z
    .enum(['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'])
    .optional(),
  estadoPago: z.enum(['pendiente', 'pagado', 'fallido', 'reembolsado']).optional(),
  metodoPago: z.string().optional(),
  direccionEnvio: z.string().optional(),
  cuponId: z.number().optional().nullable(),
  metodoEnvioId: z.number().optional().nullable(),
  fechaEnvio: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

export default function EditOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params.id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);
  const [clients, setClients] = useState<Cliente[]>([]);
  const [coupons, setCoupons] = useState<Cupon[]>([]);
  const [shippingMethods, setShippingMethods] = useState<MetodoEnvio[]>([]);
  const [order, setOrder] = useState<PedidosResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Order Items Management
  const [orderItems, setOrderItems] = useState<PedidoDetalle[]>([]);
  const [deletedItemIds, setDeletedItemIds] = useState<number[]>([]);
  const [products, setProducts] = useState<Producto[]>([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({
    productoId: 0,
    cantidad: 1,
    precioUnitario: 0,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
  });

  // Load order and form data on component mount
  useEffect(() => {
    if (orderId) {
      loadData();
    }
  }, [orderId]);

  const loadData = async () => {
    try {
      setIsLoadingOrder(true);
      setError(null);

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
      setValue(
        'fechaEnvio',
        orderData.fechaEnvio ? orderData.fechaEnvio.split('T')[0] : ''
      );

      // Load dropdown data and order items
      const [clientsData, couponsData, shippingData, itemsData, productsData] = await Promise.all([
        clientService.getClientes({ limit: 100 }),
        couponService.getCupones(),
        shippingService.getMetodosEnvio(),
        orderItemService.getItemsByPedido(orderId),
        productService.getProductos({ limit: 500 }),
      ]);

      setClients(clientsData);
      setCoupons(couponsData);
      setShippingMethods(shippingData);
      setOrderItems(itemsData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('No se pudo cargar la información del pedido');
    } finally {
      setIsLoadingOrder(false);
    }
  };

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Remove undefined values
      const updateData: PedidosUpdate = {};
      if (data.montoTotal !== undefined) updateData.montoTotal = data.montoTotal;
      if (data.estadoPedido !== undefined) updateData.estadoPedido = data.estadoPedido;
      if (data.estadoPago !== undefined) updateData.estadoPago = data.estadoPago;
      if (data.metodoPago !== undefined) updateData.metodoPago = data.metodoPago;
      if (data.direccionEnvio !== undefined) updateData.direccionEnvio = data.direccionEnvio;
      if (data.cuponId !== undefined && data.cuponId !== null)
        updateData.cuponId = data.cuponId;
      if (data.metodoEnvioId !== undefined && data.metodoEnvioId !== null)
        updateData.metodoEnvioId = data.metodoEnvioId;
      if (data.fechaEnvio !== undefined) updateData.fechaEnvio = data.fechaEnvio;

      // Update order
      await orderService.updatePedido(orderId, updateData);

      // Delete removed items
      await Promise.all(
        deletedItemIds.map((itemId) => orderItemService.deletePedidoDetalle(itemId))
      );

      // Update existing items (quantities or prices)
      const updatePromises = orderItems
        .filter((item) => item.id && !deletedItemIds.includes(item.id))
        .map((item) =>
          orderItemService.updatePedidoDetalle(item.id, {
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            subtotal: item.subtotal,
          })
        );

      await Promise.all(updatePromises);

      router.push('/admin/orders');
    } catch (error) {
      console.error('Error updating order:', error);
      setError('Error al actualizar el pedido. Por favor intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.productoId || newItem.cantidad <= 0) {
      setError('Por favor selecciona un producto y una cantidad válida');
      return;
    }

    try {
      const product = products.find((p) => p.id === newItem.productoId);
      if (!product) return;

      // Create the new item in the database
      const createdItem = await orderItemService.createPedidoDetalle({
        pedidoId: orderId,
        productoId: newItem.productoId,
        cantidad: newItem.cantidad,
        precioUnitario: newItem.precioUnitario || product.precio,
        subtotal: newItem.cantidad * (newItem.precioUnitario || product.precio),
      });

      // Add to local state
      setOrderItems([...orderItems, createdItem]);

      // Reset form
      setNewItem({ productoId: 0, cantidad: 1, precioUnitario: 0 });
      setShowAddItem(false);

      // Recalculate total
      recalculateTotal([...orderItems, createdItem]);
    } catch (error) {
      console.error('Error adding item:', error);
      setError('Error al agregar el producto');
    }
  };

  const handleRemoveItem = (itemId: number) => {
    setDeletedItemIds([...deletedItemIds, itemId]);
    const updatedItems = orderItems.filter((item) => item.id !== itemId);
    setOrderItems(updatedItems);
    recalculateTotal(updatedItems);
  };

  const handleUpdateItemQuantity = (itemId: number, cantidad: number) => {
    const updatedItems = orderItems.map((item) => {
      if (item.id === itemId) {
        const subtotal = cantidad * item.precioUnitario;
        return { ...item, cantidad, subtotal };
      }
      return item;
    });
    setOrderItems(updatedItems);
    recalculateTotal(updatedItems);
  };

  const handleUpdateItemPrice = (itemId: number, precioUnitario: number) => {
    const updatedItems = orderItems.map((item) => {
      if (item.id === itemId) {
        const subtotal = item.cantidad * precioUnitario;
        return { ...item, precioUnitario, subtotal };
      }
      return item;
    });
    setOrderItems(updatedItems);
    recalculateTotal(updatedItems);
  };

  const recalculateTotal = (items: PedidoDetalle[]) => {
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    setValue('montoTotal', total);
  };

  const getProductName = (productoId: number) => {
    const product = products.find((p) => p.id === productoId);
    return product?.nombre || `Producto #${productoId}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCancel = () => {
    router.push('/admin/orders');
  };

  if (isLoadingOrder) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <div className="text-lg">Cargando datos del pedido...</div>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push('/admin/orders')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a pedidos
        </Button>
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-red-600">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push('/admin/orders')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a pedidos
        </Button>
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              No se pudo cargar la información del pedido
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleCancel}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Editar Pedido #{orderId}</h1>
                <p className="text-muted-foreground mt-1">
                  Modifica la información del pedido seleccionado
                </p>
              </div>
            </div>
            <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
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
            {/* Client Information (Read-only) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Cliente</Label>
                  <div className="mt-1 p-3 bg-muted rounded-lg border">
                    <p className="font-medium">Cliente ID: {order.clienteId}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    El cliente no puede ser modificado después de crear el pedido
                  </p>
                </div>

                <div>
                  <Label htmlFor="direccionEnvio">Dirección de Envío</Label>
                  <Textarea
                    id="direccionEnvio"
                    placeholder="Dirección completa de envío..."
                    rows={2}
                    {...register('direccionEnvio')}
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
                <div>
                  <Label htmlFor="montoTotal">Monto Total (COP) *</Label>
                  <Input
                    id="montoTotal"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...register('montoTotal', { valueAsNumber: true })}
                    disabled={isSubmitting}
                  />
                  {errors.montoTotal && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.montoTotal.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="estadoPedido">Estado del Pedido</Label>
                    <Select
                      value={watch('estadoPedido')}
                      onValueChange={(value: string) =>
                        setValue('estadoPedido', value as any)
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="estadoPedido">
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
                    <Label htmlFor="estadoPago">Estado del Pago</Label>
                    <Select
                      value={watch('estadoPago')}
                      onValueChange={(value: string) => setValue('estadoPago', value as any)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="estadoPago">
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
                </div>

                <div>
                  <Label htmlFor="metodoPago">Método de Pago</Label>
                  <Select
                    value={watch('metodoPago')}
                    onValueChange={(value: string) => setValue('metodoPago', value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="metodoPago">
                      <SelectValue placeholder="Seleccionar método de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="tarjeta">Tarjeta</SelectItem>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                      <SelectItem value="pse">PSE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Productos del Pedido
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddItem(!showAddItem)}
                    disabled={isSubmitting}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar Producto
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add New Item Form */}
                {showAddItem && (
                  <div className="p-4 border rounded-lg bg-muted/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Nuevo Producto</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAddItem(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-3">
                        <Label>Producto</Label>
                        <Select
                          value={newItem.productoId.toString()}
                          onValueChange={(value) => {
                            const productId = parseInt(value);
                            const product = products.find((p) => p.id === productId);
                            setNewItem({
                              ...newItem,
                              productoId: productId,
                              precioUnitario: product?.precio || 0,
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id.toString()}>
                                {product.nombre} - {formatPrice(product.precio)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Cantidad</Label>
                        <Input
                          type="number"
                          min="1"
                          value={newItem.cantidad}
                          onChange={(e) =>
                            setNewItem({ ...newItem, cantidad: parseInt(e.target.value) || 1 })
                          }
                        />
                      </div>
                      <div>
                        <Label>Precio Unitario</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newItem.precioUnitario}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              precioUnitario: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          onClick={handleAddItem}
                          className="w-full"
                          size="sm"
                        >
                          Agregar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Items List */}
                {orderItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay productos en este pedido
                  </div>
                ) : (
                  <div className="space-y-2">
                    {orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 border rounded-lg bg-card"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {getProductName(item.productoId)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Producto ID: {item.productoId}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <Label className="text-xs">Cantidad</Label>
                            <Input
                              type="number"
                              min="1"
                              value={item.cantidad}
                              onChange={(e) =>
                                handleUpdateItemQuantity(
                                  item.id,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-20 h-8 text-center"
                              disabled={isSubmitting}
                            />
                          </div>
                          <div className="text-right">
                            <Label className="text-xs">Precio</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.precioUnitario}
                              onChange={(e) =>
                                handleUpdateItemPrice(
                                  item.id,
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-28 h-8 text-right"
                              disabled={isSubmitting}
                            />
                          </div>
                          <div className="text-right min-w-[100px]">
                            <Label className="text-xs">Subtotal</Label>
                            <p className="font-bold text-sm">{formatPrice(item.subtotal)}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isSubmitting}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="font-medium">Total de Productos:</span>
                      <span className="text-xl font-bold text-green-600">
                        {formatPrice(orderItems.reduce((sum, item) => sum + item.subtotal, 0))}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping and Coupons */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Envío y Descuentos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="metodoEnvioId">Método de Envío</Label>
                    <Select
                      value={watch('metodoEnvioId')?.toString()}
                      onValueChange={(value: string) =>
                        setValue('metodoEnvioId', parseInt(value))
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="metodoEnvioId">
                        <SelectValue placeholder="Seleccionar método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Sin método de envío</SelectItem>
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

                <div>
                  <Label htmlFor="cuponId">
                    <Tag className="h-4 w-4 inline mr-1" />
                    Cupón de Descuento
                  </Label>
                  <Select
                    value={watch('cuponId')?.toString()}
                    onValueChange={(value: string) =>
                      setValue('cuponId', parseInt(value))
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="cuponId">
                      <SelectValue placeholder="Sin cupón" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sin cupón</SelectItem>
                      {coupons
                        .filter((coupon) => coupon.activo)
                        .map((coupon) => (
                          <SelectItem key={coupon.id} value={coupon.id.toString()}>
                            {coupon.codigo} -{' '}
                            {coupon.tipoDescuento === 'porcentaje'
                              ? `${coupon.valorDescuento}%`
                              : `$${coupon.valorDescuento.toLocaleString()} COP`}
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
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID del pedido:</span>
                  <span className="font-medium">#{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Productos:</span>
                  <Badge variant="secondary">{orderItems.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado del pedido:</span>
                  <span className="font-medium capitalize">
                    {watch('estadoPedido')}
                  </span>
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
                {(watch('montoTotal') || 0) > 0 && (
                  <div className="flex justify-between pt-3 border-t">
                    <span className="font-medium">Monto total:</span>
                    <span className="font-bold text-lg text-green-600">
                      {formatPrice(watch('montoTotal') || 0)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Original Order Info */}
            <Card>
              <CardHeader>
                <CardTitle>Información Original</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium">Creado:</span>{' '}
                  {new Date(order.creadoEn).toLocaleDateString('es-CO')}
                </p>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle>Información</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Los campos con * son obligatorios</p>
                <p>• El cliente no puede ser modificado</p>
                <p>• Puedes cambiar el estado del pedido y pago</p>
                <p>• Los cambios se aplicarán al hacer clic en "Guardar Cambios"</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
        </div>
      </div>
    </div>
  );
}

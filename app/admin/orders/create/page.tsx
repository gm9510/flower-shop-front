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
import { EstadoPedido, EstadoPago } from '@/types/shop';
import Header from '@/components/layout/header';

// Form validation schema
const orderSchema = z.object({
    numeroFactura: z.number().optional(),
    idEntidad: z.number().min(1, 'Debe seleccionar una entidad'),
    subTotal: z.number().min(0, 'El subtotal debe ser mayor o igual a 0'),
    descuento: z.number().min(0, 'El descuento debe ser mayor o igual a 0').optional(),
    montoTotal: z.number().min(0.01, 'El monto debe ser mayor a 0'),
    saldo: z.number().optional(),
    estadoPedido: z
        .enum(['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'])
        .optional(),
    estadoPago: z.enum(['pendiente', 'pagado', 'fallido', 'reembolsado']).optional(),
    metodoPago: z.string().optional(),
    direccionEnvio: z.string().optional(),
    fechaEntrega: z.string().optional(),
    idCupon: z.number().optional(),
    idEnvio: z.number().optional(),
    efectivo: z.number().min(0).optional(),
    transferencia: z.number().min(0).optional(),
    usuario: z.string().optional(),
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
            metodoPago: 'DE CONTADO',
            direccionEnvio: '',
            subTotal: 0,
            descuento: 0,
            montoTotal: 0,
            saldo: 0,
            efectivo: 0,
            transferencia: 0,
        },
    });

    const selectedEntidadId = watch('idEntidad');
    const selectedCouponId = watch('idCupon');
    const selectedShippingId = watch('idEnvio');

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
                numeroFactura: data.numeroFactura,
                idEntidad: data.idEntidad,
                subTotal: data.subTotal,
                descuento: data.descuento,
                montoTotal: data.montoTotal,
                saldo: data.saldo,
                estadoPedido: data.estadoPedido as EstadoPedido || EstadoPedido.PENDIENTE,
                estadoPago: data.estadoPago as EstadoPago || EstadoPago.PENDIENTE,
                metodoPago: data.metodoPago || 'DE CONTADO',
                direccionEnvio: data.direccionEnvio || undefined,
                fechaEntrega: data.fechaEntrega ? `${data.fechaEntrega}T00:00:00` : new Date().toISOString(),
                idCupon: data.idCupon || undefined,
                idEnvio: data.idEnvio || undefined,
                efectivo: data.efectivo,
                transferencia: data.transferencia,
                usuario: data.usuario,
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
        <div className="min-h-screen bg-gray-100">
            {/* Admin Header */}
            <Header />
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

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
                                        Información de la Entidad
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="idEntidad">Entidad *</Label>
                                        <Select
                                            value={selectedEntidadId?.toString()}
                                            onValueChange={(value) => setValue('idEntidad', Number(value))}
                                            disabled={isSubmitting}
                                        >
                                            <SelectTrigger id="idEntidad">
                                                <SelectValue placeholder="Seleccione una entidad" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {clients.map((client) => (
                                                    <SelectItem key={client.id} value={client.id.toString()}>
                                                        {client.nombre} - {client.email}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.idEntidad && (
                                            <p className="text-sm text-red-500 mt-1">{errors.idEntidad.message}</p>
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
                                            <Label htmlFor="numeroFactura">Número de Factura</Label>
                                            <Input
                                                id="numeroFactura"
                                                type="number"
                                                {...register('numeroFactura', { valueAsNumber: true })}
                                                placeholder="Número de factura"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="usuario">Usuario</Label>
                                            <Input
                                                id="usuario"
                                                type="text"
                                                {...register('usuario')}
                                                placeholder="Usuario que registra"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="subTotal">Subtotal (COP) *</Label>
                                            <Input
                                                id="subTotal"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                {...register('subTotal', { valueAsNumber: true })}
                                                placeholder="0.00"
                                                disabled={isSubmitting}
                                            />
                                            {errors.subTotal && (
                                                <p className="text-sm text-red-500 mt-1">{errors.subTotal.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="descuento">Descuento (COP)</Label>
                                            <Input
                                                id="descuento"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                {...register('descuento', { valueAsNumber: true })}
                                                placeholder="0.00"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="saldo">Saldo (COP)</Label>
                                            <Input
                                                id="saldo"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                {...register('saldo', { valueAsNumber: true })}
                                                placeholder="0.00"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="montoTotal">Monto Total (COP) *</Label>
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

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="efectivo">Efectivo (COP)</Label>
                                            <Input
                                                id="efectivo"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                {...register('efectivo', { valueAsNumber: true })}
                                                placeholder="0.00"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="transferencia">Transferencia (COP)</Label>
                                            <Input
                                                id="transferencia"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                {...register('transferencia', { valueAsNumber: true })}
                                                placeholder="0.00"
                                                disabled={isSubmitting}
                                            />
                                        </div>
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
                                                <SelectItem value="DE CONTADO">De Contado</SelectItem>
                                                <SelectItem value="efectivo">Efectivo</SelectItem>
                                                <SelectItem value="tarjeta">Tarjeta</SelectItem>
                                                <SelectItem value="transferencia">Transferencia</SelectItem>
                                                <SelectItem value="pse">PSE</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                            <Label htmlFor="idEnvio">Método de Envío</Label>
                                            <Select
                                                value={selectedShippingId?.toString()}
                                                onValueChange={(value) => setValue('idEnvio', Number(value))}
                                                disabled={isSubmitting}
                                            >
                                                <SelectTrigger id="idEnvio">
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
                                            <Label htmlFor="fechaEntrega">Fecha de Entrega</Label>
                                            <Input
                                                id="fechaEntrega"
                                                type="date"
                                                {...register('fechaEntrega')}
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
                                        <Label htmlFor="idCupon">Cupón (Opcional)</Label>
                                        <Select
                                            value={selectedCouponId?.toString()}
                                            onValueChange={(value) => setValue('idCupon', Number(value))}
                                            disabled={isSubmitting}
                                        >
                                            <SelectTrigger id="idCupon">
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
                                    {watch('subTotal') > 0 && (
                                        <div className="flex justify-between pt-3 border-t">
                                            <span className="text-muted-foreground">Subtotal:</span>
                                            <span className="font-medium">
                                                {new Intl.NumberFormat('es-CO', {
                                                    style: 'currency',
                                                    currency: 'COP',
                                                    minimumFractionDigits: 0,
                                                }).format(watch('subTotal') || 0)}
                                            </span>
                                        </div>
                                    )}
                                    {(watch('descuento') || 0) > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Descuento:</span>
                                            <span className="font-medium text-red-600">
                                                -{new Intl.NumberFormat('es-CO', {
                                                    style: 'currency',
                                                    currency: 'COP',
                                                    minimumFractionDigits: 0,
                                                }).format(watch('descuento') || 0)}
                                            </span>
                                        </div>
                                    )}
                                    {watch('montoTotal') > 0 && (
                                        <div className="flex justify-between">
                                            <span className="font-medium">Monto total:</span>
                                            <span className="font-bold text-lg text-green-600">
                                                {new Intl.NumberFormat('es-CO', {
                                                    style: 'currency',
                                                    currency: 'COP',
                                                    minimumFractionDigits: 0,
                                                }).format(watch('montoTotal') || 0)}
                                            </span>
                                        </div>
                                    )}
                                    {(watch('saldo') || 0) > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Saldo:</span>
                                            <span className="font-medium text-orange-600">
                                                {new Intl.NumberFormat('es-CO', {
                                                    style: 'currency',
                                                    currency: 'COP',
                                                    minimumFractionDigits: 0,
                                                }).format(watch('saldo') || 0)}
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
        </div>
    );
}

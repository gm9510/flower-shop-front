'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, User, CreditCard, Truck, Tag, Calendar, Loader2, Edit, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { orderService } from '@/services/api/orders';
import { orderItemService, type PedidoDetalle } from '@/services/api/order-items';
import { productService } from '@/services/api/products';
import type { PedidosResponse, Producto } from '@/types/shop';
import Header from '@/components/layout/header';

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = Number(params.id);

    const [order, setOrder] = useState<PedidosResponse | null>(null);
    const [orderItems, setOrderItems] = useState<PedidoDetalle[]>([]);
    const [products, setProducts] = useState<Map<number, Producto>>(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch order and order items in parallel
            const [orderData, itemsData] = await Promise.all([
                orderService.getPedido(orderId),
                orderItemService.getItemsByPedido(orderId),
            ]);

            setOrder(orderData);
            setOrderItems(itemsData);

            // Fetch product details for all items
            if (itemsData.length > 0) {
                const productIds = [...new Set(itemsData.map(item => item.idProducto))];
                const productsData = await Promise.all(
                    productIds.map(id => productService.getProducto(id).catch(() => null))
                );

                const productsMap = new Map<number, Producto>();
                productsData.forEach(product => {
                    if (product) {
                        productsMap.set(product.id, product);
                    }
                });
                setProducts(productsMap);
            }
        } catch (err: any) {
            console.error('Failed to fetch order details:', err);
            setError('No se pudo cargar los detalles del pedido');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'No especificada';
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusBadge = (status: string, type: 'order' | 'payment') => {
        const variants: Record<string, { color: string; label: string }> = {
            // Order statuses
            pendiente: { color: 'bg-yellow-500', label: 'Pendiente' },
            procesando: { color: 'bg-blue-500', label: 'Procesando' },
            enviado: { color: 'bg-purple-500', label: 'Enviado' },
            entregado: { color: 'bg-green-500', label: 'Entregado' },
            cancelado: { color: 'bg-red-500', label: 'Cancelado' },
            // Payment statuses
            pagado: { color: 'bg-green-500', label: 'Pagado' },
            fallido: { color: 'bg-red-500', label: 'Fallido' },
            reembolsado: { color: 'bg-orange-500', label: 'Reembolsado' },
        };

        const config = variants[status] || { color: 'bg-gray-500', label: status };

        return (
            <Badge className={`${config.color} text-white`}>
                {config.label}
            </Badge>
        );
    };

    const getProductName = (productoId: number) => {
        const product = products.get(productoId);
        return product?.nombre || `Producto #${productoId}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <div className="text-lg">Cargando detalles del pedido...</div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="space-y-6">
                <Button variant="ghost" onClick={() => router.push('/admin/orders')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver a pedidos
                </Button>
                <Card>
                    <CardContent className="py-8">
                        <div className="text-center text-red-600">
                            {error || 'Pedido no encontrado'}
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
                            <Button variant="ghost" onClick={() => router.push('/admin/orders')}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold">Pedido #{orderId}</h1>
                                <p className="text-muted-foreground mt-1">
                                    Detalles del pedido
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {getStatusBadge(order.estadoPedido, 'order')}
                            {getStatusBadge(order.estadoPago, 'payment')}
                            <Button onClick={() => router.push(`/admin/orders/${orderId}/edit`)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5" />
                                        Información del Pedido
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                ID del Pedido
                                            </label>
                                            <p className="mt-1 text-lg font-medium">#{order.id}</p>
                                        </div>
                                        {order.numeroFactura && (
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Número de Factura
                                                </label>
                                                <p className="mt-1 text-lg font-medium">{order.numeroFactura}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Subtotal
                                            </label>
                                            <p className="mt-1 text-lg font-semibold">
                                                {formatPrice(order.subTotal)}
                                            </p>
                                        </div>
                                        {order.descuento && order.descuento > 0 && (
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Descuento
                                                </label>
                                                <p className="mt-1 text-lg font-semibold text-red-600">
                                                    -{formatPrice(order.descuento)}
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Monto Total
                                            </label>
                                            <p className="mt-1 text-2xl font-bold text-green-600">
                                                {formatPrice(order.montoTotal)}
                                            </p>
                                        </div>
                                    </div>

                                    {order.saldo && order.saldo > 0 && (
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Saldo Pendiente
                                            </label>
                                            <p className="mt-1 text-xl font-bold text-orange-600">
                                                {formatPrice(order.saldo)}
                                            </p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Estado del Pedido
                                            </label>
                                            <p className="mt-1">{getStatusBadge(order.estadoPedido, 'order')}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Estado del Pago
                                            </label>
                                            <p className="mt-1">{getStatusBadge(order.estadoPago, 'payment')}</p>
                                        </div>
                                    </div>

                                    {order.metodoPago && (
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                <CreditCard className="h-4 w-4" />
                                                Método de Pago
                                            </label>
                                            <p className="mt-1 text-lg capitalize">{order.metodoPago}</p>
                                        </div>
                                    )}

                                    {((order.efectivo && order.efectivo > 0) || (order.transferencia && order.transferencia > 0)) && (
                                        <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                                            {order.efectivo && order.efectivo > 0 && (
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">
                                                        Efectivo
                                                    </label>
                                                    <p className="mt-1 text-lg font-semibold">
                                                        {formatPrice(order.efectivo)}
                                                    </p>
                                                </div>
                                            )}
                                            {order.transferencia && order.transferencia > 0 && (
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">
                                                        Transferencia
                                                    </label>
                                                    <p className="mt-1 text-lg font-semibold">
                                                        {formatPrice(order.transferencia)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {order.usuario && (
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Usuario
                                            </label>
                                            <p className="mt-1 text-lg">{order.usuario}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Order Items */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ShoppingCart className="h-5 w-5" />
                                        Productos del Pedido
                                        <Badge variant="secondary" className="ml-2">
                                            {orderItems.length} {orderItems.length === 1 ? 'producto' : 'productos'}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {orderItems.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            No hay productos en este pedido
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Producto</TableHead>
                                                        <TableHead className="text-right">Cantidad</TableHead>
                                                        <TableHead className="text-right">Precio Unit.</TableHead>
                                                        <TableHead className="text-right">Subtotal</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {orderItems.map((item) => (
                                                        <TableRow key={item.id}>
                                                            <TableCell>
                                                                <div>
                                                                    <p className="font-medium">{getProductName(item.idProducto)}</p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        ID: {item.idProducto}
                                                                    </p>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Badge variant="outline">{item.cantidad}</Badge>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                {formatPrice(item.precioUnitario)}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

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
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Entidad ID
                                        </label>
                                        <p className="mt-1 text-lg font-medium">#{order.idEntidad}</p>
                                    </div>

                                    {order.direccionEnvio && (
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Dirección de Envío
                                            </label>
                                            <p className="mt-1 p-3 bg-muted rounded-lg">{order.direccionEnvio}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Shipping Information */}
                            {(order.idEnvio || order.fechaEntrega) && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Truck className="h-5 w-5" />
                                            Información de Envío
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {order.idEnvio && (
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Método de Envío
                                                </label>
                                                <p className="mt-1 text-lg">Método ID: {order.idEnvio}</p>
                                            </div>
                                        )}

                                        {order.fechaEntrega && (
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    Fecha de Entrega
                                                </label>
                                                <p className="mt-1 text-lg">{formatDate(order.fechaEntrega)}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Coupon Information */}
                            {order.idCupon && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Tag className="h-5 w-5" />
                                            Cupón Aplicado
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                ID del Cupón
                                            </label>
                                            <p className="mt-1 text-lg font-medium">#{order.idCupon}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Summary Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Resumen</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">ID del pedido</span>
                                        <span className="font-medium">#{order.id}</span>
                                    </div>
                                    {order.numeroFactura && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Núm. Factura</span>
                                            <span className="font-medium">{order.numeroFactura}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Entidad ID</span>
                                        <span className="font-medium">#{order.idEntidad}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Productos</span>
                                        <Badge variant="secondary">{orderItems.length}</Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Estado</span>
                                        {getStatusBadge(order.estadoPedido, 'order')}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Pago</span>
                                        {getStatusBadge(order.estadoPago, 'payment')}
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t">
                                        <span className="text-sm text-muted-foreground">Subtotal</span>
                                        <span className="font-medium">
                                            {formatPrice(order.subTotal)}
                                        </span>
                                    </div>
                                    {order.descuento && order.descuento > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Descuento</span>
                                            <span className="font-medium text-red-600">
                                                -{formatPrice(order.descuento)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Monto Total</span>
                                        <span className="font-bold text-lg text-green-600">
                                            {formatPrice(order.montoTotal)}
                                        </span>
                                    </div>
                                    {order.saldo && order.saldo > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Saldo</span>
                                            <span className="font-semibold text-orange-600">
                                                {formatPrice(order.saldo)}
                                            </span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Timeline Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Línea de Tiempo</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    {order.registro && (
                                        <div>
                                            <p className="text-muted-foreground">Registrado</p>
                                            <p className="font-medium">{formatDate(order.registro)}</p>
                                        </div>
                                    )}
                                    {order.fechaEntrega && (
                                        <div>
                                            <p className="text-muted-foreground">Fecha de Entrega</p>
                                            <p className="font-medium">{formatDate(order.fechaEntrega)}</p>
                                        </div>
                                    )}
                                    {order.usuario && (
                                        <div>
                                            <p className="text-muted-foreground">Usuario</p>
                                            <p className="font-medium">{order.usuario}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Acciones</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        onClick={() => router.push(`/admin/orders/${orderId}/edit`)}
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Editar Pedido
                                    </Button>
                                    <Button className="w-full" variant="outline" disabled>
                                        Imprimir
                                    </Button>
                                    <Button className="w-full" variant="outline" disabled>
                                        Enviar Email
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

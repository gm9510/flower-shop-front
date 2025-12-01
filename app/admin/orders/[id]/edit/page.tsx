'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/layout/header';
import { orderService } from '@/services/api/orders';
import { orderItemService } from '@/services/api/order-items';
import type { PedidosUpdate } from '@/types/shop';
import { EstadoPedido, EstadoPago } from '@/types/shop';
import { orderSchema, type OrderFormData } from './schema/orderSchema';
import { useOrderData } from './hooks/useOrderData';
import { useOrderItems } from './hooks/useOrderItems';
import { ClientInfoSection } from './components/ClientInfoSection';
import { OrderDetailsSection } from './components/OrderDetailsSection';
import { OrderItemsSection } from './components/OrderItemsSection';
import { ShippingSection } from './components/ShippingSection';
import { OrderSummary } from './components/OrderSummary';

export default function EditOrderPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = Number(params.id);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<OrderFormData>({
        resolver: zodResolver(orderSchema),
    });

    // Custom hooks for data management
    const {
        isLoadingOrder,
        order,
        clients,
        coupons,
        shippingMethods,
        products,
        error,
        setError,
    } = useOrderData(orderId, setValue);

    const {
        orderItems,
        deletedItemIds,
        showAddItem,
        setShowAddItem,
        newItem,
        setNewItem,
        handleAddItem,
        handleRemoveItem,
        handleUpdateItemQuantity,
        getProductName,
    } = useOrderItems(orderId, products, setValue, watch);

    // Utility functions
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

    const onSubmit = async (data: OrderFormData) => {
        setIsSubmitting(true);
        setError(null);
        try {
            // Remove undefined values
            const updateData: PedidosUpdate = {};
            if (data.numeroFactura !== undefined) updateData.numeroFactura = data.numeroFactura;
            if (data.idEntidad !== undefined) updateData.idEntidad = data.idEntidad;
            if (data.subTotal !== undefined) updateData.subTotal = data.subTotal;
            if (data.descuento !== undefined) updateData.descuento = data.descuento;
            if (data.montoTotal !== undefined) updateData.montoTotal = data.montoTotal;
            if (data.saldo !== undefined) updateData.saldo = data.saldo;
            if (data.estadoPedido !== undefined) updateData.estadoPedido = data.estadoPedido as EstadoPedido;
            if (data.estadoPago !== undefined) updateData.estadoPago = data.estadoPago as EstadoPago;
            if (data.metodoPago !== undefined) updateData.metodoPago = data.metodoPago;
            if (data.direccionEnvio !== undefined) updateData.direccionEnvio = data.direccionEnvio;
            if (data.fechaEntrega !== undefined) updateData.fechaEntrega = `${data.fechaEntrega}T00:00:00`;
            if (data.idCupon !== undefined && data.idCupon !== null) updateData.idCupon = data.idCupon;
            if (data.idEnvio !== undefined && data.idEnvio !== null) updateData.idEnvio = data.idEnvio;
            if (data.efectivo !== undefined) updateData.efectivo = data.efectivo;
            if (data.transferencia !== undefined) updateData.transferencia = data.transferencia || 0;
            if (data.usuario !== undefined) updateData.usuario = data.usuario;

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
                    orderItemService.updatePedidoDetalleCantidad(item.id, item.cantidad)
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
                                {/* Client Information */}
                                <ClientInfoSection
                                    idEntidad={order.idEntidad}
                                    register={register}
                                    isSubmitting={isSubmitting}
                                />

                                {/* Order Details */}
                                <OrderDetailsSection
                                    register={register}
                                    errors={errors}
                                    setValue={setValue}
                                    watch={watch}
                                    isSubmitting={isSubmitting}
                                />

                                {/* Order Items */}
                                <OrderItemsSection
                                    orderItems={orderItems}
                                    products={products}
                                    showAddItem={showAddItem}
                                    setShowAddItem={setShowAddItem}
                                    newItem={newItem}
                                    setNewItem={setNewItem}
                                    handleAddItem={handleAddItem}
                                    handleRemoveItem={handleRemoveItem}
                                    handleUpdateItemQuantity={handleUpdateItemQuantity}
                                    getProductName={getProductName}
                                    formatPrice={formatPrice}
                                    isSubmitting={isSubmitting}
                                    setError={setError}
                                />

                                {/* Shipping and Coupons */}
                                <ShippingSection
                                    register={register}
                                    setValue={setValue}
                                    watch={watch}
                                    shippingMethods={shippingMethods}
                                    coupons={coupons}
                                    isSubmitting={isSubmitting}
                                />
                            </div>

                            {/* Sidebar */}
                            <OrderSummary
                                orderId={orderId}
                                watch={watch}
                                orderItemsCount={orderItems.length}
                                formatPrice={formatPrice}
                                registro={order.registro}
                                usuario={order.usuario}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

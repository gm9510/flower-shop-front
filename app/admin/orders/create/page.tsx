'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { orderService } from '@/services/api/orders';
import type { PedidosCreate } from '@/types/shop';
import { EstadoPedido, EstadoPago } from '@/types/shop';
import Header from '@/components/layout/header';
import { orderCreateSchema, type OrderCreateFormData } from './schema/orderCreateSchema';
import { useCreateOrderData } from './hooks/useCreateOrderData';
import { useOrderItems } from './hooks/useOrderItems';
import { ClientInfoSection } from './components/ClientInfoSection';
import { OrderDetailsSection } from './components/OrderDetailsSection';
import { ShippingSection } from './components/ShippingSection';
import { CouponSection } from './components/CouponSection';
import { OrderSummary } from './components/OrderSummary';
import { OrderItemsSection } from './components/OrderItemsSection';
import { formatPrice } from '../[id]/utils/formatters';
import { orderItemService } from '@/services/api/order-items';

export default function CreateOrderPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch data using custom hook
    const { clients, coupons, shippingMethods, isLoading, error: fetchError, products} = useCreateOrderData();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<OrderCreateFormData>({
        resolver: zodResolver(orderCreateSchema),
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


    const { 
        orderItems,
        showAddItem, 
        newItem,
        setShowAddItem,
        setNewItem,
        handleAddItem,
        getProductName,
        handleRemoveItem,
        handleUpdateItemQuantity,
    } = useOrderItems(products, setValue, watch);

    const selectedEntidadId = watch('idEntidad');
    const selectedCouponId = watch('idCupon');
    const selectedShippingId = watch('idEnvio');

    const onSubmit = async (data: OrderCreateFormData) => {
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

            for (const item of orderItems) {
                await orderItemService.createPedidoDetalle({
                    idPedido: newOrder.id,
                    idProducto: item.idProducto,
                    cantidad: item.cantidad,
                    precioUnitario: item.precioUnitario,
                });
            }

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

    if (isLoading) {
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

                {(error || fetchError) && (
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="py-4">
                            <p className="text-red-600 text-sm">{error || fetchError}</p>
                        </CardContent>
                    </Card>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-6">
                            <ClientInfoSection
                                clients={clients}
                                selectedClientId={selectedEntidadId}
                                register={register}
                                setValue={setValue}
                                errors={errors}
                                isSubmitting={isSubmitting}
                            />

                            <OrderDetailsSection
                                register={register}
                                setValue={setValue}
                                watch={watch}
                                errors={errors}
                                isSubmitting={isSubmitting}
                            />

                            <ShippingSection
                                shippingMethods={shippingMethods}
                                selectedShippingId={selectedShippingId}
                                register={register}
                                setValue={setValue}
                                isSubmitting={isSubmitting}
                            />

                            <CouponSection
                                coupons={coupons}
                                selectedCouponId={selectedCouponId}
                                setValue={setValue}
                                isSubmitting={isSubmitting}
                            />
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
                        </div>

                        {/* Sidebar */}
                        <OrderSummary watch={watch} />
                    </div>
                </form>

            </div>
        </div>
    );
}
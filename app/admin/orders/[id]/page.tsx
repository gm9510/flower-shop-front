'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/layout/header';
import { useOrderDetails } from './hooks/useOrderDetails';
import { OrderInfoSection } from './components/OrderInfoSection';
import { OrderItemsList } from './components/OrderItemsList';
import { ClientAndShippingInfo } from './components/ClientAndShippingInfo';
import { OrderDetailsSidebar } from './components/OrderDetailsSidebar';
import { getStatusBadge, formatPrice, formatDate } from './utils/formatters';

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = Number(params.id);

    const { order, orderItems, loading, error, getProductName } = useOrderDetails(orderId);

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
                            <OrderInfoSection
                                order={order}
                                formatPrice={formatPrice}
                                getStatusBadge={getStatusBadge}
                            />

                            <OrderItemsList
                                orderItems={orderItems}
                                getProductName={getProductName}
                                formatPrice={formatPrice}
                            />

                            <ClientAndShippingInfo order={order} formatDate={formatDate} />
                        </div>

                        {/* Sidebar */}
                        <OrderDetailsSidebar
                            order={order}
                            orderId={orderId}
                            orderItemsCount={orderItems.length}
                            formatPrice={formatPrice}
                            formatDate={formatDate}
                            getStatusBadge={getStatusBadge}
                            onEdit={() => router.push(`/admin/orders/${orderId}/edit`)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

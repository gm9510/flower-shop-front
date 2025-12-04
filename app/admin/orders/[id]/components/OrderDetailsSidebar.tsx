import { Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { PedidosResponse } from '@/types/shop';

interface OrderDetailsSidebarProps {
    order: PedidosResponse;
    orderId: number;
    orderItemsCount: number;
    formatPrice: (price: number) => string;
    formatDate: (dateString?: string) => string;
    getStatusBadge: (status: string, type: 'order' | 'payment') => React.ReactElement;
    onEdit: () => void;
}

export const OrderDetailsSidebar = ({
    order,
    orderId,
    orderItemsCount,
    formatPrice,
    formatDate,
    getStatusBadge,
    onEdit,
}: OrderDetailsSidebarProps) => {
    return (
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
                        <Badge variant="secondary">{orderItemsCount}</Badge>
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
                        <span className="font-medium">{formatPrice(order.subTotal)}</span>
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
                    <Button className="w-full" variant="outline" onClick={onEdit}>
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
    );
};

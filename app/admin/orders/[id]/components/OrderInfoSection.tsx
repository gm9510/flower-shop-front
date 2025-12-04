import { Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PedidosResponse } from '@/types/shop';

interface OrderInfoSectionProps {
    order: PedidosResponse;
    formatPrice: (price: number) => string;
    getStatusBadge: (status: string, type: 'order' | 'payment') => React.ReactElement;
}

export const OrderInfoSection = ({ order, formatPrice, getStatusBadge }: OrderInfoSectionProps) => {
    return (
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
    );
};

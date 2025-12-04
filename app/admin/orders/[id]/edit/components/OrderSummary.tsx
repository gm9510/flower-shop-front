import { UseFormWatch } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { OrderFormData } from '../schema/orderSchema';

interface OrderSummaryProps {
    orderId: number;
    watch: UseFormWatch<OrderFormData>;
    orderItemsCount: number;
    formatPrice: (price: number) => string;
    registro?: string;
    usuario?: string;
}

export const OrderSummary = ({
    orderId,
    watch,
    orderItemsCount,
    formatPrice,
    registro,
    usuario,
}: OrderSummaryProps) => {
    return (
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
                    {watch('numeroFactura') && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Núm. Factura:</span>
                            <span className="font-medium">{watch('numeroFactura')}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Productos:</span>
                        <Badge variant="secondary">{orderItemsCount}</Badge>
                    </div>
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
                    {(watch('subTotal') || 0) > 0 && (
                        <div className="flex justify-between pt-3 border-t">
                            <span className="text-muted-foreground">Subtotal:</span>
                            <span className="font-medium">{formatPrice(watch('subTotal') || 0)}</span>
                        </div>
                    )}
                    {(watch('descuento') || 0) > 0 && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Descuento:</span>
                            <span className="font-medium text-red-600">
                                -{formatPrice(watch('descuento') || 0)}
                            </span>
                        </div>
                    )}
                    {(watch('montoTotal') || 0) > 0 && (
                        <div className="flex justify-between">
                            <span className="font-medium">Monto total:</span>
                            <span className="font-bold text-lg text-green-600">
                                {formatPrice(watch('montoTotal') || 0)}
                            </span>
                        </div>
                    )}
                    {(watch('saldo') || 0) > 0 && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Saldo:</span>
                            <span className="font-medium text-orange-600">
                                {formatPrice(watch('saldo') || 0)}
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
                    {registro && (
                        <p>
                            <span className="font-medium">Registrado:</span>{' '}
                            {new Date(registro).toLocaleDateString('es-CO')}
                        </p>
                    )}
                    {usuario && (
                        <p>
                            <span className="font-medium">Usuario:</span> {usuario}
                        </p>
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
                    <p>• El cliente no puede ser modificado</p>
                    <p>• Puedes cambiar el estado del pedido y pago</p>
                    <p>• Los cambios se aplicarán al hacer clic en &quot;Guardar Cambios&quot;</p>
                </CardContent>
            </Card>
        </div>
    );
};

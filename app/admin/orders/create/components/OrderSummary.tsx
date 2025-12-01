import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormWatch } from 'react-hook-form';
import type { OrderCreateFormData } from '../schema/orderCreateSchema';

interface OrderSummaryProps {
    watch: UseFormWatch<OrderCreateFormData>;
}

export const OrderSummary = ({ watch }: OrderSummaryProps) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="space-y-6">
            {/* Summary Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Resumen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Estado del pedido:</span>
                        <span className="font-medium capitalize">{watch('estadoPedido') || 'pendiente'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Estado de pago:</span>
                        <span className="font-medium capitalize">{watch('estadoPago') || 'pendiente'}</span>
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
                                {formatCurrency(watch('subTotal') || 0)}
                            </span>
                        </div>
                    )}
                    {(watch('descuento') || 0) > 0 && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Descuento:</span>
                            <span className="font-medium text-red-600">
                                -{formatCurrency(watch('descuento') || 0)}
                            </span>
                        </div>
                    )}
                    {watch('montoTotal') > 0 && (
                        <div className="flex justify-between">
                            <span className="font-medium">Monto total:</span>
                            <span className="font-bold text-lg text-green-600">
                                {formatCurrency(watch('montoTotal') || 0)}
                            </span>
                        </div>
                    )}
                    {(watch('saldo') || 0) > 0 && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Saldo:</span>
                            <span className="font-medium text-orange-600">
                                {formatCurrency(watch('saldo') || 0)}
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Help Card */}
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
    );
};

import { User, Truck, Tag, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PedidosResponse } from '@/types/shop';

interface ClientAndShippingInfoProps {
    order: PedidosResponse;
    formatDate: (dateString?: string) => string;
}

export const ClientAndShippingInfo = ({ order, formatDate }: ClientAndShippingInfoProps) => {
    return (
        <>
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
        </>
    );
};

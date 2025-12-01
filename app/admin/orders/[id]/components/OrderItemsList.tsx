import { ShoppingCart } from 'lucide-react';
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
import type { PedidoDetalle } from '@/services/api/order-items';

interface OrderItemsListProps {
    orderItems: PedidoDetalle[];
    getProductName: (productoId: number) => string;
    formatPrice: (price: number) => string;
}

export const OrderItemsList = ({ orderItems, getProductName, formatPrice }: OrderItemsListProps) => {
    return (
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
                                        <TableCell className="text-right font-medium">
                                            {formatPrice(item.cantidad * item.precioUnitario)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

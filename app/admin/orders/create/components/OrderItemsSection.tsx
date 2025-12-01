import { Package, Plus, X, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type {  PedidoDetalleCreate } from '@/services/api/order-items';
import type { Producto } from '@/types/shop';

interface OrderItemsSectionProps {
    orderItems: PedidoDetalleCreate[];
    products: Producto[];
    showAddItem: boolean;
    setShowAddItem: (show: boolean) => void;
    newItem: {
        productoId: number;
        cantidad: number;
        precioUnitario: number;
    };
    setNewItem: (item: any) => void;
    handleAddItem: (setError: (error: string | null) => void) => void;
    handleRemoveItem: (index: number) => void;
    handleUpdateItemQuantity: (index: number, cantidad: number) => void;
    getProductName: (productoId: number) => string;
    formatPrice: (price: number) => string;
    isSubmitting: boolean;
    setError: (error: string | null) => void;
}

export const OrderItemsSection = ({
    orderItems,
    products,
    showAddItem,
    setShowAddItem,
    newItem,
    setNewItem,
    handleAddItem,
    handleRemoveItem,
    handleUpdateItemQuantity,
    getProductName,
    formatPrice,
    isSubmitting,
    setError,
}: OrderItemsSectionProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Productos del Pedido
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddItem(!showAddItem)}
                        disabled={isSubmitting}
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar Producto
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Add New Item Form */}
                {showAddItem && (
                    <div className="p-4 border rounded-lg bg-muted/50 space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium">Nuevo Producto</h4>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowAddItem(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-3">
                                <Label>Producto</Label>
                                <Select
                                    value={newItem.productoId.toString()}
                                    onValueChange={(value) => {
                                        const productId = parseInt(value);
                                        const product = products.find((p) => p.id === productId);
                                        setNewItem({
                                            ...newItem,
                                            productoId: productId,
                                            precioUnitario: product?.precioVenta || 0,
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar producto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((product) => (
                                            <SelectItem key={product.id} value={product.id.toString()}>
                                                {product.nombre} - {formatPrice(product.precioVenta)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Cantidad</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={newItem.cantidad}
                                    onChange={(e) =>
                                        setNewItem({ ...newItem, cantidad: parseInt(e.target.value) || 1 })
                                    }
                                />
                            </div>
                            <div>
                                <Label>Precio Unitario</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={newItem.precioUnitario}
                                    onChange={(e) =>
                                        setNewItem({
                                            ...newItem,
                                            precioUnitario: parseFloat(e.target.value) || 0,
                                        })
                                    }
                                />
                            </div>
                            <div className="flex items-end">
                                <Button
                                    type="button"
                                    onClick={() => handleAddItem(setError)}
                                    className="w-full"
                                    size="sm"
                                >
                                    Agregar
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Order Items List */}
                {orderItems.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No hay productos en este pedido
                    </div>
                ) : (
                    <div className="space-y-2">
                        {orderItems.map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 p-3 border rounded-lg bg-card"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">
                                        {getProductName(item.idProducto)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Producto ID: {item.idProducto}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-right">
                                        <Label className="text-xs">Cantidad</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={item.cantidad}
                                            className="w-20 h-8 text-center"
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="text-right">
                                        <Label className="text-xs">Precio</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            disabled={true}
                                            value={item.precioUnitario}
                                            className="w-28 h-8 text-right"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveItem(i)}
                                        disabled={isSubmitting}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

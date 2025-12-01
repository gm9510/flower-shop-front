import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { OrderFormData } from '../schema/orderSchema';

interface OrderDetailsSectionProps {
    register: UseFormRegister<OrderFormData>;
    errors: FieldErrors<OrderFormData>;
    setValue: UseFormSetValue<OrderFormData>;
    watch: UseFormWatch<OrderFormData>;
    isSubmitting: boolean;
}

export const OrderDetailsSection = ({
    register,
    errors,
    setValue,
    watch,
    isSubmitting,
}: OrderDetailsSectionProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Detalles del Pedido
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="numeroFactura">Número de Factura</Label>
                        <Input
                            id="numeroFactura"
                            type="number"
                            placeholder="Número de factura"
                            {...register('numeroFactura', { valueAsNumber: true })}
                            disabled={isSubmitting}
                        />
                    </div>
                    <div>
                        <Label htmlFor="usuario">Usuario</Label>
                        <Input
                            id="usuario"
                            type="text"
                            placeholder="Usuario que registra"
                            {...register('usuario')}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="subTotal">Subtotal (COP) *</Label>
                        <Input
                            id="subTotal"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...register('subTotal', { valueAsNumber: true })}
                            disabled={isSubmitting}
                        />
                        {errors.subTotal && (
                            <p className="text-sm text-red-600 mt-1">{errors.subTotal.message}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="descuento">Descuento (COP)</Label>
                        <Input
                            id="descuento"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...register('descuento', { valueAsNumber: true })}
                            disabled={isSubmitting}
                        />
                    </div>
                    <div>
                        <Label htmlFor="saldo">Saldo (COP)</Label>
                        <Input
                            id="saldo"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...register('saldo', { valueAsNumber: true })}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="montoTotal">Monto Total (COP) *</Label>
                    <Input
                        id="montoTotal"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...register('montoTotal', { valueAsNumber: true })}
                        disabled={isSubmitting}
                    />
                    {errors.montoTotal && (
                        <p className="text-sm text-red-600 mt-1">{errors.montoTotal.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="efectivo">Efectivo (COP)</Label>
                        <Input
                            id="efectivo"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...register('efectivo', { valueAsNumber: true })}
                            disabled={isSubmitting}
                        />
                    </div>
                    <div>
                        <Label htmlFor="transferencia">Transferencia (COP)</Label>
                        <Input
                            id="transferencia"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...register('transferencia', { valueAsNumber: true })}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="estadoPedido">Estado del Pedido</Label>
                        <Select
                            value={watch('estadoPedido')}
                            onValueChange={(value: string) => setValue('estadoPedido', value as any)}
                            disabled={isSubmitting}
                        >
                            <SelectTrigger id="estadoPedido">
                                <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pendiente">Pendiente</SelectItem>
                                <SelectItem value="procesando">Procesando</SelectItem>
                                <SelectItem value="enviado">Enviado</SelectItem>
                                <SelectItem value="entregado">Entregado</SelectItem>
                                <SelectItem value="cancelado">Cancelado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="estadoPago">Estado del Pago</Label>
                        <Select
                            value={watch('estadoPago')}
                            onValueChange={(value: string) => setValue('estadoPago', value as any)}
                            disabled={isSubmitting}
                        >
                            <SelectTrigger id="estadoPago">
                                <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pendiente">Pendiente</SelectItem>
                                <SelectItem value="pagado">Pagado</SelectItem>
                                <SelectItem value="fallido">Fallido</SelectItem>
                                <SelectItem value="reembolsado">Reembolsado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div>
                    <Label htmlFor="metodoPago">Método de Pago</Label>
                    <Select
                        value={watch('metodoPago')}
                        onValueChange={(value: string) => setValue('metodoPago', value)}
                        disabled={isSubmitting}
                    >
                        <SelectTrigger id="metodoPago">
                            <SelectValue placeholder="Seleccionar método de pago" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="efectivo">Efectivo</SelectItem>
                            <SelectItem value="tarjeta">Tarjeta</SelectItem>
                            <SelectItem value="transferencia">Transferencia</SelectItem>
                            <SelectItem value="pse">PSE</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
};

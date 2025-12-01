import { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Truck, Tag } from 'lucide-react';
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
import type { MetodoEnvio, Cupon } from '@/types/shop';
import type { OrderFormData } from '../schema/orderSchema';

interface ShippingSectionProps {
    register: UseFormRegister<OrderFormData>;
    setValue: UseFormSetValue<OrderFormData>;
    watch: UseFormWatch<OrderFormData>;
    shippingMethods: MetodoEnvio[];
    coupons: Cupon[];
    isSubmitting: boolean;
}

export const ShippingSection = ({
    register,
    setValue,
    watch,
    shippingMethods,
    coupons,
    isSubmitting,
}: ShippingSectionProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Envío y Descuentos
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="idEnvio">Método de Envío</Label>
                        <Select
                            value={watch('idEnvio')?.toString()}
                            onValueChange={(value: string) => setValue('idEnvio', parseInt(value))}
                            disabled={isSubmitting}
                        >
                            <SelectTrigger id="idEnvio">
                                <SelectValue placeholder="Seleccionar método" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Sin método de envío</SelectItem>
                                {shippingMethods.map((method) => (
                                    <SelectItem key={method.id} value={method.id.toString()}>
                                        {method.nombre} - ${method.costo.toLocaleString()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="fechaEntrega">Fecha de Entrega</Label>
                        <Input
                            id="fechaEntrega"
                            type="date"
                            {...register('fechaEntrega')}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="idCupon">
                        <Tag className="h-4 w-4 inline mr-1" />
                        Cupón de Descuento
                    </Label>
                    <Select
                        value={watch('idCupon')?.toString()}
                        onValueChange={(value: string) => setValue('idCupon', parseInt(value))}
                        disabled={isSubmitting}
                    >
                        <SelectTrigger id="idCupon">
                            <SelectValue placeholder="Sin cupón" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">Sin cupón</SelectItem>
                            {coupons
                                .filter((coupon) => coupon.activo)
                                .map((coupon) => (
                                    <SelectItem key={coupon.id} value={coupon.id.toString()}>
                                        {coupon.codigo} -{' '}
                                        {coupon.tipoDescuento === 'porcentaje'
                                            ? `${coupon.valorDescuento}%`
                                            : `$${coupon.valorDescuento.toLocaleString()} COP`}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
};

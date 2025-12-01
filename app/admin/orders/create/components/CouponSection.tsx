import { Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { UseFormSetValue } from 'react-hook-form';
import type { Cupon } from '@/types/shop';
import type { OrderCreateFormData } from '../schema/orderCreateSchema';

interface CouponSectionProps {
    coupons: Cupon[];
    selectedCouponId?: number;
    setValue: UseFormSetValue<OrderCreateFormData>;
    isSubmitting: boolean;
}

export const CouponSection = ({
    coupons,
    selectedCouponId,
    setValue,
    isSubmitting,
}: CouponSectionProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Cupón de Descuento
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div>
                    <Label htmlFor="idCupon">Cupón (Opcional)</Label>
                    <Select
                        value={selectedCouponId?.toString()}
                        onValueChange={(value) => setValue('idCupon', Number(value))}
                        disabled={isSubmitting}
                    >
                        <SelectTrigger id="idCupon">
                            <SelectValue placeholder="Sin cupón" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">Sin cupón</SelectItem>
                            {coupons.map((coupon) => (
                                <SelectItem key={coupon.id} value={coupon.id.toString()}>
                                    {coupon.codigo} - {coupon.valorDescuento}
                                    {coupon.tipoDescuento === 'porcentaje' ? '%' : ' COP'} descuento
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
};

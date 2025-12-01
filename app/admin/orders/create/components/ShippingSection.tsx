import { Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import type { MetodoEnvio } from '@/types/shop';
import type { OrderCreateFormData } from '../schema/orderCreateSchema';

interface ShippingSectionProps {
    shippingMethods: MetodoEnvio[];
    selectedShippingId?: number;
    register: UseFormRegister<OrderCreateFormData>;
    setValue: UseFormSetValue<OrderCreateFormData>;
    isSubmitting: boolean;
}

export const ShippingSection = ({
    shippingMethods,
    selectedShippingId,
    register,
    setValue,
    isSubmitting,
}: ShippingSectionProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Información de Envío
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="idEnvio">Método de Envío</Label>
                        <Select
                            value={selectedShippingId?.toString()}
                            onValueChange={(value) => setValue('idEnvio', Number(value))}
                            disabled={isSubmitting}
                        >
                            <SelectTrigger id="idEnvio">
                                <SelectValue placeholder="Seleccione método" />
                            </SelectTrigger>
                            <SelectContent>
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
            </CardContent>
        </Card>
    );
};

import { User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import type { Cliente } from '@/types/shop';
import type { OrderCreateFormData } from '../schema/orderCreateSchema';

interface ClientInfoSectionProps {
    clients: Cliente[];
    selectedClientId?: number;
    register: UseFormRegister<OrderCreateFormData>;
    setValue: UseFormSetValue<OrderCreateFormData>;
    errors: any;
    isSubmitting: boolean;
}

export const ClientInfoSection = ({
    clients,
    selectedClientId,
    register,
    setValue,
    errors,
    isSubmitting,
}: ClientInfoSectionProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Información de la Entidad
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="idEntidad">Entidad *</Label>
                    <Select
                        value={selectedClientId?.toString()}
                        onValueChange={(value) => setValue('idEntidad', Number(value))}
                        disabled={isSubmitting}
                    >
                        <SelectTrigger id="idEntidad">
                            <SelectValue placeholder="Seleccione una entidad" />
                        </SelectTrigger>
                        <SelectContent>
                            {clients.map((client) => (
                                <SelectItem key={client.id} value={client.id.toString()}>
                                    {client.nombre} - {client.email}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.idEntidad && (
                        <p className="text-sm text-red-500 mt-1">{errors.idEntidad.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="direccionEnvio">Dirección de Envío</Label>
                    <Textarea
                        id="direccionEnvio"
                        {...register('direccionEnvio')}
                        placeholder="Dirección completa de envío..."
                        rows={2}
                        disabled={isSubmitting}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

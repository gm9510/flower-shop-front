import { UseFormRegister } from 'react-hook-form';
import { User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { OrderFormData } from '../schema/orderSchema';

interface ClientInfoSectionProps {
    idEntidad: number;
    register: UseFormRegister<OrderFormData>;
    isSubmitting: boolean;
}

export const ClientInfoSection = ({ idEntidad, register, isSubmitting }: ClientInfoSectionProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Información del Cliente
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label>Entidad</Label>
                    <div className="mt-1 p-3 bg-muted rounded-lg border">
                        <p className="font-medium">Entidad ID: {idEntidad}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        La entidad no puede ser modificada después de crear el pedido
                    </p>
                </div>

                <div>
                    <Label htmlFor="direccionEnvio">Dirección de Envío</Label>
                    <Textarea
                        id="direccionEnvio"
                        placeholder="Dirección completa de envío..."
                        rows={2}
                        {...register('direccionEnvio')}
                        disabled={isSubmitting}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

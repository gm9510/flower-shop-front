import React from 'react';
import { Badge } from '@/components/ui/badge';

export const getStatusBadge = (status: string, type: 'order' | 'payment'): React.ReactElement => {
    const variants: Record<string, { color: string; label: string }> = {
        // Order statuses
        pendiente: { color: 'bg-yellow-500', label: 'Pendiente' },
        procesando: { color: 'bg-blue-500', label: 'Procesando' },
        enviado: { color: 'bg-purple-500', label: 'Enviado' },
        entregado: { color: 'bg-green-500', label: 'Entregado' },
        cancelado: { color: 'bg-red-500', label: 'Cancelado' },
        // Payment statuses
        pagado: { color: 'bg-green-500', label: 'Pagado' },
        fallido: { color: 'bg-red-500', label: 'Fallido' },
        reembolsado: { color: 'bg-orange-500', label: 'Reembolsado' },
    };

    const config = variants[status] || { color: 'bg-gray-500', label: status };

    return (
        <Badge className={`${config.color} text-white`}>
            {config.label}
        </Badge>
    );
};

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

export const formatDate = (dateString?: string) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

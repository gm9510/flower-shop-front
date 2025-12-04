import * as z from 'zod';

export const orderSchema = z.object({
    numeroFactura: z.number().optional(),
    idEntidad: z.number(),
    subTotal: z.number().min(0, 'El subtotal debe ser mayor o igual a 0'),
    descuento: z.number().min(0, 'El descuento debe ser mayor o igual a 0').optional(),
    montoTotal: z.number().min(0.01, 'El monto debe ser mayor a 0'),
    saldo: z.number().optional(),
    estadoPedido: z
        .enum(['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'])
        .optional(),
    estadoPago: z.enum(['pendiente', 'pagado', 'fallido', 'reembolsado']).optional(),
    metodoPago: z.string().optional(),
    direccionEnvio: z.string().optional(),
    fechaEntrega: z.string().optional(),
    idCupon: z.number().optional().nullable(),
    idEnvio: z.number().optional().nullable(),
    efectivo: z.number().min(0).optional(),
    transferencia: z.number().min(0).optional(),
    usuario: z.string().optional(),
});

export type OrderFormData = z.infer<typeof orderSchema>;

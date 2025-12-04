import { useEffect } from "react";
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { OrderCreateFormData } from '../schema/orderCreateSchema';

export function useCashPayment(
    watch: UseFormWatch<OrderCreateFormData>,
    setValue: UseFormSetValue<OrderCreateFormData>,
) {
    const montoTotal = watch('montoTotal') || 0;
    const efectivo = watch('efectivo') || 0;
    useEffect(() => {
        const saldo = montoTotal - efectivo;
        setValue('saldo', saldo < 0 ? 0 : saldo);
    }, [montoTotal, efectivo, setValue]);
}  
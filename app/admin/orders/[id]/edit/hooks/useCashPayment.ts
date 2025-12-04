
import { useEffect } from "react";
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { OrderFormData } from '../schema/orderSchema';

export function useCashPayment(
    watch: UseFormWatch<OrderFormData>,
    setValue: UseFormSetValue<OrderFormData>,
) {
    const montoTotal = watch('montoTotal') || 0;
    const efectivo = watch('efectivo') || 0;

    useEffect(() => {
        const saldo = montoTotal - efectivo;
        setValue('saldo', saldo < 0 ? 0 : saldo);
    }, [montoTotal, efectivo, setValue]);
}
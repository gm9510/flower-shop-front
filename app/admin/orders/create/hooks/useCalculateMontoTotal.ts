import { useEffect } from 'react';
import { calculateCuponDescuento } from '@/helpers/useCupons';
import type { Cupon, MetodoEnvio } from '@/types/shop';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { OrderCreateFormData } from '../schema/orderCreateSchema';
import { PedidoDetalleCreate } from '@/services/api/order-items';
/**
 * Hook to automatically update the discount field in the create order form
 * when the coupon or subtotal changes.
 */
export function useCalculateMontoTotal({
  watch,
  setValue,
  cupons,
  orderItems,
  shippingMethods,
}: {
  watch: UseFormWatch<OrderCreateFormData>;
  setValue: UseFormSetValue<OrderCreateFormData>;
  cupons: Cupon[];
  orderItems: PedidoDetalleCreate[];
  shippingMethods: MetodoEnvio[];
}) {
  const subTotal = watch('subTotal');
  const cuponId = watch('idCupon');
  const idEnvio = watch('idEnvio') || 0;

  useEffect(() => {

    const shippingCost = shippingMethods.find(m => m.id === idEnvio)?.costo || 0;
    const cupon = cupons.find(c => c.id === cuponId) || null;
    const descuento = calculateCuponDescuento(subTotal || 0, cupon);
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.precioUnitario * item.cantidad,
      0
    );

    setValue('descuento', descuento);
    setValue('subTotal', subtotal);
    setValue('montoTotal', subtotal - descuento + shippingCost);
  }, [subTotal, cuponId, idEnvio, cupons, shippingMethods, orderItems, setValue]);

  return
}

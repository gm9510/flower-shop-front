import { useEffect } from 'react';
import { calculateCuponDescuento } from '@/helpers/useCupons';
import type { Cupon, MetodoEnvio } from '@/types/shop';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { OrderFormData } from '../schema/orderSchema';
import { PedidoDetalleCreate } from '@/services/api/order-items';

/**
 * Hook to automatically update the discount field in the edit order form
 * when the coupon or subtotal changes.
 */
export function useCalculateMontoTotal({
  watch,
  setValue,
  cupons,
  orderItems,
  shippingMethods,
}: {
  watch: UseFormWatch<OrderFormData>;
  setValue: UseFormSetValue<OrderFormData>;
  cupons: Cupon[];
  orderItems: PedidoDetalleCreate[];
  shippingMethods: MetodoEnvio[];
}) {

  const subTotal = watch('subTotal');
  const cuponId = watch('idCupon');
  const idEnvio = watch('idEnvio') || 0;
  useEffect(() => {

    const cupon = cupons.find(c => c.id === cuponId) || null;
    const shippingCost = shippingMethods.find(m => m.id === idEnvio)?.costo || 0;
    const descuento = calculateCuponDescuento(subTotal || 0, cupon);
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.precioUnitario * item.cantidad,
      0
    );

    setValue('descuento', descuento);
    setValue('subTotal', subtotal);
    setValue('montoTotal', subtotal - descuento + shippingCost);
  }, [subTotal, cuponId, idEnvio, orderItems, cupons, shippingMethods, setValue]);
}

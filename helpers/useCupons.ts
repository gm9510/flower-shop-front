import type { Cupon } from '@/types/shop';

export function calculateCuponDescuento(subtotal: number, cupon: Cupon | null): number {
  if (!cupon) return 0;
  if (cupon.tipoDescuento === 'porcentaje') {
    return Math.round((subtotal * cupon.valorDescuento) / 100);
  }
  if (cupon.tipoDescuento === 'monto_fijo') {
    return Math.round(cupon.valorDescuento);
  }
  return 0;
}

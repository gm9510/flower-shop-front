import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompraDetalleReturn } from '@/hooks/use-purchase';
import { Package } from 'lucide-react';
interface Props {
  compra: CompraDetalleReturn
}
export const PurchaseInfoSection = ({ compra }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Información del Compra
        </CardTitle>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                ID del Compra
              </label>
              <p className="mt-1 text-lg font-medium">#{compra.compra.id}</p>
            </div>
            {compra.compra.factura && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Número de Factura
                </label>
                <p className="mt-1 text-lg font-medium">{compra.compra.factura}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Subtotal
              </label>
              <p className="mt-1 text-lg font-semibold">
                {formatPrice(compra.compra.subTotal)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Descuento
              </label>
              <p className="mt-1 text-lg font-semibold text-red-600">
                -{formatPrice(compra?.compra?.descuento ?? 0)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Monto Total
              </label>
              <p className="mt-1 text-2xl font-bold text-green-600">
                {formatPrice(compra.compra.total)}
              </p>
            </div>
          </div>

          {compra.compra.metodoPago && (
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                Método de Pago
              </label>
              <p className="mt-1 text-lg capitalize">{compra.compra.metodoPago}</p>
            </div>
          )}

          {((compra.compra.efectivo && compra.compra.efectivo > 0) || (compra.compra.transferencia && compra.compra.transferencia > 0)) && (
            <div className="grid grid-cols-2 gap-4 pt-3 border-t">
              {compra.compra.efectivo && compra.compra.efectivo > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Efectivo
                  </label>
                  <p className="mt-1 text-lg font-semibold">
                    {formatPrice(compra.compra.efectivo)}
                  </p>
                </div>
              )}
              {compra.compra.transferencia && compra.compra.transferencia > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Transferencia
                  </label>
                  <p className="mt-1 text-lg font-semibold">
                    {formatPrice(compra.compra.transferencia)}
                  </p>
                </div>
              )}
            </div>
          )}

          {compra.compra.usuario && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Usuario
              </label>
              <p className="mt-1 text-lg">{compra.compra.usuario}</p>
            </div>
          )}
        </CardContent>
      </CardHeader>
    </Card>
  )
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

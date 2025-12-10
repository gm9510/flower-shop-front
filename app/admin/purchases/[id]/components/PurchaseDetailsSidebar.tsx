import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompraDetalleReturn } from '@/hooks/use-purchase';
interface Props {
  compra: CompraDetalleReturn
}

export const PurchaseDetailsSidebar = ({ compra }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">ID del Compra</span>
            <span className="font-medium">#{compra.compra.id}</span>
          </div>
          {compra.compra.factura && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Núm. Factura</span>
              <span className="font-medium">{compra.compra.factura}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Entidad ID</span>
            <span className="font-medium">#{compra.compra.idEntidad}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Productos</span>
            <Badge variant="secondary">{3}</Badge>
          </div>
          <div className="flex justify-between items-center pt-3 border-t">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatPrice(compra.compra.subTotal)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Descuento</span>
            <span className="font-medium text-red-600">
              -{formatPrice(compra.compra.descuento)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Monto Total</span>
            <span className="font-bold text-lg text-green-600">
              {formatPrice(compra.compra.total)}
            </span>
          </div>
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

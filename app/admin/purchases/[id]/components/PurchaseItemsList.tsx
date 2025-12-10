import { CompraDetalleReturn } from "@/hooks/use-purchase"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
interface Props {
  compra: CompraDetalleReturn
}
export const PurchaseItemsList = ({ compra }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Información del Compra
        </CardTitle>
        <CardContent>
          {
            compra.detalle.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay productos en este pedido
              </div>

            ) : (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                      <TableHead className="text-right">Precio Unit.</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {compra.detalle.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.product.nombre}</p>
                            <p className="text-sm text-muted-foreground">
                              ID: {item.product.id}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline">{item.cantidad}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(item.precioVenta)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatPrice(item.cantidad * item.precioVenta)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

            )
          }
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


'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { PedidosResponse } from '@/types/shop';

interface OrdersTableProps {
  title?: string;
  description?: string;
  orders?: PedidosResponse[];
  isLoading?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalResults?: number;
  onViewOrder?: (orderId: number) => void;
  onEditOrder?: (orderId: number) => void;
  onPageChange?: (page: number) => void;
}

export default function OrdersTable({
  title = "Lista de Pedidos",
  description = "Vista completa de todos los pedidos del sistema",
  orders = [],
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  totalResults = 0,
  onViewOrder,
  onEditOrder,
  onPageChange
}: OrdersTableProps) {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'entregado':
        return 'default';
      case 'enviado':
        return 'secondary';
      case 'procesando':
        return 'outline';
      case 'pendiente':
        return 'outline';
      case 'cancelado':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'entregado':
        return 'Entregado';
      case 'enviado':
        return 'Enviado';
      case 'procesando':
        return 'Procesando';
      case 'pendiente':
        return 'Pendiente';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getPaymentMethod = (index: number) => {
    return ['Tarjeta Crédito', 'Transferencia', 'Efectivo', 'Tarjeta Débito'][index % 4];
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CO')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido #</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado de Pedido</TableHead>
                <TableHead>Estado de Pago</TableHead>
                <TableHead className="text-right">Monto Total</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }, (_, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16 ml-auto"></div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <div className="h-8 bg-gray-200 rounded animate-pulse w-12"></div>
                        <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No se encontraron pedidos
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>Cliente {order.clienteId}</TableCell>
                    <TableCell>
                      {new Date(order.creadoEn).toLocaleDateString('es-CO')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.estadoPedido)}>
                        {getStatusLabel(order.estadoPedido)}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.estadoPago || 'No especificado'}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(order.montoTotal)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewOrder?.(order.id)}
                        >
                          Ver
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditOrder?.(order.id)}
                        >
                          Editar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Mostrando {orders.length > 0 ? ((currentPage - 1) * 10) + 1 : 0} a {Math.min(currentPage * 10, totalResults)} de {totalResults} resultados
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange?.(currentPage - 1)}
            >
              Anterior
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, currentPage - 2) + i;
              if (pageNum > totalPages) return null;
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange?.(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="px-2">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange?.(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange?.(currentPage + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PedidosResponse, EstadoPedido } from "@/types/shop";
import { orderService } from '@/services';

interface OrdersTableProps {
  orders?: PedidosResponse[];
  title?: string;
  showActions?: boolean;
  onOrderUpdate?: () => void;
}

// Mock data for fallback
const mockOrders: PedidosResponse[] = [];

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'entregado':
      return 'default'; // Green
    case 'enviado':
      return 'secondary'; // Blue
    case 'procesando':
      return 'outline'; // Yellow/Orange
    case 'cancelado':
      return 'destructive'; // Red
    case 'pendiente':
      return 'outline'; // Gray
    default:
      return 'outline';
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'entregado':
      return 'bg-green-100 text-green-800 hover:bg-green-100';
    case 'enviado':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    case 'procesando':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
    case 'cancelado':
      return 'bg-red-100 text-red-800 hover:bg-red-100';
    case 'pendiente':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'pendiente': 'Pendiente',
    'procesando': 'Procesando',
    'enviado': 'Enviado',
    'entregado': 'Entregado',
    'cancelado': 'Cancelado'
  };
  return labels[status.toLowerCase()] || status;
};

export default function OrdersTable({
  orders,
  title = "Pedidos Recientes",
  showActions = false,
  onOrderUpdate
}: OrdersTableProps) {
  const router = useRouter();
  const [loadingOrders, setLoadingOrders] = useState(!orders);
  const [ordersData, setOrdersData] = useState<PedidosResponse[]>(orders || []);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders if not provided as props
  useEffect(() => {
    if (!orders) {
      const fetchOrders = async () => {
        try {
          setLoadingOrders(true);
          setError(null);
          const fetchedOrders = await orderService.getRecentPedidos();
          setOrdersData(fetchedOrders);
        } catch (err: any) {
          console.error('Failed to fetch orders:', err);
          setError('Failed to load orders');
          // Fallback to mock data
          setOrdersData(mockOrders);
        } finally {
          setLoadingOrders(false);
        }
      };

      fetchOrders();
    }
  }, [orders]);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      const order = await orderService.getPedido(orderId);
      await orderService.updatePedido(orderId, { ...order, estadoPedido: newStatus as EstadoPedido });
      
      // Update local state
      setOrdersData(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, estadoPedido: newStatus as EstadoPedido }
            : order
        )
      );
      
      // Call parent callback if provided
      onOrderUpdate?.();
    } catch (err: any) {
      console.error('Failed to update order status:', err);
      setError('Failed to update order status');
    }
  };

  if (loadingOrders) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="p-8 text-center">
          <div className="text-gray-500">Cargando pedidos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Pedido #</TableHead>
              <TableHead>Cliente ID</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead className="text-center w-[120px]">Estado</TableHead>
              <TableHead className="text-center w-[100px]">Fecha</TableHead>
              {showActions && <TableHead className="text-right">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersData.map((order) => (
              <TableRow 
                key={order.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <TableCell className="font-medium text-gray-900">
                  #{order.id}
                </TableCell>
                <TableCell className="text-gray-700">
                  Cliente {order.idEntidad}
                </TableCell>
                <TableCell className="text-right font-semibold text-gray-900">
                  {formatCurrency(order.montoTotal)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant={getStatusVariant(order.estadoPedido)}
                    className={getStatusColor(order.estadoPedido)}
                  >
                    {getStatusLabel(order.estadoPedido)}
                  </Badge>
                </TableCell>
                <TableCell className="text-center text-sm text-gray-500">
                  {formatDate(order.registro || '')}
                </TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('View order:', order.id);
                        }}
                      >
                        Ver
                      </Button>
                      {order.estadoPedido === 'pendiente' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(order.id, 'procesando');
                          }}
                        >
                          Procesar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Show more link */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-blue-600 hover:text-blue-800"
          onClick={() => router.push('/admin/orders')}
        >
          Ver todos los pedidos →
        </Button>
      </div>
    </div>
  );
}
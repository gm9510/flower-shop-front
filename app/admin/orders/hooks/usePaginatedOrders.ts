import { useState, useEffect } from 'react';
import { orderService } from '@/services/api/orders';
import type { PedidosResponse, PaginatedPedidosResponse } from '@/types/shop';

interface UsePaginatedOrdersParams {
  page?: number;
  pageSize?: number;
  idEntidad?: number;
  estadoPedido?: string;
  estadoPago?: string;
  fechaEntregaDesde?: string;
  fechaEntregaHasta?: string;
}

interface UsePaginatedOrdersReturn {
  orders: PedidosResponse[];
  total: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  goToPage: (page: number) => void;
}

export const usePaginatedOrders = (
  params: UsePaginatedOrdersParams = {}
): UsePaginatedOrdersReturn => {
  const [orders, setOrders] = useState<PedidosResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(params.page || 1);
  const [pageSize, setPageSize] = useState(params.pageSize || 10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams: any = {
        page: currentPage,
        page_size: pageSize,
      };

      // Add optional filters
      if (params.idEntidad) {
        queryParams.idEntidad = params.idEntidad;
      }
      if (params.estadoPedido && params.estadoPedido !== 'all') {
        queryParams.estadoPedido = params.estadoPedido;
      }
      if (params.estadoPago && params.estadoPago !== 'all') {
        queryParams.estadoPago = params.estadoPago;
      }
      if (params.fechaEntregaDesde) {
        queryParams.fechaEntregaDesde = params.fechaEntregaDesde;
      }
      if (params.fechaEntregaHasta) {
        queryParams.fechaEntregaHasta = params.fechaEntregaHasta;
      }

      const response: PaginatedPedidosResponse = await orderService.getPedidosPaginated(queryParams);

      setOrders(response.items);
      setTotal(response.total);
      setCurrentPage(response.page);
      setPageSize(response.page_size);
      setTotalPages(response.total_pages);
    } catch (err) {
      console.error('Error fetching paginated orders:', err);
      setError('Error al cargar los pedidos. Por favor, intenta de nuevo.');
      setOrders([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [
    currentPage,
    pageSize,
    params.idEntidad,
    params.estadoPedido,
    params.estadoPago,
    params.fechaEntregaDesde,
    params.fechaEntregaHasta,
  ]);

  return {
    orders,
    total,
    currentPage,
    pageSize,
    totalPages,
    isLoading,
    error,
    refetch: fetchOrders,
    goToPage,
  };
};

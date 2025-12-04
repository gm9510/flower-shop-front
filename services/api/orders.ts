import { apiClient } from '@/lib/api';
import type { 
  PedidosResponse, 
  PedidosCreate, 
  PedidosUpdate,
  PaginatedPedidosResponse,
} from '@/types/shop';
import { EstadoPedido, EstadoPago } from '@/types/shop';

export const orderService = {
  // Get paginated orders with optional filtering
  async getPedidosPaginated(params?: {
    page?: number;
    page_size?: number;
    idEntidad?: number;
    estadoPedido?: string;
    estadoPago?: string;
    fechaEntregaDesde?: string; // ISO date string
    fechaEntregaHasta?: string; // ISO date string
  }): Promise<PaginatedPedidosResponse> {
    return apiClient.get<PaginatedPedidosResponse>('/api/pedidos/', params);
  },


  // Create a new order
  async createPedido(orderData: PedidosCreate): Promise<PedidosResponse> {
    return apiClient.post<PedidosResponse>('/api/pedidos/', orderData);
  },

  // Get single order by ID with detailed information
  async getPedido(pedidoId: number): Promise<PedidosResponse> {
    return apiClient.get<PedidosResponse>(`/api/pedidos/${pedidoId}`);
  },

  // Update an existing order
  async updatePedido(pedidoId: number, updates: PedidosUpdate): Promise<PedidosResponse> {
    return apiClient.put<PedidosResponse>(`/api/pedidos/${pedidoId}`, updates);
  },

  // Delete an order
  async deletePedido(pedidoId: number): Promise<void> {
    return apiClient.delete<void>(`/api/pedidos/${pedidoId}`);
  },

  // Get orders by entity ID (using filter)
  async getPedidosByEntidad(
    entidadId: number,
    params?: {
      skip?: number;
      limit?: number;
      estadoPedido?: string;
      estadoPago?: string;
    }
  ): Promise<PedidosResponse[]> {
    return this.getPedidosPaginated({ ...params, idEntidad: entidadId }).then(response => response.items);
  },

  // Helper methods for common operations
  
  // Get recent orders (last 10)
  async getRecentPedidos(): Promise<PedidosResponse[]> {
    return this.getPedidosPaginated({ page_size: 10, page: 1 }).then(response => response.items);
  },

  // Get orders by status
  async getPedidosByStatus(status: EstadoPedido): Promise<PedidosResponse[]> {
    return this.getPedidosPaginated({ estadoPedido: status }).then(response => response.items);
  },

  // Get paid orders
  async getPaidPedidos(): Promise<PedidosResponse[]> {
    return this.getPedidosPaginated({ estadoPago: EstadoPago.PAGADO }).then(response => response.items);
  },

  // Get pending orders
  async getPendingPedidos(): Promise<PedidosResponse[]> {
    return this.getPedidosPaginated({ estadoPedido: EstadoPedido.PENDIENTE }).then(response => response.items);
  },

  // Update order to processing status
  async markAsProcessing(pedidoId: number): Promise<PedidosResponse> {
    return this.updatePedido(pedidoId, { estadoPedido: EstadoPedido.PROCESANDO });
  },

  // Update order to shipped status
  async markAsShipped(pedidoId: number): Promise<PedidosResponse> {
    return this.updatePedido(pedidoId, { estadoPedido: EstadoPedido.ENVIADO });
  },

  // Update order to delivered status
  async markAsDelivered(pedidoId: number): Promise<PedidosResponse> {
    return this.updatePedido(pedidoId, { estadoPedido: EstadoPedido.ENTREGADO });
  },

  // Cancel order
  async cancelPedido(pedidoId: number): Promise<PedidosResponse> {
    return this.updatePedido(pedidoId, { estadoPedido: EstadoPedido.CANCELADO });
  },

  // Mark payment as paid
  async markPaymentAsPaid(pedidoId: number): Promise<PedidosResponse> {
    return this.updatePedido(pedidoId, { estadoPago: EstadoPago.PAGADO });
  },

  // Mark payment as failed
  async markPaymentAsFailed(pedidoId: number): Promise<PedidosResponse> {
    return this.updatePedido(pedidoId, { estadoPago: EstadoPago.FALLIDO });
  },
};
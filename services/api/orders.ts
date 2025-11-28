import { apiClient } from '@/lib/api';
import type { 
  PedidosResponse, 
  PedidosCreate, 
  PedidosUpdate,
  PedidosDetail,
} from '@/types/shop';
import { EstadoPedido, EstadoPago } from '@/types/shop';

export const orderService = {
  // Get all orders with optional filtering and pagination
  async getPedidos(params?: {
    skip?: number;
    limit?: number;
    idEntidad?: number;
    estadoPedido?: string;
    estadoPago?: string;
    fechaEntregaDesde?: string; // ISO date string
    fechaEntregaHasta?: string; // ISO date string
  }): Promise<PedidosResponse[]> {
    return apiClient.get<PedidosResponse[]>('/api/pedidos/', params);
  },

  // Create a new order
  async createPedido(orderData: PedidosCreate): Promise<PedidosResponse> {
    return apiClient.post<PedidosResponse>('/api/pedidos/', orderData);
  },

  // Get single order by ID with detailed information
  async getPedido(pedidoId: number): Promise<PedidosDetail> {
    return apiClient.get<PedidosDetail>(`/api/pedidos/${pedidoId}`);
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
    return this.getPedidos({ ...params, idEntidad: entidadId });
  },

  // Helper methods for common operations
  
  // Get recent orders (last 10)
  async getRecentPedidos(): Promise<PedidosResponse[]> {
    return this.getPedidos({ limit: 10, skip: 0 });
  },

  // Get orders by status
  async getPedidosByStatus(status: EstadoPedido): Promise<PedidosResponse[]> {
    return this.getPedidos({ estadoPedido: status });
  },

  // Get paid orders
  async getPaidPedidos(): Promise<PedidosResponse[]> {
    return this.getPedidos({ estadoPago: EstadoPago.PAGADO });
  },

  // Get pending orders
  async getPendingPedidos(): Promise<PedidosResponse[]> {
    return this.getPedidos({ estadoPedido: EstadoPedido.PENDIENTE });
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
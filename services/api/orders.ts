import { apiClient } from '@/lib/api';
import type { 
  PedidosResponse, 
  PedidosDetail, 
  PedidosCreate, 
  PedidosUpdate,
  PedidosStats
} from '@/types/shop';

export const orderService = {
  // Get all orders with optional filtering and pagination
  async getPedidos(params?: {
    skip?: number;
    limit?: number;
    cliente_id?: number;
    estado_pedido?: string;
    estado_pago?: string;
  }): Promise<PedidosResponse[]> {
    return apiClient.get<PedidosResponse[]>('/pedidos', params);
  },

  // Create a new order
  async createPedido(orderData: PedidosCreate): Promise<PedidosResponse> {
    return apiClient.post<PedidosResponse>('/pedidos', orderData);
  },

  // Get single order by ID with detailed information
  async getPedido(pedidoId: number): Promise<PedidosDetail> {
    return apiClient.get<PedidosDetail>(`/pedidos/${pedidoId}`);
  },

  // Update an existing order
  async updatePedido(pedidoId: number, updates: PedidosUpdate): Promise<PedidosResponse> {
    return apiClient.put<PedidosResponse>(`/pedidos/${pedidoId}`, updates);
  },

  // Delete an order
  async deletePedido(pedidoId: number): Promise<void> {
    return apiClient.delete<void>(`/pedidos/${pedidoId}`);
  },

  // Update order status only (specialized endpoint)
  async updatePedidoEstado(
    pedidoId: number, 
    params?: {
      estado_pedido?: string;
      estado_pago?: string;
    }
  ): Promise<PedidosResponse> {
    const queryParams = new URLSearchParams();
    if (params?.estado_pedido) {
      queryParams.append('estado_pedido', params.estado_pedido);
    }
    if (params?.estado_pago) {
      queryParams.append('estado_pago', params.estado_pago);
    }
    
    const url = `/pedidos/${pedidoId}/estado${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.patch<PedidosResponse>(url);
  },

  // Get orders by customer ID
  async getPedidosByCliente(
    clienteId: number,
    params?: {
      skip?: number;
      limit?: number;
      estado_pedido?: string;
      estado_pago?: string;
    }
  ): Promise<PedidosResponse[]> {
    return apiClient.get<PedidosResponse[]>(`/pedidos/cliente/${clienteId}`, params);
  },

  // Get order statistics
  async getPedidosStats(): Promise<PedidosStats> {
    return apiClient.get<PedidosStats>('/pedidos/stats/resumen');
  },

  // Helper methods for common operations
  
  // Get recent orders (last 10)
  async getRecentPedidos(): Promise<PedidosResponse[]> {
    return this.getPedidos({ limit: 10, skip: 0 });
  },

  // Get orders by status
  async getPedidosByStatus(status: string): Promise<PedidosResponse[]> {
    return this.getPedidos({ estado_pedido: status });
  },

  // Get paid orders
  async getPaidPedidos(): Promise<PedidosResponse[]> {
    return this.getPedidos({ estado_pago: 'pagado' });
  },

  // Get pending orders
  async getPendingPedidos(): Promise<PedidosResponse[]> {
    return this.getPedidos({ estado_pedido: 'pendiente' });
  },

  // Update order to processing status
  async markAsProcessing(pedidoId: number): Promise<PedidosResponse> {
    return this.updatePedidoEstado(pedidoId, { estado_pedido: 'procesando' });
  },

  // Update order to shipped status
  async markAsShipped(pedidoId: number): Promise<PedidosResponse> {
    return this.updatePedidoEstado(pedidoId, { estado_pedido: 'enviado' });
  },

  // Update order to delivered status
  async markAsDelivered(pedidoId: number): Promise<PedidosResponse> {
    return this.updatePedidoEstado(pedidoId, { estado_pedido: 'entregado' });
  },

  // Cancel order
  async cancelPedido(pedidoId: number): Promise<PedidosResponse> {
    return this.updatePedidoEstado(pedidoId, { estado_pedido: 'cancelado' });
  },

  // Mark payment as paid
  async markPaymentAsPaid(pedidoId: number): Promise<PedidosResponse> {
    return this.updatePedidoEstado(pedidoId, { estado_pago: 'pagado' });
  },

  // Mark payment as failed
  async markPaymentAsFailed(pedidoId: number): Promise<PedidosResponse> {
    return this.updatePedidoEstado(pedidoId, { estado_pago: 'fallido' });
  },
};
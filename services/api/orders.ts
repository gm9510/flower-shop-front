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
    fecha_envio_desde?: string; // ISO date string
    fecha_envio_hasta?: string; // ISO date string
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

  // Get orders by customer ID (using filter)
  async getPedidosByCliente(
    clienteId: number,
    params?: {
      skip?: number;
      limit?: number;
      estado_pedido?: string;
      estado_pago?: string;
    }
  ): Promise<PedidosResponse[]> {
    return this.getPedidos({ ...params, cliente_id: clienteId });
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
    const pedido = await this.getPedido(pedidoId);
    return this.updatePedido(pedidoId, { ...pedido, estadoPedido: 'procesando' });
  },

  // Update order to shipped status
  async markAsShipped(pedidoId: number): Promise<PedidosResponse> {
    const pedido = await this.getPedido(pedidoId);
    return this.updatePedido(pedidoId, { ...pedido, estadoPedido: 'enviado' });
  },

  // Update order to delivered status
  async markAsDelivered(pedidoId: number): Promise<PedidosResponse> {
    const pedido = await this.getPedido(pedidoId);
    return this.updatePedido(pedidoId, { ...pedido, estadoPedido: 'entregado' });
  },

  // Cancel order
  async cancelPedido(pedidoId: number): Promise<PedidosResponse> {
    const pedido = await this.getPedido(pedidoId);
    return this.updatePedido(pedidoId, { ...pedido, estadoPedido: 'cancelado' });
  },

  // Mark payment as paid
  async markPaymentAsPaid(pedidoId: number): Promise<PedidosResponse> {
    const pedido = await this.getPedido(pedidoId);
    return this.updatePedido(pedidoId, { ...pedido, estadoPago: 'pagado' });
  },

  // Mark payment as failed
  async markPaymentAsFailed(pedidoId: number): Promise<PedidosResponse> {
    const pedido = await this.getPedido(pedidoId);
    return this.updatePedido(pedidoId, { ...pedido, estadoPago: 'fallido' });
  },
};
import { apiClient } from '@/lib/api';

// Order Item (PedidoDetalle) Types
export interface PedidoDetalle {
  id: number;
  pedidoId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface PedidoDetalleCreate {
  pedidoId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface PedidoDetalleUpdate {
  cantidad?: number;
  precioUnitario?: number;
  subtotal?: number;
}

export const orderItemService = {
  // Get all order items with optional filtering
  async getPedidoDetalles(params?: {
    skip?: number;
    limit?: number;
    pedido_id?: number;
    producto_id?: number;
  }): Promise<PedidoDetalle[]> {
    return apiClient.get<PedidoDetalle[]>('/api/pedidodetalles/', params);
  },

  // Create new order item
  async createPedidoDetalle(itemData: PedidoDetalleCreate): Promise<PedidoDetalle> {
    return apiClient.post<PedidoDetalle>('/api/pedidodetalles/', itemData);
  },

  // Get single order item by ID
  async getPedidoDetalle(id: number): Promise<PedidoDetalle> {
    return apiClient.get<PedidoDetalle>(`/api/pedidodetalles/${id}`);
  },

  // Update order item
  async updatePedidoDetalle(id: number, updates: PedidoDetalleUpdate): Promise<PedidoDetalle> {
    return apiClient.put<PedidoDetalle>(`/api/pedidodetalles/${id}`, updates);
  },

  // Delete order item
  async deletePedidoDetalle(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/pedidodetalles/${id}`);
  },

  // Get all items for a specific order
  async getItemsByPedido(pedidoId: number): Promise<PedidoDetalle[]> {
    return this.getPedidoDetalles({ pedido_id: pedidoId });
  },
};

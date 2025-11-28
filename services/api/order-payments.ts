import { apiClient } from '@/lib/api';

// Order Payment (PedidoPago) Types
export interface PedidoPago {
  id: number;
  pedidoId: number;
  monto: number;
  fechaPago: string;
  metodoPago: string;
  estadoPago: string;
  referencia?: string;
}

export interface PedidoPagoCreate {
  pedidoId: number;
  monto: number;
  fechaPago: string;
  metodoPago: string;
  estadoPago?: string;
  referencia?: string;
}

export interface PedidoPagoUpdate {
  monto?: number;
  fechaPago?: string;
  metodoPago?: string;
  estadoPago?: string;
  referencia?: string;
}

export const orderPaymentService = {
  // Get all order payments
  async getPedidoPagos(params?: {
    skip?: number;
    limit?: number;
    pedido_id?: number;
    estado_pago?: string;
    metodo_pago?: string;
  }): Promise<PedidoPago[]> {
    return apiClient.get<PedidoPago[]>('/api/pedidopagos/', params);
  },

  // Create new order payment
  async createPedidoPago(paymentData: PedidoPagoCreate): Promise<PedidoPago> {
    return apiClient.post<PedidoPago>('/api/pedidopagos/', paymentData);
  },

  // Get single order payment by ID
  async getPedidoPago(id: number): Promise<PedidoPago> {
    return apiClient.get<PedidoPago>(`/api/pedidopagos/${id}`);
  },

  // Update order payment
  async updatePedidoPago(id: number, updates: PedidoPagoUpdate): Promise<PedidoPago> {
    return apiClient.put<PedidoPago>(`/api/pedidopagos/${id}`, updates);
  },

  // Delete order payment
  async deletePedidoPago(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/pedidopagos/${id}`);
  },

  // Get payments for a specific order
  async getPaymentsByPedido(pedidoId: number): Promise<PedidoPago[]> {
    return this.getPedidoPagos({ pedido_id: pedidoId });
  },
};

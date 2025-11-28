import { apiClient } from '@/lib/api';
import type { Cliente, ClienteCreate } from '@/types/shop';

export const clientService = {
  // Get all clients
  async getClientes(params?: {
    skip?: number;
    limit?: number;
    nombre?: string;
    email?: string;
  }): Promise<Cliente[]> {
    return apiClient.get<Cliente[]>('/api/entidades/', params);
  },

  // Create new client
  async createCliente(clientData: ClienteCreate): Promise<Cliente> {
    return apiClient.post<Cliente>('/api/entidades/', clientData);
  },

  // Get single client by ID
  async getCliente(id: number): Promise<Cliente> {
    return apiClient.get<Cliente>(`/api/entidades/${id}`);
  },

  // Update client
  async updateCliente(id: number, updates: Partial<ClienteCreate>): Promise<Cliente> {
    return apiClient.put<Cliente>(`/api/entidades/${id}`, updates);
  },

  // Delete client
  async deleteCliente(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/entidades/${id}`);
  },

  // Search clients by email
  async findByEmail(email: string): Promise<Cliente | null> {
    const clients = await this.getClientes({ email });
    return clients.length > 0 ? clients[0] : null;
  },

  // Get client orders (using order service)
  async getClientOrders(clienteId: number) {
    // This would use the orderService.getPedidosByCliente method
    const { orderService } = await import('./orders');
    return orderService.getPedidosByCliente(clienteId);
  },
};
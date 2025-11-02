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
    return apiClient.get<Cliente[]>('/clientes', params);
  },

  // Create new client
  async createCliente(clientData: ClienteCreate): Promise<Cliente> {
    return apiClient.post<Cliente>('/clientes', clientData);
  },

  // Get single client by ID (assuming endpoint exists)
  async getCliente(id: number): Promise<Cliente> {
    return apiClient.get<Cliente>(`/clientes/${id}`);
  },

  // Update client (assuming endpoint exists)
  async updateCliente(id: number, updates: Partial<ClienteCreate>): Promise<Cliente> {
    return apiClient.put<Cliente>(`/clientes/${id}`, updates);
  },

  // Delete client (assuming endpoint exists)
  async deleteCliente(id: number): Promise<void> {
    return apiClient.delete<void>(`/clientes/${id}`);
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
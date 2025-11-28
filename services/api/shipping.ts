import { apiClient } from '@/lib/api';
import type { MetodoEnvio } from '@/types/shop';

export const shippingService = {
  // Get all shipping methods
  async getMetodosEnvio(params?: {
    skip?: number;
    limit?: number;
    nombre?: string;
  }): Promise<MetodoEnvio[]> {
    return apiClient.get<MetodoEnvio[]>('/api/pedidoenvios/', params);
  },

  // Create new shipping method
  async createMetodoEnvio(shippingData: Omit<MetodoEnvio, 'id'>): Promise<MetodoEnvio> {
    return apiClient.post<MetodoEnvio>('/api/pedidoenvios/', shippingData);
  },

  // Get single shipping method by ID
  async getMetodoEnvio(id: number): Promise<MetodoEnvio> {
    return apiClient.get<MetodoEnvio>(`/api/pedidoenvios/${id}`);
  },

  // Update shipping method
  async updateMetodoEnvio(id: number, updates: Partial<MetodoEnvio>): Promise<MetodoEnvio> {
    return apiClient.put<MetodoEnvio>(`/api/pedidoenvios/${id}`, updates);
  },

  // Delete shipping method
  async deleteMetodoEnvio(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/pedidoenvios/${id}`);
  },

};
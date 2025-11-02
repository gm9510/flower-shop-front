import { apiClient } from '@/lib/api';
import type { MetodoEnvio } from '@/types/shop';

export const shippingService = {
  // Get all shipping methods
  async getMetodosEnvio(params?: {
    skip?: number;
    limit?: number;
    nombre?: string;
  }): Promise<MetodoEnvio[]> {
    return apiClient.get<MetodoEnvio[]>('/metodos-envio', params);
  },

  // Create new shipping method
  async createMetodoEnvio(shippingData: Omit<MetodoEnvio, 'id'>): Promise<MetodoEnvio> {
    return apiClient.post<MetodoEnvio>('/metodos-envio', shippingData);
  },

  // Get single shipping method by ID
  async getMetodoEnvio(id: number): Promise<MetodoEnvio> {
    return apiClient.get<MetodoEnvio>(`/metodos-envio/${id}`);
  },

  // Update shipping method
  async updateMetodoEnvio(id: number, updates: Partial<MetodoEnvio>): Promise<MetodoEnvio> {
    return apiClient.put<MetodoEnvio>(`/metodos-envio/${id}`, updates);
  },

  // Delete shipping method
  async deleteMetodoEnvio(id: number): Promise<void> {
    return apiClient.delete<void>(`/metodos-envio/${id}`);
  },

  // Get shipping methods by cost range
  async getByCostRange(minCost?: number, maxCost?: number): Promise<MetodoEnvio[]> {
    const params: any = {};
    if (minCost !== undefined) params.min_costo = minCost;
    if (maxCost !== undefined) params.max_costo = maxCost;
    return apiClient.get<MetodoEnvio[]>('/metodos-envio/costo', params);
  },
};
import { apiClient } from '@/lib/api';
import type { Cupon, MetodoEnvio } from '@/types/shop';

export const couponService = {
  // Get all coupons
  async getCupones(params?: {
    skip?: number;
    limit?: number;
    activo?: boolean;
    codigo?: string;
  }): Promise<Cupon[]> {
    return apiClient.get<Cupon[]>('/api/pedidocupones/', params);
  },

  // Get active coupons only
  async getActiveCupones(): Promise<Cupon[]> {
    return this.getCupones({ activo: true });
  },

  // Create new coupon
  async createCupon(couponData: Omit<Cupon, 'id' | 'creadoEn'>): Promise<Cupon> {
    return apiClient.post<Cupon>('/api/pedidocupones/', couponData);
  },

  // Get single coupon by ID
  async getCupon(id: number): Promise<Cupon> {
    return apiClient.get<Cupon>(`/api/pedidocupones/${id}`);
  },

  // Update coupon
  async updateCupon(id: number, updates: Partial<Cupon>): Promise<Cupon> {
    return apiClient.put<Cupon>(`/api/pedidocupones/${id}`, updates);
  },

  // Delete coupon
  async deleteCupon(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/pedidocupones/${id}`);
  },

  // Validate coupon code
  async validateCupon(codigo: string): Promise<Cupon | null> {
    const coupons = await this.getCupones({ codigo, activo: true });
    return coupons.length > 0 ? coupons[0] : null;
  },
};
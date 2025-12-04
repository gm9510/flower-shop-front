import { apiClient } from '@/lib/api';
import type { Cupon, CuponCreate, CuponUpdate } from '@/types/shop';

export const couponService = {
  // Get all coupons
  async getCupones(params?: {
    skip?: number;
    limit?: number;
    code?: string;
    active?: boolean;
  }): Promise<Cupon[]> {
    return apiClient.get<Cupon[]>('/api/pedidocupones/', params);
  },

  // Get active coupons only
  async getActiveCupones(): Promise<Cupon[]> {
    return this.getCupones({ active: true });
  },

  // Create new coupon
  async createCupon(couponData: CuponCreate): Promise<Cupon> {
    return apiClient.post<Cupon>('/api/pedidocupones/', couponData);
  },

  // Get single coupon by ID
  async getCupon(id: number): Promise<Cupon> {
    return apiClient.get<Cupon>(`/api/pedidocupones/${id}`);
  },

  // Update coupon
  async updateCupon(id: number, updates: CuponUpdate): Promise<Cupon> {
    return apiClient.put<Cupon>(`/api/pedidocupones/${id}`, updates);
  },

  // Delete coupon
  async deleteCupon(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/pedidocupones/${id}`);
  },

  // Validate coupon code (checks if code exists and is currently valid)
  async validateCupon(codigo: string): Promise<Cupon | null> {
    const coupons = await this.getCupones({ code: codigo, active: true });
    return coupons.length > 0 ? coupons[0] : null;
  },
};
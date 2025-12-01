import { apiClient } from '@/lib/api';
import type { Cupon, CuponCreate, CuponUpdate } from '@/types/shop';

export const couponService = {
  // Get all coupons
  async getCupones(params?: {
    skip?: number;
    limit?: number;
    codigo?: string;
  }): Promise<Cupon[]> {
    return apiClient.get<Cupon[]>('/api/pedidocupones/', params);
  },

  // Get active coupons only (validates date range)
  async getActiveCupones(): Promise<Cupon[]> {
    const allCoupons = await this.getCupones();
    const now = new Date().toISOString();
    return allCoupons.filter(
      (cupon) => {
        // Check date validity if dates are provided
        const dateValid = !cupon.validoDesde || !cupon.validoHasta || 
          (cupon.validoDesde <= now && cupon.validoHasta >= now);
        // Check usage limit if provided
        const usageValid = cupon.limiteUso === undefined || cupon.limiteUso > 0;
        return dateValid && usageValid;
      }
    );
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
    const coupons = await this.getCupones({ codigo });
    if (coupons.length === 0) return null;

    const cupon = coupons[0];
    const now = new Date().toISOString();

    // Check if coupon is within valid date range (if dates are provided)
    const dateValid = !cupon.validoDesde || !cupon.validoHasta ||
      (cupon.validoDesde <= now && cupon.validoHasta >= now);
    
    // Check if coupon has uses remaining (if limit is provided)
    const usageValid = cupon.limiteUso === undefined || cupon.limiteUso > 0;

    if (dateValid && usageValid) {
      return cupon;
    }

    return null;
  },
};
import { apiClient } from '@/lib/api';
import type { ProductoEnsamble, ProductoEnsambleCreate, ProductoEnsambleUpdate } from '@/types/shop';

export const productAssemblyService = {
  // Get all product assemblies
  async getProductoEnsambles(params?: {
    skip?: number;
    limit?: number;
    idProductoPadre?: number;
    idProductoHijo?: number;
  }): Promise<ProductoEnsamble[]> {
    return apiClient.get<ProductoEnsamble[]>('/api/productoensambles/', params);
  },

  // Create new product assembly
  async createProductoEnsamble(assemblyData: ProductoEnsambleCreate): Promise<ProductoEnsamble> {
    return apiClient.post<ProductoEnsamble>('/api/productoensambles/', assemblyData);
  },

  // Get single product assembly by ID
  async getProductoEnsamble(id: number): Promise<ProductoEnsamble> {
    return apiClient.get<ProductoEnsamble>(`/api/productoensambles/${id}`);
  },

  // Update product assembly
  async updateProductoEnsamble(id: number, updates: ProductoEnsambleUpdate): Promise<ProductoEnsamble> {
    return apiClient.put<ProductoEnsamble>(`/api/productoensambles/${id}`, updates);
  },

  // Update product assembly quantity (PATCH)
  async updateProductoEnsambleCantidad(id: number, cantidad: number): Promise<ProductoEnsamble> {
    return apiClient.patch<ProductoEnsamble>(`/api/productoensambles/${id}/cantidad?cantidad=${cantidad}`);
  },

  // Delete product assembly
  async deleteProductoEnsamble(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/productoensambles/${id}`);
  },

  // Get components for an assembled product (children)
  async getComponentsByEnsamble(parentId: number): Promise<ProductoEnsamble[]> {
    return this.getProductoEnsambles({ idProductoPadre: parentId });
  },

  // Get assemblies that use a specific component (parents)
  async getEnsamblesByComponente(childId: number): Promise<ProductoEnsamble[]> {
    return this.getProductoEnsambles({ idProductoHijo: childId });
  },
};

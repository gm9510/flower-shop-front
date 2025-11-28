import { apiClient } from '@/lib/api';

// Product Assembly (ProductoEnsamble) Types
export interface ProductoEnsamble {
  id: number;
  productoEnsambleId: number;
  productoComponenteId: number;
  cantidad: number;
}

export interface ProductoEnsambleCreate {
  productoEnsambleId: number;
  productoComponenteId: number;
  cantidad: number;
}

export interface ProductoEnsambleUpdate {
  cantidad?: number;
}

export const productAssemblyService = {
  // Get all product assemblies
  async getProductoEnsambles(params?: {
    skip?: number;
    limit?: number;
    producto_ensamble_id?: number;
    producto_componente_id?: number;
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

  // Delete product assembly
  async deleteProductoEnsamble(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/productoensambles/${id}`);
  },

  // Get components for an assembled product
  async getComponentsByEnsamble(ensambleId: number): Promise<ProductoEnsamble[]> {
    return this.getProductoEnsambles({ producto_ensamble_id: ensambleId });
  },

  // Get assemblies that use a specific component
  async getEnsamblesByComponente(componenteId: number): Promise<ProductoEnsamble[]> {
    return this.getProductoEnsambles({ producto_componente_id: componenteId });
  },
};

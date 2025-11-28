import { apiClient } from '@/lib/api';

// Cart (Carrito) Types
export interface Carrito {
  id: number;
  entidadId: number;
  creadoEn: string;
  actualizadoEn?: string;
}

export interface CarritoCreate {
  entidadId: number;
}

export interface CarritoUpdate {
  entidadId?: number;
}

// Cart Item (CarritoDetalle) Types
export interface CarritoDetalle {
  id: number;
  carritoId: number;
  productoId: number;
  cantidad: number;
  agregadoEn: string;
}

export interface CarritoDetalleCreate {
  carritoId: number;
  productoId: number;
  cantidad: number;
}

export interface CarritoDetalleUpdate {
  cantidad?: number;
}

export const cartService = {
  // Get all carts
  async getCarritos(params?: {
    skip?: number;
    limit?: number;
    entidad_id?: number;
  }): Promise<Carrito[]> {
    return apiClient.get<Carrito[]>('/api/carritos/', params);
  },

  // Create new cart
  async createCarrito(cartData: CarritoCreate): Promise<Carrito> {
    return apiClient.post<Carrito>('/api/carritos/', cartData);
  },

  // Get single cart by ID
  async getCarrito(id: number): Promise<Carrito> {
    return apiClient.get<Carrito>(`/api/carritos/${id}`);
  },

  // Update cart
  async updateCarrito(id: number, updates: CarritoUpdate): Promise<Carrito> {
    return apiClient.put<Carrito>(`/api/carritos/${id}`, updates);
  },

  // Delete cart
  async deleteCarrito(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/carritos/${id}`);
  },

  // Get cart by entity ID
  async getCarritoByEntidad(entidadId: number): Promise<Carrito | null> {
    const carts = await this.getCarritos({ entidad_id: entidadId, limit: 1 });
    return carts.length > 0 ? carts[0] : null;
  },
};

export const cartItemService = {
  // Get all cart items
  async getCarritoDetalles(params?: {
    skip?: number;
    limit?: number;
    carrito_id?: number;
    producto_id?: number;
  }): Promise<CarritoDetalle[]> {
    return apiClient.get<CarritoDetalle[]>('/api/carritodetalles/', params);
  },

  // Create new cart item
  async createCarritoDetalle(itemData: CarritoDetalleCreate): Promise<CarritoDetalle> {
    return apiClient.post<CarritoDetalle>('/api/carritodetalles/', itemData);
  },

  // Get single cart item by ID
  async getCarritoDetalle(id: number): Promise<CarritoDetalle> {
    return apiClient.get<CarritoDetalle>(`/api/carritodetalles/${id}`);
  },

  // Update cart item
  async updateCarritoDetalle(id: number, updates: CarritoDetalleUpdate): Promise<CarritoDetalle> {
    return apiClient.put<CarritoDetalle>(`/api/carritodetalles/${id}`, updates);
  },

  // Delete cart item
  async deleteCarritoDetalle(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/carritodetalles/${id}`);
  },

  // Get all items for a specific cart
  async getItemsByCarrito(carritoId: number): Promise<CarritoDetalle[]> {
    return this.getCarritoDetalles({ carrito_id: carritoId });
  },
};

import { apiClient } from '@/lib/api';

// Purchase (Compra) Types
export interface Compra {
  id: number;
  idEntidad: number;
  factura: string;
  subTotal: number;
  descuento: number;
  total: number;
  saldo: number;
  metodoPago: string;
  fechaLimite: string | null;
  efectivo: number | null;
  transferencia: number | null;
  observacion: string | null;
  usuario: string;
  registro: string; // fecha de registro
}

export interface CompraCreate {
  proveedorId: number;
  numeroFactura?: string;
  fechaCompra: string;
  montoTotal: number;
  estadoPago?: string;
}

export interface CompraUpdate {
  proveedorId?: number;
  numeroFactura?: string;
  fechaCompra?: string;
  montoTotal?: number;
  estadoPago?: string;
}

// Purchase Detail (CompraDetalle) Types
export interface CompraDetalle {
  id: number;
  idCompra: number;
  idProducto: number;
  cantidad: number;
  costo: number;
  costoIva: number;
  iva: number;
  precioVenta: number;
  totalUnitario: number;
}

export interface CompraDetalleCreate {
  compraId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface CompraDetalleUpdate {
  cantidad?: number;
  precioUnitario?: number;
  subtotal?: number;
}

// Purchase Payment (CompraAbono) Types
export interface CompraAbono {
  id: number;
  compraId: number;
  monto: number;
  fechaAbono: string;
  metodoPago?: string;
  referencia?: string;
}

export interface CompraAbonoCreate {
  compraId: number;
  monto: number;
  fechaAbono: string;
  metodoPago?: string;
  referencia?: string;
}

export interface CompraAbonoUpdate {
  monto?: number;
  fechaAbono?: string;
  metodoPago?: string;
  referencia?: string;
}

export const purchaseService = {
  // Get all purchases
  async getCompras(params?: {
    skip?: number;
    limit?: number;
    proveedor_id?: number;
    estado_pago?: string;
  }): Promise<Compra[]> {
    return apiClient.get<Compra[]>('/api/compras/', params);
  },

  // Create new purchase
  async createCompra(purchaseData: CompraCreate): Promise<Compra> {
    return apiClient.post<Compra>('/api/compras/', purchaseData);
  },

  // Get single purchase by ID
  async getCompra(id: number): Promise<Compra> {
    return apiClient.get<Compra>(`/api/compras/${id}`);
  },

  // Update purchase
  async updateCompra(id: number, updates: CompraUpdate): Promise<Compra> {
    return apiClient.put<Compra>(`/api/compras/${id}`, updates);
  },

  // Delete purchase
  async deleteCompra(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/compras/${id}`);
  },
};

export const purchaseDetailService = {
  // Get all purchase details
  async getCompraDetalles(params?: {
    skip?: number;
    limit?: number;
    compra_id?: number;
    producto_id?: number;
  }): Promise<CompraDetalle[]> {
    return apiClient.get<CompraDetalle[]>('/api/compradetalles/', params);
  },

  // Create new purchase detail
  async createCompraDetalle(detailData: CompraDetalleCreate): Promise<CompraDetalle> {
    return apiClient.post<CompraDetalle>('/api/compradetalles/', detailData);
  },

  // Get single purchase detail by ID
  async getCompraDetalle(id: number): Promise<CompraDetalle> {
    return apiClient.get<CompraDetalle>(`/api/compradetalles/${id}`);
  },

  // Update purchase detail
  async updateCompraDetalle(id: number, updates: CompraDetalleUpdate): Promise<CompraDetalle> {
    return apiClient.put<CompraDetalle>(`/api/compradetalles/${id}`, updates);
  },

  // Delete purchase detail
  async deleteCompraDetalle(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/compradetalles/${id}`);
  },
};

export const purchasePaymentService = {
  // Get all purchase payments
  async getCompraAbonos(params?: {
    skip?: number;
    limit?: number;
    compra_id?: number;
  }): Promise<CompraAbono[]> {
    return apiClient.get<CompraAbono[]>('/api/compraabonos/', params);
  },

  // Create new purchase payment
  async createCompraAbono(paymentData: CompraAbonoCreate): Promise<CompraAbono> {
    return apiClient.post<CompraAbono>('/api/compraabonos/', paymentData);
  },

  // Get single purchase payment by ID
  async getCompraAbono(id: number): Promise<CompraAbono> {
    return apiClient.get<CompraAbono>(`/api/compraabonos/${id}`);
  },

  // Update purchase payment
  async updateCompraAbono(id: number, updates: CompraAbonoUpdate): Promise<CompraAbono> {
    return apiClient.put<CompraAbono>(`/api/compraabonos/${id}`, updates);
  },

  // Delete purchase payment
  async deleteCompraAbono(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/compraabonos/${id}`);
  },
};

// Product Types (based on backend ProductoResponse)
export interface Producto {
  id: number;
  nombre: string;
  precioVenta: number;
  tipo: 'SIMPLE' | 'ENSAMBLE' | string;
  categoria?: string;
  codbarra?: string;
  estado?: string;
  descripcion?: string;
  imagenUrl?: string;
}

export interface ProductoCreate {
  nombre: string;
  precioVenta: number;
  tipo: 'SIMPLE' | 'ENSAMBLE' | string;
  categoria?: string;
  codbarra?: string;
  estado?: string;
  descripcion?: string;
  imagenUrl?: string;
}

export interface ProductoUpdate {
  nombre?: string;
  precioVenta?: number;
  tipo?: 'SIMPLE' | 'ENSAMBLE' | string;
  categoria?: string;
  codbarra?: string;
  estado?: string;
  descripcion?: string;
  imagenUrl?: string;
}

// Category Types (based on backend CategoriaResponse)
export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface CategoriaCreate {
  nombre: string;
  descripcion?: string;
}

// Order Types (based on backend schemas)
export interface PedidosResponse {
  id: number;
  clienteId: number;
  montoTotal: number;
  estadoPedido: string;
  estadoPago: string;
  metodoPago?: string;
  direccionEnvio?: string;
  cuponId?: number;
  metodoEnvioId?: number;
  fechaEnvio: string; // ISO date string
  creadoEn: string; // ISO date string
}

export interface PedidosDetail extends PedidosResponse {
  cliente_nombre?: string;
  cliente_email?: string;
  cupon_codigo?: string;
  metodo_envio_nombre?: string;
}

export interface PedidosCreate {
  clienteId: number;
  montoTotal: number;
  estadoPedido?: string;
  estadoPago?: string;
  metodoPago?: string;
  direccionEnvio?: string;
  cuponId?: number;
  metodoEnvioId?: number;
  fechaEnvio?: string; // ISO date string
}

export interface PedidosUpdate {
  montoTotal?: number;
  estadoPedido?: string;
  estadoPago?: string;
  metodoPago?: string;
  direccionEnvio?: string;
  cuponId?: number;
  metodoEnvioId?: number;
  fechaEnvio?: string; // ISO date string
}

// Order Status Enums
export enum EstadoPedido {
  PENDIENTE = 'pendiente',
  PROCESANDO = 'procesando',
  ENVIADO = 'enviado',
  ENTREGADO = 'entregado',
  CANCELADO = 'cancelado'
}

export enum EstadoPago {
  PENDIENTE = 'pendiente',
  PAGADO = 'pagado',
  FALLIDO = 'fallido',
  REEMBOLSADO = 'reembolsado'
}

// Client Types (based on backend ClienteResponse)
export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  fechaNacimiento?: string;
  creadoEn: string;
}

export interface ClienteCreate {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  fechaNacimiento?: string;
}

// Inventory Types
export interface Inventario {
  id: number;
  productoId: number;
  cantidadStock: number;
  cantidadMinima: number;
  fechaUltimaActualizacion: string;
}

// Coupon Types
export interface Cupon {
  id: number;
  codigo: string;
  tipoDescuento: string;
  valorDescuento: number;
  fechaInicio: string;
  fechaVencimiento: string;
  activo: boolean;
  creadoEn: string;
}

// Shipping Method Types
export interface MetodoEnvio {
  id: number;
  nombre: string;
  descripcion?: string;
  costo: number;
  tiempoEstimado?: string;
}

// Product Assembly Types
export interface ProductoEnsamble {
  id: number;
  idProductoPadre: number;
  idProductoHijo: number;
  cantidad: number;
}

export interface ProductoEnsambleCreate {
  idProductoPadre: number;
  idProductoHijo: number;
  cantidad: number;
}

export interface ProductoEnsambleUpdate {
  idProductoPadre: number;
  idProductoHijo: number;
  cantidad?: number;
}

// Cart Types (for frontend use)
export interface CartItem {
  id: string;
  producto: Producto;
  quantity: number;
  selectedOptions?: Record<string, any>;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Stats Types
export interface PedidosStats {
  total_pedidos: number;
  monto_total_pagado: number;
  estados_pago: {
    completados: number;
    fallidos: number;
    pendientes: number;
  };
  estados_pedido: {
    cancelados: number;
    entregados: number;
    enviados: number;
    pendientes: number;
    procesando: number;
  };
}
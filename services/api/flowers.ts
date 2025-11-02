import { apiClient } from '@/lib/api';
import type { 
  Producto, 
  ProductoCreate, 
  Categoria, 
  CategoriaCreate,
  Cart, 
  CartItem,
  Inventario,
  Cupon,
  MetodoEnvio
} from '@/types/shop';

export const productService = {
  // Get all products with optional filtering
  async getProductos(params?: {
    skip?: number;
    limit?: number;
    categoria_id?: number;
    precio_min?: number;
    precio_max?: number;
  }): Promise<Producto[]> {
    return apiClient.get<Producto[]>('/productos', params);
  },

  // Create new product
  async createProducto(productData: ProductoCreate): Promise<Producto> {
    return apiClient.post<Producto>('/productos', productData);
  },

  // Get single product by ID (assuming endpoint exists)
  async getProducto(id: number): Promise<Producto> {
    return apiClient.get<Producto>(`/productos/${id}`);
  },

  // Update product (assuming endpoint exists)
  async updateProducto(id: number, updates: Partial<ProductoCreate>): Promise<Producto> {
    return apiClient.put<Producto>(`/productos/${id}`, updates);
  },

  // Delete product (assuming endpoint exists)
  async deleteProducto(id: number): Promise<void> {
    return apiClient.delete<void>(`/productos/${id}`);
  },
};

export const categoryService = {
  // Get all categories
  async getCategorias(params?: {
    skip?: number;
    limit?: number;
  }): Promise<Categoria[]> {
    return apiClient.get<Categoria[]>('/categorias', params);
  },

  // Create new category
  async createCategoria(categoryData: CategoriaCreate): Promise<Categoria> {
    return apiClient.post<Categoria>('/categorias', categoryData);
  },

  // Get single category by ID (assuming endpoint exists)
  async getCategoria(id: number): Promise<Categoria> {
    return apiClient.get<Categoria>(`/categorias/${id}`);
  },

  // Update category (assuming endpoint exists)
  async updateCategoria(id: number, updates: Partial<CategoriaCreate>): Promise<Categoria> {
    return apiClient.put<Categoria>(`/categorias/${id}`, updates);
  },

  // Delete category (assuming endpoint exists)
  async deleteCategoria(id: number): Promise<void> {
    return apiClient.delete<void>(`/categorias/${id}`);
  },
};

export const inventoryService = {
  // Get inventory with optional filtering
  async getInventario(params?: {
    skip?: number;
    limit?: number;
    producto_id?: number;
    stock_minimo?: number;
  }): Promise<Inventario[]> {
    return apiClient.get<Inventario[]>('/inventario', params);
  },

  // Create new inventory entry
  async createInventario(inventoryData: {
    productoId: number;
    cantidadStock: number;
    cantidadMinima: number;
  }): Promise<Inventario> {
    return apiClient.post<Inventario>('/inventario', inventoryData);
  },

  // Update inventory (assuming endpoint exists)
  async updateInventario(id: number, updates: {
    cantidadStock?: number;
    cantidadMinima?: number;
  }): Promise<Inventario> {
    return apiClient.put<Inventario>(`/inventario/${id}`, updates);
  },
};

export const couponService = {
  // Get all coupons
  async getCupones(params?: {
    skip?: number;
    limit?: number;
    activo?: boolean;
    codigo?: string;
  }): Promise<Cupon[]> {
    return apiClient.get<Cupon[]>('/cupones', params);
  },

  // Create new coupon
  async createCupon(couponData: {
    codigo: string;
    tipoDescuento: string;
    valorDescuento: number;
    fechaInicio: string;
    fechaVencimiento: string;
    activo?: boolean;
  }): Promise<Cupon> {
    return apiClient.post<Cupon>('/cupones', couponData);
  },

  // Validate coupon (assuming endpoint exists)
  async validateCupon(codigo: string): Promise<Cupon> {
    return apiClient.get<Cupon>(`/cupones/validate/${codigo}`);
  },
};

export const shippingService = {
  // Get shipping methods
  async getMetodosEnvio(params?: {
    skip?: number;
    limit?: number;
  }): Promise<MetodoEnvio[]> {
    return apiClient.get<MetodoEnvio[]>('/metodos-envio', params);
  },

  // Create new shipping method
  async createMetodoEnvio(shippingData: {
    nombre: string;
    descripcion?: string;
    costo: number;
    tiempoEstimado?: string;
  }): Promise<MetodoEnvio> {
    return apiClient.post<MetodoEnvio>('/metodos-envio', shippingData);
  },
};

// Keep cart service for frontend state management
export const cartService = {
  // These would be local storage or state management operations
  // since the backend doesn't seem to have cart endpoints
  
  getCart(): Cart {
    if (typeof window === 'undefined') return { items: [], total: 0, itemCount: 0 };
    
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : { items: [], total: 0, itemCount: 0 };
  },

  saveCart(cart: Cart): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cart', JSON.stringify(cart));
  },

  addToCart(producto: Producto, quantity: number = 1): Cart {
    const cart = this.getCart();
    const existingItem = cart.items.find(item => item.producto.id === producto.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        id: `${producto.id}-${Date.now()}`,
        producto,
        quantity,
      });
    }

    cart.total = cart.items.reduce((sum, item) => sum + (item.producto.precio * item.quantity), 0);
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    this.saveCart(cart);
    return cart;
  },

  removeFromCart(itemId: string): Cart {
    const cart = this.getCart();
    cart.items = cart.items.filter(item => item.id !== itemId);
    
    cart.total = cart.items.reduce((sum, item) => sum + (item.producto.precio * item.quantity), 0);
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    this.saveCart(cart);
    return cart;
  },

  updateCartItem(itemId: string, quantity: number): Cart {
    const cart = this.getCart();
    const item = cart.items.find(item => item.id === itemId);

    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        return this.removeFromCart(itemId);
      }
    }

    cart.total = cart.items.reduce((sum, item) => sum + (item.producto.precio * item.quantity), 0);
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    this.saveCart(cart);
    return cart;
  },

  clearCart(): Cart {
    const emptyCart = { items: [], total: 0, itemCount: 0 };
    this.saveCart(emptyCart);
    return emptyCart;
  },
};
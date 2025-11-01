// Flower and Product Types
export interface Flower {
  id: string;
  name: string;
  description: string;
  price: number;
  category: FlowerCategory;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  colors: string[];
  occasions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FlowerCategory {
  id: string;
  name: string;
  description: string;
  image?: string;
}

// Cart Types
export interface CartItem {
  id: string;
  flower: Flower;
  quantity: number;
  selectedColor?: string;
  customMessage?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Order Types
export interface Order {
  id: string;
  customerId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: PaymentMethod;
  deliveryDate: Date;
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentMethod {
  type: 'credit_card' | 'debit_card' | 'paypal' | 'cash_on_delivery';
  cardLast4?: string;
  cardBrand?: string;
}

// Customer Types
export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: Address[];
  orders: Order[];
  createdAt: Date;
}
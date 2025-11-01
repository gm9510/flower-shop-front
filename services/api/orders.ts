import { apiClient } from '@/lib/api';
import type { Order, Address, PaymentMethod } from '@/types/shop';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

export const orderService = {
  // Create new order
  async createOrder(orderData: {
    items: Array<{ flowerId: string; quantity: number; selectedColor?: string; customMessage?: string }>;
    shippingAddress: Address;
    billingAddress?: Address;
    paymentMethod: PaymentMethod;
    deliveryDate: Date;
    specialInstructions?: string;
  }): Promise<ApiResponse<Order>> {
    return apiClient.post<ApiResponse<Order>>('/orders', orderData);
  },

  // Get user's orders
  async getOrders(params?: {
    status?: string;
    page?: number;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<PaginatedResponse<Order>> {
    return apiClient.get<PaginatedResponse<Order>>('/orders', params);
  },

  // Get single order
  async getOrder(orderId: string): Promise<ApiResponse<Order>> {
    return apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
  },

  // Update order status (for admin)
  async updateOrderStatus(orderId: string, status: string): Promise<ApiResponse<Order>> {
    return apiClient.patch<ApiResponse<Order>>(`/orders/${orderId}/status`, { status });
  },

  // Cancel order
  async cancelOrder(orderId: string, reason?: string): Promise<ApiResponse<Order>> {
    return apiClient.patch<ApiResponse<Order>>(`/orders/${orderId}/cancel`, { reason });
  },

  // Track order
  async trackOrder(orderId: string): Promise<ApiResponse<{
    status: string;
    estimatedDelivery: Date;
    trackingNumber?: string;
    updates: Array<{
      status: string;
      message: string;
      timestamp: Date;
    }>;
  }>> {
    return apiClient.get<ApiResponse<any>>(`/orders/${orderId}/track`);
  },

  // Get order receipt
  async getOrderReceipt(orderId: string): Promise<Blob> {
    const response = await fetch(`/api/orders/${orderId}/receipt`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate receipt');
    }
    
    return response.blob();
  },
};
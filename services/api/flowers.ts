import { apiClient } from '@/lib/api';
import type { Flower, FlowerCategory, Cart, CartItem } from '@/types/shop';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

export const flowerService = {
  // Get all flowers with optional filtering
  async getFlowers(params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Flower>> {
    return apiClient.get<PaginatedResponse<Flower>>('/flowers', params);
  },

  // Get single flower by ID
  async getFlower(id: string): Promise<ApiResponse<Flower>> {
    return apiClient.get<ApiResponse<Flower>>(`/flowers/${id}`);
  },

  // Get flower categories
  async getCategories(): Promise<ApiResponse<FlowerCategory[]>> {
    return apiClient.get<ApiResponse<FlowerCategory[]>>('/flowers/categories');
  },

  // Search flowers
  async searchFlowers(query: string, filters?: {
    category?: string;
    priceRange?: [number, number];
    colors?: string[];
  }): Promise<PaginatedResponse<Flower>> {
    return apiClient.get<PaginatedResponse<Flower>>('/flowers/search', {
      q: query,
      ...filters,
    });
  },

  // Get featured flowers
  async getFeaturedFlowers(): Promise<ApiResponse<Flower[]>> {
    return apiClient.get<ApiResponse<Flower[]>>('/flowers/featured');
  },

  // Get flowers by category
  async getFlowersByCategory(categoryId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Flower>> {
    return apiClient.get<PaginatedResponse<Flower>>(`/flowers/category/${categoryId}`, params);
  },
};

export const cartService = {
  // Get user's cart
  async getCart(): Promise<ApiResponse<Cart>> {
    return apiClient.get<ApiResponse<Cart>>('/cart');
  },

  // Add item to cart
  async addToCart(item: Omit<CartItem, 'id'>): Promise<ApiResponse<Cart>> {
    return apiClient.post<ApiResponse<Cart>>('/cart/items', item);
  },

  // Update cart item
  async updateCartItem(itemId: string, updates: Partial<CartItem>): Promise<ApiResponse<Cart>> {
    return apiClient.patch<ApiResponse<Cart>>(`/cart/items/${itemId}`, updates);
  },

  // Remove item from cart
  async removeFromCart(itemId: string): Promise<ApiResponse<Cart>> {
    return apiClient.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`);
  },

  // Clear cart
  async clearCart(): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>('/cart');
  },

  // Apply coupon
  async applyCoupon(couponCode: string): Promise<ApiResponse<Cart>> {
    return apiClient.post<ApiResponse<Cart>>('/cart/coupon', { code: couponCode });
  },
};
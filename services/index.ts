// Export all API services
export { 
  productService, 
  categoryService, 
  inventoryService, 
  couponService, 
  shippingService, 
  cartService 
} from './api/flowers';
export { orderService } from './api/orders';
export { authService } from './api/auth';
export { clientService } from './api/clients';

// Re-export API client for direct use
export { apiClient } from '@/lib/api';
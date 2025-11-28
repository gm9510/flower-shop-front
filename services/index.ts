// Export all API services
export { 
  productService, 
  categoryService, 
  inventoryService 
} from './api/products';
export { orderService } from './api/orders';
export { authService } from './api/auth';
export { clientService } from './api/clients';
export { couponService } from './api/coupons';
export { shippingService } from './api/shipping';
export { cartService, cartItemService } from './api/cart';
export { orderItemService } from './api/order-items';
export { orderPaymentService } from './api/order-payments';
export { productAssemblyService } from './api/product-assemblies';
export { purchaseService, purchaseDetailService, purchasePaymentService } from './api/purchases';

// Re-export API client for direct use
export { apiClient } from '@/lib/api';
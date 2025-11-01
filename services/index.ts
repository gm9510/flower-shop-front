// Export all API services
export { flowerService, cartService } from './api/flowers';
export { orderService } from './api/orders';
export { authService } from './api/auth';

// Re-export API client for direct use
export { apiClient } from '@/lib/api';
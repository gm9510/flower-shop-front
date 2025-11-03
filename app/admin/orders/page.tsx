'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import { Card, CardContent } from '@/components/ui/card';
import SearchAndFilter from '@/components/admin/orders/SearchAndFilter';
import PageHeader from '@/components/admin/orders/PageHeader';
import OrdersTable from '@/components/admin/orders/Table';
import { orderService } from '@/services/api/orders';
import type { PedidosResponse } from '@/types/shop';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
  
  // Orders data state
  const [orders, setOrders] = useState<PedidosResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders function
  const fetchOrders = async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      const params: any = {
        skip: (page - 1) * 10,
        limit: 10,
      };

      // Add filters if they exist
      if (statusFilter) {
        params.estado_pedido = statusFilter;
      }

      // Note: The API doesn't have a direct search parameter,
      // but we can filter by status. For full search, we might need
      // to implement client-side filtering or extend the API
      
      const response = await orderService.getPedidos(params);

      // For now, we'll implement client-side search filtering
      let filteredOrders = response;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredOrders = response.filter(order =>
          order.id.toString().includes(query) ||
          order.clienteId.toString().includes(query) ||
          order.metodoPago?.toLowerCase().includes(query)
        );
      }

      setOrders(filteredOrders);
      setCurrentPage(page);
      // For now, we'll assume 10 items per page and calculate total pages
      // In a real implementation, the API should return pagination metadata
      setTotalPages(Math.ceil(filteredOrders.length / 10) || 1);
      setTotalResults(filteredOrders.length);
      
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Error al cargar los pedidos. Por favor, intenta de nuevo.');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch orders when filters change
  useEffect(() => {
    fetchOrders(1); // Reset to first page when filters change
  }, [searchQuery, statusFilter, paymentMethodFilter]);

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchOrders(page);
  };

  const handleFilterClick = () => {
    console.log('Filter clicked');
    // TODO: Implement filter modal or advanced filtering
  };

  const handleExportClick = () => {
    console.log('Export clicked');
    // TODO: Implement export functionality
  };

  const handleNewOrderClick = () => {
    console.log('New order clicked');
    // TODO: Open create order modal or navigate to create page
  };

  const handleViewOrder = (orderId: number) => {
    console.log('View order:', orderId);
    // TODO: Navigate to order detail page or open modal
  };

  const handleEditOrder = (orderId: number) => {
    console.log('Edit order:', orderId);
    // TODO: Navigate to order edit page or open modal
  };
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <PageHeader
          title="Gestión de Pedidos"
          description="Administra todos los pedidos de la floristería"
          onFilterClick={handleFilterClick}
          onExportClick={handleExportClick}
          onNewOrderClick={handleNewOrderClick}
        />

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <SearchAndFilter
              onSearchChange={setSearchQuery}
              onStatusFilterChange={setStatusFilter}
              onPaymentMethodFilterChange={setPaymentMethodFilter}
            />
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Orders Table */}
        <OrdersTable
          orders={orders}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={totalResults}
          onViewOrder={handleViewOrder}
          onEditOrder={handleEditOrder}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
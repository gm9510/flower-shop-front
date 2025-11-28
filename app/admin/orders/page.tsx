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
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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

      // Add filters if they exist (excluding "all" which means no filter)
      if (deliveryStatusFilter && deliveryStatusFilter !== 'all') {
        params.estado_pedido = deliveryStatusFilter;
      }
      if (paymentStatusFilter && paymentStatusFilter !== 'all') {
        params.estado_pago = paymentStatusFilter;
      }

      // Add date range filter
      if (startDate) {
        params.fecha_envio_desde = startDate;
      }
      if (endDate) {
        params.fecha_envio_hasta = endDate;
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
  }, [searchQuery, deliveryStatusFilter, paymentStatusFilter, startDate, endDate]);

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
    router.push('/admin/orders/create');
  };

  const handleViewOrder = (orderId: number) => {
    router.push(`/admin/orders/${orderId}`);
  };

  const handleEditOrder = (orderId: number) => {
    router.push(`/admin/orders/${orderId}/edit`);
  };

  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
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
        />

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <SearchAndFilter
              onSearchChange={setSearchQuery}
              onStatusFilterChange={setDeliveryStatusFilter}
              onPaymentMethodFilterChange={setPaymentStatusFilter}
              onDateRangeChange={handleDateRangeChange}
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
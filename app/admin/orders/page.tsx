'use client';

import { useState } from 'react';
import Header from '@/components/layout/header';
import { Card, CardContent } from '@/components/ui/card';
import SearchAndFilter from '@/components/admin/orders/SearchAndFilter';
import PageHeader from '@/components/admin/orders/PageHeader';
import OrdersTable from '@/components/admin/orders/Table';
import { usePaginatedOrders } from './hooks/usePaginatedOrders';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Use paginated orders hook
  const {
    orders,
    total,
    currentPage,
    totalPages,
    isLoading,
    error,
    goToPage,
  } = usePaginatedOrders({
    page: 1,
    pageSize: 10,
    estadoPedido: deliveryStatusFilter,
    estadoPago: paymentStatusFilter,
    fechaEntregaDesde: startDate,
    fechaEntregaHasta: endDate,
  });

  // Client-side search filtering
  const filteredOrders = searchQuery.trim()
    ? orders.filter(order => {
        const query = searchQuery.toLowerCase();
        return (
          order.id.toString().includes(query) ||
          order.numeroFactura?.toString().includes(query) ||
          order.idEntidad.toString().includes(query) ||
          order.metodoPago?.toLowerCase().includes(query) ||
          order.usuario?.toLowerCase().includes(query)
        );
      })
    : orders;

  // Handle page change
  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  const handleFilterClick = () => {
    console.log('Filter clicked');
    // TODO: Implement filter modal or advanced filtering
  };

  const handleExportClick = () => {
    console.log('Export clicked');
    // TODO: Implement export functionality
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
          orders={filteredOrders}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={total}
          onViewOrder={handleViewOrder}
          onEditOrder={handleEditOrder}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
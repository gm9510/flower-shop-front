'use client';

import { useState } from 'react';
import { Search, Calendar, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface SearchAndFilterProps {
  onSearchChange?: (query: string) => void;
  onStatusFilterChange?: (status: string) => void;
  onPaymentMethodFilterChange?: (method: string) => void;
  onDateRangeChange?: (startDate: string, endDate: string) => void;
}

export default function SearchAndFilter({
  onSearchChange,
  onStatusFilterChange,
  onPaymentMethodFilterChange,
  onDateRangeChange
}: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange?.(value);
  };

  const handleDeliveryStatusChange = (value: string) => {
    setDeliveryStatusFilter(value);
    onStatusFilterChange?.(value);
  };

  const handlePaymentStatusChange = (value: string) => {
    setPaymentStatusFilter(value);
    onPaymentMethodFilterChange?.(value);
  };

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    onDateRangeChange?.(value, endDate);
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    onDateRangeChange?.(startDate, value);
  };

  const handleClearDates = () => {
    setStartDate('');
    setEndDate('');
    onDateRangeChange?.('', '');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar por número de pedido"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Select value={deliveryStatusFilter} onValueChange={handleDeliveryStatusChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Estado de entrega" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados de entrega</SelectItem>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="procesando">Procesando</SelectItem>
            <SelectItem value="enviado">Enviado</SelectItem>
            <SelectItem value="entregado">Entregado</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={paymentStatusFilter} onValueChange={handlePaymentStatusChange}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Estado de pago" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados de pago</SelectItem>
            <SelectItem value="pagado">Pagado</SelectItem>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="fallido">Fallido</SelectItem>
            <SelectItem value="reembolsado">Reembolsado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date Range Filter */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <Label className="text-sm font-medium">Fecha de envío:</Label>
        </div>
        <div className="flex flex-1 gap-2 items-center">
          <div className="flex-1">
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Desde"
            />
          </div>
          <span className="text-gray-500">-</span>
          <div className="flex-1">
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              min={startDate}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Hasta"
            />
          </div>
          {(startDate || endDate) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearDates}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

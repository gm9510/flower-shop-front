'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchAndFilterProps {
  onSearchChange?: (query: string) => void;
  onStatusFilterChange?: (status: string) => void;
  onPaymentMethodFilterChange?: (method: string) => void;
}

export default function SearchAndFilter({
  onSearchChange,
  onStatusFilterChange,
  onPaymentMethodFilterChange
}: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange?.(value);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    onStatusFilterChange?.(value);
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethodFilter(value);
    onPaymentMethodFilterChange?.(value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar por número de pedido, cliente o estado..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="procesando">Procesando</option>
          <option value="enviado">Enviado</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <select
          value={paymentMethodFilter}
          onChange={(e) => handlePaymentMethodChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todos los métodos de pago</option>
          <option value="tarjeta_credito">Tarjeta de Crédito</option>
          <option value="tarjeta_debito">Tarjeta de Débito</option>
          <option value="transferencia">Transferencia</option>
          <option value="efectivo">Efectivo</option>
        </select>
      </div>
    </div>
  );
}

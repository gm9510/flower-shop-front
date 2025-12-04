'use client';

import { useEffect, useState } from 'react';
import StatCard from './StatCard';
import { orderService } from '@/services';
import { PedidosStats } from '@/types/shop';
import {
  Package,
  TrendingUp,
  Users,
  ShoppingCart,
} from 'lucide-react';

export default function StatsCards() {
  const [stats, setStats] = useState<PedidosStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Implement stats calculation from orders
        // The getPedidosStats endpoint doesn't exist in the backend API
        // For now, fetch all orders and calculate stats client-side
        const ordersPage = await orderService.getPedidosPaginated({ page_size: 1000 });
        const orders = ordersPage.items;
        const calculatedStats: PedidosStats = {
          total_pedidos: orders.length,
          monto_total_pagado: orders.filter(o => o.estadoPago === 'pagado').reduce((sum, o) => sum + o.montoTotal, 0),
          estados_pago: {
            completados: orders.filter(o => o.estadoPago === 'pagado').length,
            fallidos: orders.filter(o => o.estadoPago === 'fallido').length,
            pendientes: orders.filter(o => o.estadoPago === 'pendiente').length,
          },
          estados_pedido: {
            cancelados: orders.filter(o => o.estadoPedido === 'cancelado').length,
            entregados: orders.filter(o => o.estadoPedido === 'entregado').length,
            enviados: orders.filter(o => o.estadoPedido === 'enviado').length,
            pendientes: orders.filter(o => o.estadoPedido === 'pendiente').length,
            procesando: orders.filter(o => o.estadoPedido === 'procesando').length,
          },
        };
        setStats(calculatedStats);
      } catch (err: any) {
        console.error('Failed to fetch stats:', err);
        setError('Failed to load statistics');
        // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (error && !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="col-span-full bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Orders Stat Card */}
      <StatCard
        title="Total Pedidos"
        value={stats?.total_pedidos || 0}
        icon={ShoppingCart}
        iconColor="bg-blue-500"
        description="Pedidos completados este mes"
      />

      {/* Total Revenue Stat Card */}
      <StatCard
        title="Ingresos Totales"
        value={stats ? formatCurrency(stats.monto_total_pagado) : '$0'}
        icon={TrendingUp}
        iconColor="bg-green-500"
        trend={
          stats ? {
            value: 8,
            isPositive: true,
          } : undefined
        }
        description="Ganancia del período"
      />

      {/* Loading state indicator */}
      {loading && (
        <div className="col-span-full text-center text-sm text-gray-500">
          Cargando estadísticas...
        </div>
      )}
    </div>
  );
}

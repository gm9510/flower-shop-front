import Header from '@/components/layout/header';
import OrdersTable from '@/components/admin/orders/OrdersTable';
import QuickActions from '@/components/admin/QuickActions';
import StatsCards from '@/components/admin/StatsCards';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards - Server Component */}
      <StatsCards />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders - Using shadcn table */}
          <OrdersTable />

          {/* Quick Actions Component */}
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
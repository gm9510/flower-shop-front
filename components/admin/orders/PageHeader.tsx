'use client';

import { Button } from '@/components/ui/button';
import { Filter, Download, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CreateOrderDrawer from '@/components/admin/CreateOrderDrawer';

interface PageHeaderProps {
  title: string;
  description: string;
  onFilterClick?: () => void;
  onExportClick?: () => void;
  onNewOrderClick?: () => void;
}

export default function PageHeader({
  title,
  description,
  onFilterClick,
  onExportClick,
  onNewOrderClick
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-800"
            onClick={() => router.push('/admin')}
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={onFilterClick}>
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm" onClick={onExportClick}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <CreateOrderDrawer>
              <Button size="sm" onClick={onNewOrderClick}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Pedido
              </Button>
          </CreateOrderDrawer>
        </div>
      </div>
    </div>
  );
}

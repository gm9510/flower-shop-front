'use client';

import { Button } from '@/components/ui/button';
import { Filter, Download, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PageHeaderPurchasesProps {
  title: string;
  description: string;
  onFilterClick?: () => void;
  onExportClick?: () => void;
}

export const PageHeaderPurchases = ({ title, description, onExportClick, onFilterClick }: PageHeaderPurchasesProps) => {
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
          <Button variant="outline" size="sm" onClick={onExportClick}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm" onClick={() => router.push('/admin/purchases/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Compra
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push('/admin/entitys')}>
            Ir a Proveedores
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push('/admin/products')}>
            Ir a Productos
          </Button>
        </div>
      </div>
    </div>
  );
}


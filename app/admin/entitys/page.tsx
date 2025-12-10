'use client'

import Header from "@/components/layout/header"
import { PageHeaderEntitys } from "./components/PageHeaderEntitys"
import { TableEntitys } from "./components/TableEntitys";

const Page = () => {
  const handleFilterClick = () => {
    console.log('Filter clicked');
    // TODO: Implement filter modal or advanced filtering
  };

  const handleExportClick = () => {
    console.log('Export clicked');
    // TODO: Implement export functionality
  };
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeaderEntitys
          title="Gestión de Proveedores"
          description="Administra todos los proveedores de la floristería"
          onFilterClick={handleFilterClick}
          onExportClick={handleExportClick}
        />
        <TableEntitys />
      </div>
    </div>
  )
}

export default Page

'use client'
import Header from "@/components/layout/header"
import { PageHeaderPurchases } from "./components/PageHeaderPurchases";
import { TablePurchases } from "./components/TablePurchases";

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
        {/* Page Header */}
        <PageHeaderPurchases
          title="Gestión de Compras"
          description="Administra todos las compras de la floristería"
          onFilterClick={handleFilterClick}
          onExportClick={handleExportClick}
        />
        <TablePurchases />
      </div>
    </div>
  )
}
export default Page

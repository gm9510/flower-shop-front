'use client'

import { useGetEntidad } from "@/hooks/use-entidad"
import { useParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import Header from "@/components/layout/header"
import { FormEntity } from "@/components/entitys/FormEntity"


const Page = () => {
  const params = useParams()
  const { entity, isLoading, isError } = useGetEntidad(Number(params.id))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-10">
          <Skeleton className="h-8 w-64 mb-6" />

          <div className="grid grid-cols-2 gap-6 mt-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !entity) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-10 text-center text-red-600">
          <p>Error al cargar la información del proveedor.</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <Header />
      <FormEntity mode="edit" initialValues={{
        ...entity
      }} />
    </div>
  )
}

export default Page

'use client'

import { useGetEntidad } from "@/hooks/use-entidad"
import { useParams, useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/header"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Pencil } from "lucide-react"
import Link from "next/link"

const Page = () => {
  const params = useParams()
  const router = useRouter()
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
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header sección con botones */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{entity.nombre}</h1>
            <p className="text-gray-600 text-sm mt-1">
              Detalles del proveedor
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              asChild
            >
              <Link href={`/admin/entitys`}>
                <ArrowLeft size={16} />
                Volver
              </Link>
            </Button>

            <Button
              className="flex items-center gap-2"
              asChild
            >
              <Link href={`/admin/entitys/${entity.id}/edit`}>
                <Pencil size={16} />
                Editar
              </Link>
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Grid de datos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10 text-sm">

          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">NIT</span>
            <span>{entity.nit}-{entity.dv}</span>
          </div>

          {entity.telefono && (
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">Teléfono</span>
              <span>{entity.telefono}</span>
            </div>
          )}

          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">Correo</span>
            <span>{entity.correo}</span>
          </div>

          {entity.direccion && (
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">Dirección</span>
              <span>{entity.direccion}</span>
            </div>
          )}

          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">Estado</span>
            <Badge
              variant={entity.estado ? "default" : "destructive"}
              className="w-fit"
            >
              {entity.estado ? "Activo" : "Inactivo"}
            </Badge>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Page

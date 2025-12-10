'use client'
import { useState, useEffect } from "react"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from '@/components/ui/table';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trash } from "lucide-react";
import { useDeleteEntidad, useGetEntidades } from "@/hooks/use-entidad";

export const TableEntitys = () => {
  const { mutate: deleteEntity, isSuccess: isSuccessDelete, isLoading: isLoadingDelete } = useDeleteEntidad()
  const { entitys, isLoading, isError, getEntitys } = useGetEntidades()
  const [page, setPage] = useState(1)
  const perPage = 5

  // Search
  const [search, setSearch] = useState("")


  useEffect(() => {
    if (!isSuccessDelete) return
    getEntitys()
  }, [isSuccessDelete])
  if (isLoading) return <p>Cargando compras...</p>
  if (isError) return <p>Error al cargar compras.</p>

  // Filter
  const filtered = entitys?.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / perPage)
  const start = (page - 1) * perPage
  const paginated = filtered.slice(start, start + perPage)

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>Listado de Compras</CardTitle>
      </CardHeader>

      <CardContent>

        {/* Search */}
        <div className="flex items-center justify-between mb-4">
          <Input
            placeholder="Buscar por factura..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-64"
          />
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Dirrecion</TableHead>
                <TableHead>Dv</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Nit</TableHead>
                <TableHead>Telefono</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginated.map((compra) => (
                <TableRow key={compra.id}>
                  <TableCell>{compra.id}</TableCell>
                  <TableCell>{compra.nombre}</TableCell>
                  <TableCell>{compra.correo}</TableCell>
                  <TableCell>{compra.direccion}</TableCell>
                  <TableCell>{compra.dv}</TableCell>
                  <TableCell>{compra.estado}</TableCell>
                  <TableCell>{compra.nit}</TableCell>
                  <TableCell>{compra.telefono}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <Link href={`/admin/entitys/${compra.id}`}>
                          ver
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <Link href={`/admin/entitys/${compra.id}/edit`}>
                          Editar
                        </Link>
                      </Button>
                      <Button disabled={isLoadingDelete} variant={'destructive'} size={'icon'} onClick={() => deleteEntity(compra.id)}>
                        <Trash />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination controls */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </p>

          <div className="space-x-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </Button>

            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}

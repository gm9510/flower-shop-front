'use client'

import { purchaseService } from "@/services"
import { Compra } from "@/services/api/purchases"
import { useState, useEffect } from "react"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from '@/components/ui/table';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useDeletePurchase } from "@/hooks/use-purchase";
import { Trash } from "lucide-react";

export const TablePurchases = () => {
  const { mutate: deletePurchase, isSuccess: isSuccessDelete, isLoading: isLoadingDelete } = useDeletePurchase()
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [purchases, setPurchases] = useState<Compra[]>([])

  // Pagination
  const [page, setPage] = useState(1)
  const perPage = 5

  // Search
  const [search, setSearch] = useState("")

  const getPurchases = async () => {
    setIsLoading(true)
    setIsError(false)

    try {
      const compras = await purchaseService.getCompras()
      setPurchases(compras)
    } catch (error) {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getPurchases()
  }, [])
  useEffect(() => {
    if (!isSuccessDelete) return
    getPurchases()
  }, [isSuccessDelete])
  if (isLoading) return <p>Cargando compras...</p>
  if (isError) return <p>Error al cargar compras.</p>

  // Filter
  const filtered = purchases.filter((p) =>
    p.factura.toLowerCase().includes(search.toLowerCase())
  )

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
                <TableHead>Entidad</TableHead>
                <TableHead>Factura</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Descuento</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Método Pago</TableHead>
                <TableHead>Fecha Límite</TableHead>
                <TableHead>Efectivo</TableHead>
                <TableHead>Transferencia</TableHead>
                <TableHead>Observación</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Registro</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginated.map((compra) => (
                <TableRow key={compra.id}>
                  <TableCell>{compra.id}</TableCell>
                  <TableCell>{compra.idEntidad}</TableCell>
                  <TableCell>{compra.factura}</TableCell>
                  <TableCell>${compra.subTotal}</TableCell>
                  <TableCell>${compra.descuento}</TableCell>
                  <TableCell>${compra.total}</TableCell>
                  <TableCell>${compra.saldo}</TableCell>
                  <TableCell>{compra.metodoPago}</TableCell>
                  <TableCell>{compra.fechaLimite ?? "-"}</TableCell>
                  <TableCell>{compra.efectivo ?? "-"}</TableCell>
                  <TableCell>{compra.transferencia ?? "-"}</TableCell>
                  <TableCell>{compra.observacion ?? "-"}</TableCell>
                  <TableCell>{compra.usuario}</TableCell>
                  <TableCell>{compra.registro}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <Link href={`/admin/purchases/${compra.id}`}>
                          ver
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <Link href={`/admin/purchases/${compra.id}/edit`}>
                          Editar
                        </Link>
                      </Button>
                      <Button disabled={isLoadingDelete} variant={'destructive'} size={'icon'} onClick={() => deletePurchase(compra.id)}>
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

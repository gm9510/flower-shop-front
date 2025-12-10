import { inventoryService, productService } from "@/services"
import { Compra, CompraAbono, CompraDetalle, purchaseDetailService, purchasePaymentService, purchaseService } from "@/services/api/purchases"
import { Producto } from "@/types/shop"
import { useEffect, useState } from "react"
export interface CompraDetalleProductReturn extends CompraDetalle {
  product: Producto
}
export interface CompraDetalleReturn {
  compra: Compra
  detalle: CompraDetalleProductReturn[]
  // abonos: CompraAbono[]
}
export const useGetPurchase = (id?: number) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [purchase, setPurchase] = useState<CompraDetalleReturn>()
  const getPurchase = async () => {
    if (!id) return
    setIsLoading(true)
    setIsError(false)
    try {
      const [compra, compraDetalles, productos] = await Promise.all([
        purchaseService.getCompra(id),
        purchaseDetailService.getCompraDetalles(),
        productService.getProductos(),
        // purchasePaymentService.getCompraAbonos()
      ])
      const compraDetallesFilters: CompraDetalleProductReturn[] = compraDetalles.filter(e => e.idCompra === id).map(e => {
        const compraDetalle: CompraDetalleProductReturn = {
          ...e,
          product: productos.find(e2 => e.idProducto === e2.id) as Producto
        }
        return compraDetalle
      })
      setPurchase({
        compra,
        detalle: compraDetallesFilters,
        // abonos
      })
    } catch (error) {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    getPurchase()
  }, [id])
  return { purchase, isLoading, isError }
}
export const useCreatePurchase = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const mutate = async (data: any) => {
    setIsLoading(true)
    setIsError(false)
    setIsSuccess(false)

    try {
      const newPurchase = await purchaseService.createCompra(data)

      // Crear detalles
      await Promise.all(
        data.details.map((e: any) =>
          purchaseDetailService.createCompraDetalle({
            ...e,
            idCompra: newPurchase.id
          })
        )
      )

      // Obtener inventario
      const inventarios = await inventoryService.getInventario()

      // Actualizar inventarios
      Promise.all(
        data.details.map(async (element: any) => {
          if (!element?.idProducto) return

          const cantidad = Number(element.cantidad)
          const inventario = inventarios.find(
            (i) => i.productoId.toString() === element.idProducto.toString()
          )

          if (!inventario) {
            console.log('crear')
            return inventoryService.createInventario({
              productoId: element.idProducto,
              cantidadStock: cantidad,
              cantidadMinima: 0
            })
          }

          console.log('actualizar')
          return inventoryService.updateInventario(inventario.id, {
            ...inventario,
            cantidadStock: inventario.cantidadStock + cantidad
          })
        })
      )

      setIsSuccess(true)

    } catch (error) {
      console.error(error)
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, isError, isSuccess, mutate }
}

export const useUpdatePurchase = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const mutate = async (data: any) => {
    setIsLoading(true)
    try {
      const purchaseDetails = await purchaseDetailService.getCompraDetalles()
      const purchaseDetailsFilter = purchaseDetails.filter(e => e.idCompra.toString() === data.id.toString())
      await Promise.all(purchaseDetailsFilter.map(e => purchaseDetailService.deleteCompraDetalle(e.id)))
      await Promise.all([
        purchaseService.updateCompra(data.id, data),
        ...data.details.map((e: any) =>
          purchaseDetailService.createCompraDetalle({ ...e, idCompra: data.id })
        )
      ])
      setIsSuccess(true)
    } catch (error) {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }
  return { isLoading, isError, isSuccess, mutate }
}
export const useDeletePurchase = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const mutate = async (id: number) => {
    setIsLoading(true)
    try {
      const purchaseDetails = await purchaseDetailService.getCompraDetalles()
      const purchaseDetailsFilter = purchaseDetails.filter(e => e.idCompra.toString() === id.toString())
      await Promise.all([
        ...purchaseDetailsFilter.map(e => purchaseDetailService.deleteCompraDetalle(e.id)),
      ])
      await purchaseService.deleteCompra(id)
      setIsSuccess(true)
    } catch (error) {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    if (!isError) return
    setIsError(false)
  }, [isError])
  return { isSuccess, isLoading, isError, mutate }
}

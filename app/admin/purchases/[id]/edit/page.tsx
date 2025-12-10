'use client'

import Header from "@/components/layout/header"
import { FormPurchase } from "@/components/purchases/FormPurchase"
import { useGetPurchase } from "@/hooks/use-purchase"
import { useParams } from "next/navigation"
import { useEffect } from "react"

const Page = () => {
  const params = useParams()
  const { purchase, isError, isLoading } = useGetPurchase(Number(params.id))
  useEffect(() => {
    console.log(purchase)
  }, [purchase])
  if (isLoading) return (<div>...cargando</div>)
  if (isError) return (<div>error</div>)
  if (!purchase) return (<div>no hay data</div>)
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <Header />
      <FormPurchase initialValues={{
        descuento: purchase?.compra?.descuento,
        fechaLimite: purchase?.compra?.fechaLimite ?? "",
        efectivo: purchase?.compra?.efectivo ?? 0,
        factura: purchase?.compra?.factura,
        metodoPago: purchase?.compra?.metodoPago,
        idEntidad: purchase?.compra?.idEntidad,
        total: purchase?.compra?.total,
        id: purchase.compra.id,
        observacion: purchase.compra.observacion ?? "",
        registro: purchase.compra.registro,
        saldo: purchase.compra.saldo,
        transferencia: purchase.compra.transferencia ?? 0,
        subTotal: purchase.compra.subTotal,
        usuario: purchase.compra.usuario,
        details: purchase.detalle.map((e: any) => ({
          ...e
        }))
      }} mode="edit" />
    </div>
  )
}

export default Page

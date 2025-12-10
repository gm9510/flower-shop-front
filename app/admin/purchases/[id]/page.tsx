'use client'

import Header from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import { PurchaseInfoSection } from "./components/PurchaseInfoSection";
import { useGetPurchase } from "@/hooks/use-purchase"
import { PurchaseItemsList } from "./components/PurchaseItemsList"
import { PurchaseDetailsSidebar } from "./components/PurchaseDetailsSidebar"

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
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild>
                <Link href={`/admin/purchases`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Compra #{params.id}</h1>
                <p className="text-muted-foreground mt-1">
                  Detalles de Compra
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href={`/admin/purchases/${params.id}/edit`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Editar
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="col-span-1 lg:col-span-8 flex flex-col gap-4">
              <PurchaseInfoSection compra={purchase} />
              <PurchaseItemsList compra={purchase} />
            </div>
            <div className="col-span-1 lg:col-span-4">
              <PurchaseDetailsSidebar compra={purchase} />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Page


import { productService } from "@/services"
import { Producto } from "@/types/shop"

import { useEffect, useState } from "react"

export const useGetProductos = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [data, setData] = useState<Producto[]>()
  const getEntitys = async () => {
    setIsLoading(true)
    setIsError(false)
    try {
      const entitys = await productService.getProductos()
      setData(entitys)
    } catch (error) {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    getEntitys()
  }, [])
  return { products: data, isLoading, isError }
}

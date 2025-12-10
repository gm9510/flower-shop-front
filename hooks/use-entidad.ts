import { entityService } from "@/services/api/clients"
import { Entity } from "@/types/shop"
import { useEffect, useState } from "react"

export const useGetEntidades = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [entitys, setEntitys] = useState<Entity[]>()
  const getEntitys = async () => {
    setIsLoading(true)
    setIsError(false)
    try {
      const entitys = await entityService.getEntidades()
      setEntitys(entitys)
    } catch (error) {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    getEntitys()
  }, [])
  return { entitys, isLoading, isError, getEntitys }
}
export const useGetEntidad = (id: number) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [data, setData] = useState<Entity>()
  const getEntitys = async () => {
    setIsLoading(true)
    setIsError(false)
    try {
      const entity = await entityService.getEntidad(id)
      setData(entity)
    } catch (error) {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    getEntitys()
  }, [id])
  return { entity: data, isLoading, isError }
}

export const useCreateEntidad = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const mutate = async (data: any) => {
    setIsLoading(true)
    try {
      await entityService.createEntidad(data)
      setIsSuccess(true)
    } catch (error) {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }
  return { isLoading, isError, isSuccess, mutate }
}

export const useUpdateEntidad = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const mutate = async (data: any) => {
    setIsLoading(true)
    try {
      await entityService.updateEntidad(data.id, data)
      setIsSuccess(true)
    } catch (error) {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }
  return { isLoading, isError, isSuccess, mutate }
}

export const useDeleteEntidad = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const mutate = async (id: number) => {
    setIsLoading(true)
    try {
      await entityService.deleteEntidad(id)
      setIsSuccess(true)
    } catch (error) {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }
  return { isLoading, isError, isSuccess, mutate }
}

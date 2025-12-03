const MERCADOPAGO_API = "https://api.mercadopago.com/checkout/preferences"
const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN

export interface MercadoPagoItemPayload {
  title: string
  unit_price: number
  quantity: number
  currency_id?: string
}

export interface MercadoPagoPreferencePayload {
  items: MercadoPagoItemPayload[]
  payer: {
    email: string
  }
  back_urls?: {
    success: string
    failure: string
    pending: string
  }
  auto_return?: "approved" | "all"
}

export interface MercadoPagoPreferenceResponse {
  id: string
  init_point: string
}



const DEFAULT_BACK_URLS = {
  success: "https://tu-frontend.com/pago-exitoso",
  failure: "https://tu-frontend.com/pago-fallido",
  pending: "https://tu-frontend.com/pago-pendiente",
}

const DEFAULT_AUTO_RETURN: MercadoPagoPreferencePayload["auto_return"] = "approved"

export async function createMercadoPagoPreference(payload: MercadoPagoPreferencePayload): Promise<MercadoPagoPreferenceResponse> {
  const token = ACCESS_TOKEN
  if (!token) {
    throw new Error("MercadoPago no está configurado correctamente.")
  }

  const enhancedPayload: MercadoPagoPreferencePayload = {
    auto_return: payload.auto_return ?? DEFAULT_AUTO_RETURN,
    payer: payload.payer,
    items: payload.items.map((item) => ({
      currency_id: "COP",
      ...item,
    })),
    back_urls:  DEFAULT_BACK_URLS,
  }

  const response = await fetch(MERCADOPAGO_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(enhancedPayload),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || "No pudimos crear el link de pago")
  }

  return { id: data.id, init_point: data.init_point }
}

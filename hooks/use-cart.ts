"use client"

import { create } from "zustand"
import { persistCartToCookie } from "@/lib/session"

interface CartItem {
  id: number
  title: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartStore {
  items: CartItem[]
  addToCart: (product: { id: number; name: string; price: number; image: string }, quantity: number) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
}

export const useCart = create<CartStore>((set) => ({
  items: [],
  addToCart: (product, quantity) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id)
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
          ),
        }
      }
      return {
        items: [
          ...state.items,
          {
            ...product,
            title: product.name,
            quantity,
          },
        ],
      }
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => {
      if (quantity === 0) {
        return {
          items: state.items.filter((item) => item.id !== productId),
        }
      }
      return {
        items: state.items.map((item) => (item.id === productId ? { ...item, quantity } : item)),
      }
    }),
  clearCart: () => set({ items: [] }),
}))

if (typeof window !== "undefined") {
  useCart.subscribe((state) => {
    persistCartToCookie(state.items)
  })
}

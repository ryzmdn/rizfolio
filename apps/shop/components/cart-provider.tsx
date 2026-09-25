"use client"

import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react"

export interface CartItem {
  id: string
  productId: string
  slug: string
  title: string
  coverImageUrl?: string | null
  productType: "DIGITAL_DOWNLOAD" | "SERVICE" | "PHYSICAL" | string
  licenseType: "STANDARD" | "EXTENDED"
  price: number
  quantity: number
  currency: string
  fileName?: string
  fileSizeBytes?: number
}

export type CartItemInput = Omit<CartItem, "id" | "quantity"> & {
  quantity?: number
}

export interface AppliedCoupon {
  code: string
  discountPercent: number
  description: string
}

interface CartContextValue {
  items: CartItem[]
  isOpen: boolean
  coupon: AppliedCoupon | null
  totalCount: number
  subtotal: number
  discountAmount: number
  grandTotal: number
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addItem: (item: CartItemInput) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, delta: number) => void
  updateLicense: (
    id: string,
    licenseType: "STANDARD" | "EXTENDED",
    newPrice: number
  ) => void
  applyCoupon: (coupon: AppliedCoupon) => void
  removeCoupon: () => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const CART_STORAGE_KEY = "rizfolio_shop_cart"
const COUPON_STORAGE_KEY = "rizfolio_shop_coupon"

let cachedItems: CartItem[] = []
let itemsLoaded = false

function loadItemsFromStorage(): CartItem[] {
  if (typeof window === "undefined") return []
  if (itemsLoaded) return cachedItems
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        cachedItems = parsed
      }
    }
  } catch {
    cachedItems = []
  } finally {
    itemsLoaded = true
  }
  return cachedItems
}

let cachedCoupon: AppliedCoupon | null = null
let couponLoaded = false

function loadCouponFromStorage(): AppliedCoupon | null {
  if (typeof window === "undefined") return null
  if (couponLoaded) return cachedCoupon
  try {
    const raw = localStorage.getItem(COUPON_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed?.code && parsed?.discountPercent) {
        cachedCoupon = parsed
      }
    }
  } catch {
    cachedCoupon = null
  } finally {
    couponLoaded = true
  }
  return cachedCoupon
}

const listeners = new Set<() => void>()

function emitCartChange() {
  for (const listener of listeners) {
    listener()
  }
}

function subscribeCart(callback: () => void) {
  listeners.add(callback)
  const handleStorage = (e: StorageEvent) => {
    if (e.key === CART_STORAGE_KEY) {
      itemsLoaded = false
      loadItemsFromStorage()
      callback()
    }
    if (e.key === COUPON_STORAGE_KEY) {
      couponLoaded = false
      loadCouponFromStorage()
      callback()
    }
  }
  window.addEventListener("storage", handleStorage)
  return () => {
    listeners.delete(callback)
    window.removeEventListener("storage", handleStorage)
  }
}

function getItemsSnapshot(): CartItem[] {
  return loadItemsFromStorage()
}

const emptyItems: CartItem[] = []
function getServerItemsSnapshot(): CartItem[] {
  return emptyItems
}

function getCouponSnapshot(): AppliedCoupon | null {
  return loadCouponFromStorage()
}

function getServerCouponSnapshot(): AppliedCoupon | null {
  return null
}

function saveItems(newItems: CartItem[]) {
  cachedItems = newItems
  itemsLoaded = true
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems))
  } catch {
    return
  }
  emitCartChange()
}

function saveCoupon(newCoupon: AppliedCoupon | null) {
  cachedCoupon = newCoupon
  couponLoaded = true
  try {
    if (newCoupon) {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(newCoupon))
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY)
    }
  } catch {
    return
  }
  emitCartChange()
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const items = useSyncExternalStore(
    subscribeCart,
    getItemsSnapshot,
    getServerItemsSnapshot
  )

  const coupon = useSyncExternalStore(
    subscribeCart,
    getCouponSnapshot,
    getServerCouponSnapshot
  )

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), [])

  const addItem = useCallback(
    (input: CartItemInput) => {
      const qty = input.quantity && input.quantity > 0 ? input.quantity : 1
      const compositeId = `${input.productId}-${input.licenseType}`

      const currentItems = getItemsSnapshot()
      const existingIndex = currentItems.findIndex(
        (item) => item.id === compositeId
      )

      let nextItems: CartItem[]
      if (existingIndex > -1) {
        nextItems = [...currentItems]
        const currentItem = nextItems[existingIndex]
        if (currentItem) {
          nextItems[existingIndex] = {
            ...currentItem,
            quantity: currentItem.quantity + qty,
          }
        }
      } else {
        nextItems = [
          ...currentItems,
          {
            id: compositeId,
            productId: input.productId,
            slug: input.slug,
            title: input.title,
            coverImageUrl: input.coverImageUrl,
            productType: input.productType,
            licenseType: input.licenseType,
            price: input.price,
            quantity: qty,
            currency: input.currency || "IDR",
            fileName: input.fileName,
            fileSizeBytes: input.fileSizeBytes,
          },
        ]
      }

      saveItems(nextItems)
      setIsOpen(true)
    },
    []
  )

  const removeItem = useCallback((id: string) => {
    const nextItems = getItemsSnapshot().filter((item) => item.id !== id)
    saveItems(nextItems)
  }, [])

  const updateQuantity = useCallback((id: string, delta: number) => {
    const nextItems = getItemsSnapshot()
      .map((item) => {
        if (item.id === id) {
          const nextQty = item.quantity + delta
          return nextQty > 0 ? { ...item, quantity: nextQty } : null
        }
        return item
      })
      .filter((item): item is CartItem => item !== null)

    saveItems(nextItems)
  }, [])

  const updateLicense = useCallback(
    (
      id: string,
      licenseType: "STANDARD" | "EXTENDED",
      newPrice: number
    ) => {
      const currentItems = getItemsSnapshot()
      const target = currentItems.find((item) => item.id === id)
      if (!target) return

      const newCompositeId = `${target.productId}-${licenseType}`
      const alreadyHasVariant = currentItems.find(
        (item) => item.id === newCompositeId
      )

      let nextItems: CartItem[]
      if (alreadyHasVariant && alreadyHasVariant.id !== id) {
        nextItems = currentItems
          .filter((item) => item.id !== id)
          .map((item) =>
            item.id === newCompositeId
              ? { ...item, quantity: item.quantity + target.quantity }
              : item
          )
      } else {
        nextItems = currentItems.map((item) =>
          item.id === id
            ? {
                ...item,
                id: newCompositeId,
                licenseType,
                price: newPrice,
              }
            : item
        )
      }

      saveItems(nextItems)
    },
    []
  )

  const applyCoupon = useCallback((newCoupon: AppliedCoupon) => {
    saveCoupon(newCoupon)
  }, [])

  const removeCoupon = useCallback(() => {
    saveCoupon(null)
  }, [])

  const clearCart = useCallback(() => {
    saveItems([])
    saveCoupon(null)
  }, [])

  const totalCount = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  )

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items]
  )

  const discountAmount = useMemo(() => {
    if (!coupon || coupon.discountPercent <= 0) return 0
    return Math.round((subtotal * coupon.discountPercent) / 100)
  }, [subtotal, coupon])

  const grandTotal = useMemo(
    () => Math.max(0, subtotal - discountAmount),
    [subtotal, discountAmount]
  )

  const value = useMemo(
    () => ({
      items,
      isOpen,
      coupon,
      totalCount,
      subtotal,
      discountAmount,
      grandTotal,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      updateLicense,
      applyCoupon,
      removeCoupon,
      clearCart,
    }),
    [
      items,
      isOpen,
      coupon,
      totalCount,
      subtotal,
      discountAmount,
      grandTotal,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      updateLicense,
      applyCoupon,
      removeCoupon,
      clearCart,
    ]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

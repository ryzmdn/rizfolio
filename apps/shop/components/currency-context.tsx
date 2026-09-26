"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react"
import {
  SUPPORTED_CURRENCIES,
  DEFAULT_CURRENCY,
  detectUserCurrency,
  convertFromIdr,
  formatCurrencyAmount,
  formatPriceFromIdr,
  type CurrencyInfo,
} from "../lib/currencies"

interface CurrencyContextValue {
  currency: string
  currencyInfo: CurrencyInfo
  setCurrency: (code: string) => void
  convert: (amountInIdr: number) => number
  format: (amountInIdr: number) => string
  formatRaw: (amountInCurrentCurrency: number) => string
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

const STORAGE_KEY = "rizfolio_shop_currency"

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<string>(DEFAULT_CURRENCY)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const detected = detectUserCurrency()
    setCurrencyState(detected)

    function handleStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY && e.newValue && SUPPORTED_CURRENCIES[e.newValue]) {
        setCurrencyState(e.newValue)
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  const setCurrency = useCallback((code: string) => {
    const uppercaseCode = code.toUpperCase()
    if (SUPPORTED_CURRENCIES[uppercaseCode]) {
      setCurrencyState(uppercaseCode)
      try {
        localStorage.setItem(STORAGE_KEY, uppercaseCode)
      } catch {
        // Ignored
      }
    }
  }, [])

  const activeCurrency = isMounted ? currency : DEFAULT_CURRENCY
  const currencyInfo =
    SUPPORTED_CURRENCIES[activeCurrency] || SUPPORTED_CURRENCIES[DEFAULT_CURRENCY]

  const convert = useCallback(
    (amountInIdr: number) => convertFromIdr(amountInIdr, activeCurrency),
    [activeCurrency]
  )

  const format = useCallback(
    (amountInIdr: number) => formatPriceFromIdr(amountInIdr, activeCurrency),
    [activeCurrency]
  )

  const formatRaw = useCallback(
    (amountInCurrentCurrency: number) =>
      formatCurrencyAmount(amountInCurrentCurrency, activeCurrency),
    [activeCurrency]
  )

  const value = useMemo(
    () => ({
      currency: activeCurrency,
      currencyInfo: currencyInfo!,
      setCurrency,
      convert,
      format,
      formatRaw,
    }),
    [activeCurrency, currencyInfo, setCurrency, convert, format, formatRaw]
  )

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency(): CurrencyContextValue {
  const context = useContext(CurrencyContext)
  if (!context) {
    const fallbackInfo = SUPPORTED_CURRENCIES[DEFAULT_CURRENCY]!
    return {
      currency: DEFAULT_CURRENCY,
      currencyInfo: fallbackInfo,
      setCurrency: () => {},
      convert: (amount: number) => amount,
      format: (amount: number) => formatPriceFromIdr(amount, DEFAULT_CURRENCY),
      formatRaw: (amount: number) => formatCurrencyAmount(amount, DEFAULT_CURRENCY),
    }
  }
  return context
}

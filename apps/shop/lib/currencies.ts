export interface CurrencyInfo {
  code: string
  name: string
  symbol: string
  exchangeRateFromIdr: number
  locale: string
  isZeroDecimal: boolean
  flag: string
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyInfo> = {
  IDR: {
    code: "IDR",
    name: "Indonesian Rupiah",
    symbol: "Rp",
    exchangeRateFromIdr: 1,
    locale: "id-ID",
    isZeroDecimal: true,
    flag: "🇮🇩",
  },
  USD: {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    exchangeRateFromIdr: 0.000063,
    locale: "en-US",
    isZeroDecimal: false,
    flag: "🇺🇸",
  },
  EUR: {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    exchangeRateFromIdr: 0.000058,
    locale: "de-DE",
    isZeroDecimal: false,
    flag: "🇪🇺",
  },
  GBP: {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    exchangeRateFromIdr: 0.000050,
    locale: "en-GB",
    isZeroDecimal: false,
    flag: "🇬🇧",
  },
  SGD: {
    code: "SGD",
    name: "Singapore Dollar",
    symbol: "S$",
    exchangeRateFromIdr: 0.000085,
    locale: "en-SG",
    isZeroDecimal: false,
    flag: "🇸🇬",
  },
  MYR: {
    code: "MYR",
    name: "Malaysian Ringgit",
    symbol: "RM",
    exchangeRateFromIdr: 0.00028,
    locale: "ms-MY",
    isZeroDecimal: false,
    flag: "🇲🇾",
  },
  AUD: {
    code: "AUD",
    name: "Australian Dollar",
    symbol: "A$",
    exchangeRateFromIdr: 0.000097,
    locale: "en-AU",
    isZeroDecimal: false,
    flag: "🇦🇺",
  },
  JPY: {
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
    exchangeRateFromIdr: 0.0097,
    locale: "ja-JP",
    isZeroDecimal: true,
    flag: "🇯🇵",
  },
  CAD: {
    code: "CAD",
    name: "Canadian Dollar",
    symbol: "C$",
    exchangeRateFromIdr: 0.000088,
    locale: "en-CA",
    isZeroDecimal: false,
    flag: "🇨🇦",
  },
}

export const DEFAULT_CURRENCY = "IDR"

export function convertFromIdr(
  amountInIdr: number,
  targetCurrencyCode: string
): number {
  const currency = SUPPORTED_CURRENCIES[targetCurrencyCode] || SUPPORTED_CURRENCIES[DEFAULT_CURRENCY]
  if (!currency || currency.code === "IDR") {
    return amountInIdr
  }

  const rawConverted = amountInIdr * currency.exchangeRateFromIdr

  if (currency.isZeroDecimal) {
    return Math.round(rawConverted)
  }

  return Math.round(rawConverted * 100) / 100
}

export function formatCurrencyAmount(
  amount: number,
  currencyCode: string
): string {
  const currency = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES[DEFAULT_CURRENCY]
  const isZeroDec = currency ? currency.isZeroDecimal : false
  const locale = currency ? currency.locale : "en-US"

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: isZeroDec ? 0 : 2,
      maximumFractionDigits: isZeroDec ? 0 : 2,
    }).format(amount)
  } catch {
    const symbol = currency ? currency.symbol : currencyCode
    return `${symbol} ${amount.toLocaleString()}`
  }
}

export function formatPriceFromIdr(
  amountInIdr: number,
  targetCurrencyCode: string
): string {
  const converted = convertFromIdr(amountInIdr, targetCurrencyCode)
  return formatCurrencyAmount(converted, targetCurrencyCode)
}

export function getStripeUnitAmount(
  amountInTargetCurrency: number,
  currencyCode: string
): number {
  const currency = SUPPORTED_CURRENCIES[currencyCode.toUpperCase()]
  const isZeroDec = currency ? currency.isZeroDecimal : false

  if (isZeroDec) {
    return Math.round(amountInTargetCurrency)
  }

  return Math.round(amountInTargetCurrency * 100)
}

export function detectUserCurrency(): string {
  if (typeof window === "undefined") {
    return DEFAULT_CURRENCY
  }

  try {
    const saved = localStorage.getItem("rizfolio_shop_currency")
    if (saved && SUPPORTED_CURRENCIES[saved]) {
      return saved
    }

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || ""
    const tzLower = timeZone.toLowerCase()

    if (
      tzLower.includes("jakarta") ||
      tzLower.includes("pontianak") ||
      tzLower.includes("makassar") ||
      tzLower.includes("jayapura") ||
      tzLower.includes("indonesia")
    ) {
      return "IDR"
    }

    if (tzLower.includes("singapore")) {
      return "SGD"
    }

    if (tzLower.includes("kuala_lumpur") || tzLower.includes("malaysia")) {
      return "MYR"
    }

    if (tzLower.includes("tokyo") || tzLower.includes("japan")) {
      return "JPY"
    }

    if (tzLower.includes("london") || tzLower.includes("belfast")) {
      return "GBP"
    }

    if (
      tzLower.includes("sydney") ||
      tzLower.includes("melbourne") ||
      tzLower.includes("brisbane") ||
      tzLower.includes("perth") ||
      tzLower.includes("australia")
    ) {
      return "AUD"
    }

    if (
      tzLower.includes("toronto") ||
      tzLower.includes("vancouver") ||
      tzLower.includes("montreal") ||
      tzLower.includes("canada")
    ) {
      return "CAD"
    }

    if (
      tzLower.includes("berlin") ||
      tzLower.includes("paris") ||
      tzLower.includes("amsterdam") ||
      tzLower.includes("rome") ||
      tzLower.includes("madrid") ||
      tzLower.includes("brussels") ||
      tzLower.includes("vienna")
    ) {
      return "EUR"
    }

    if (
      tzLower.includes("new_york") ||
      tzLower.includes("chicago") ||
      tzLower.includes("denver") ||
      tzLower.includes("los_angeles") ||
      tzLower.includes("phoenix") ||
      tzLower.includes("america")
    ) {
      return "USD"
    }

    const lang = (navigator.language || "").toLowerCase()
    if (lang.startsWith("id")) return "IDR"
    if (lang.startsWith("ja")) return "JPY"
    if (lang.startsWith("ms")) return "MYR"
    if (lang.startsWith("de") || lang.startsWith("fr") || lang.startsWith("es") || lang.startsWith("it")) return "EUR"
    if (lang.includes("gb")) return "GBP"
    if (lang.includes("au")) return "AUD"
    if (lang.includes("ca")) return "CAD"

    return "USD"
  } catch {
    return DEFAULT_CURRENCY
  }
}

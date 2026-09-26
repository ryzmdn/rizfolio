import {
  convertFromIdr,
  formatCurrencyAmount,
  formatPriceFromIdr,
} from "./currencies"

export function formatPrice(
  price: number,
  currency: string = "IDR",
  isAlreadyConverted: boolean = false
): string {
  if (isAlreadyConverted || currency === "IDR") {
    return formatCurrencyAmount(price, currency)
  }
  return formatPriceFromIdr(price, currency)
}

export function formatRawPrice(amount: number, currency: string = "IDR"): string {
  return formatCurrencyAmount(amount, currency)
}

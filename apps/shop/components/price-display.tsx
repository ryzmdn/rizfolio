"use client"

import { useCurrency } from "./currency-context"

interface PriceDisplayProps {
  amount: number
  className?: string
}

export function PriceDisplay({ amount, className }: PriceDisplayProps) {
  const { format } = useCurrency()
  return <span className={className}>{format(amount)}</span>
}

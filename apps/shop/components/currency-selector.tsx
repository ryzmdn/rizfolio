"use client"

import { useState, useRef, useEffect } from "react"
import { Globe, ChevronDown, Check } from "lucide-react"
import { useCurrency } from "./currency-context"
import { SUPPORTED_CURRENCIES } from "../lib/currencies"
import { cn } from "@workspace/ui/lib/utils"

export function CurrencySelector() {
  const { currency, setCurrency, currencyInfo } = useCurrency()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const currencyList = Object.values(SUPPORTED_CURRENCIES)

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Select display currency, currently ${currency}`}
        className={cn(
          "inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border/70 bg-muted/20 px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-muted/60 focus:outline-hidden",
          isOpen && "border-foreground/40 bg-muted/70"
        )}
      >
        <span className="text-sm select-none" aria-hidden="true">
          {currencyInfo.flag}
        </span>
        <span className="font-mono text-xs font-semibold tracking-tight">
          {currency}
        </span>
        <span className="text-[11px] text-muted-foreground">
          ({currencyInfo.symbol})
        </span>
        <ChevronDown
          className={cn(
            "size-3 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180 text-foreground"
          )}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Supported Currencies"
          className="absolute right-0 z-50 mt-1.5 w-60 origin-top-right animate-in rounded-md border border-border/70 bg-popover/98 p-1 shadow-lg backdrop-blur-xl duration-150 fade-in-0 zoom-in-95 focus:outline-hidden"
        >
          <div className="border-b border-border/50 px-2.5 py-2">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
              <Globe className="size-3.5 text-muted-foreground" />
              <span>Location Currency</span>
            </div>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              Live equivalent checkout pricing in your regional currency.
            </p>
          </div>

          <div className="max-h-64 space-y-0.5 overflow-y-auto py-1">
            {currencyList.map((cur) => {
              const isSelected = cur.code === currency

              return (
                <button
                  key={cur.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setCurrency(cur.code)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between rounded-sm px-2.5 py-1.5 text-left text-xs transition-colors",
                    isSelected
                      ? "bg-muted font-semibold text-foreground"
                      : "text-foreground hover:bg-muted/60"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base select-none" aria-hidden="true">
                      {cur.flag}
                    </span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold">
                          {cur.code}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {cur.symbol}
                        </span>
                      </div>
                      <span className="max-w-[130px] truncate text-[10px] text-muted-foreground">
                        {cur.name}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="size-3.5 shrink-0 text-foreground" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

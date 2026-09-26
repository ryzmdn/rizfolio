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
          "inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-border/80 bg-card px-2.5 py-1.5 text-xs font-medium text-foreground transition-all duration-150 hover:border-primary/40 hover:bg-muted/60 focus:outline-hidden focus:ring-1 focus:ring-primary/40 shadow-xs",
          isOpen && "border-primary/60 bg-muted/80 ring-1 ring-primary/40"
        )}
      >
        <span className="text-sm select-none" aria-hidden="true">
          {currencyInfo.flag}
        </span>
        <span className="font-mono font-semibold text-xs tracking-tight">
          {currency}
        </span>
        <span className="text-muted-foreground text-[11px]">
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
          className="absolute right-0 mt-1.5 w-60 origin-top-right rounded-2xl border border-border/90 bg-card/95 p-1.5 shadow-xl backdrop-blur-md z-50 focus:outline-hidden animate-in fade-in-0 zoom-in-95 duration-150"
        >
          <div className="px-2.5 py-2 border-b border-border/60">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
              <Globe className="size-3.5 text-primary" />
              <span>Location Currency</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Live equivalent checkout pricing in your regional currency.
            </p>
          </div>

          <div className="max-h-64 overflow-y-auto py-1 space-y-0.5">
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
                    "flex w-full cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs transition-colors",
                    isSelected
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground hover:bg-muted/70"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base select-none" aria-hidden="true">
                      {cur.flag}
                    </span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs">
                          {cur.code}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {cur.symbol}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground truncate max-w-[130px]">
                        {cur.name}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="size-3.5 text-primary shrink-0" />
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

"use client"

import { useState } from "react"
import { ShoppingBag, Check } from "lucide-react"
import { useCart, type CartItemInput } from "./cart-provider"
import { cn } from "@workspace/ui/lib/utils"

interface AddToCartButtonProps {
  product: {
    id: string
    slug: string
    title: string
    coverImageUrl?: string | null
    productType: string
    price: number
    currency?: string
    fileName?: string
    fileSizeBytes?: number
  }
  licenseType?: "STANDARD" | "EXTENDED"
  className?: string
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  label?: string
  showIcon?: boolean
}

export function AddToCartButton({
  product,
  licenseType = "STANDARD",
  className,
  variant = "primary",
  size = "md",
  label,
  showIcon = true,
}: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [justAdded, setJustAdded] = useState(false)

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-md gap-1.5",
    md: "px-4 py-2 text-xs font-medium rounded-md gap-2",
    lg: "px-5 py-2.5 text-xs font-semibold rounded-md gap-2",
  }

  const variantClasses = {
    primary:
      "bg-foreground text-background hover:bg-foreground/90 transition-colors",
    secondary: "bg-muted text-foreground hover:bg-muted/80 transition-colors",
    outline:
      "border border-border/70 bg-background hover:border-foreground/30 hover:bg-muted/60 text-foreground transition-colors",
  }

  function handleAddToCart() {
    const itemInput: CartItemInput = {
      productId: product.id,
      slug: product.slug,
      title: product.title,
      coverImageUrl: product.coverImageUrl,
      productType: product.productType,
      licenseType,
      price: product.price,
      currency: product.currency || "IDR",
      fileName: product.fileName,
      fileSizeBytes: product.fileSizeBytes,
    }

    addItem(itemInput)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  const buttonText = label || (justAdded ? "Added to Cart" : "Add to Cart")

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center font-medium transition-colors",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {showIcon &&
        (justAdded ? (
          <Check className="size-3.5 shrink-0 text-emerald-500" />
        ) : (
          <ShoppingBag className="size-3.5 shrink-0" />
        ))}
      <span>{buttonText}</span>
    </button>
  )
}

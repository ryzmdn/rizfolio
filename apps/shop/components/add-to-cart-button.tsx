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
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-4 py-2.5 text-xs font-medium rounded-xl gap-2",
    lg: "px-5 py-3.5 text-sm font-semibold rounded-xl gap-2.5",
  }

  const variantClasses = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs active:scale-[0.99]",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.99]",
    outline:
      "border border-border bg-background hover:bg-muted text-foreground active:scale-[0.99]",
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
        "inline-flex cursor-pointer items-center justify-center transition-all",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {showIcon &&
        (justAdded ? (
          <Check className="size-4 text-primary-foreground" />
        ) : (
          <ShoppingBag className="size-4" />
        ))}
      <span>{buttonText}</span>
    </button>
  )
}

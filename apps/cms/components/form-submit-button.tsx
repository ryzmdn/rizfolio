"use client"

import React from "react"
import { useFormStatus } from "react-dom"
import { Loader2, Plus, Save, Upload, RefreshCw } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

const ICON_MAP = {
  plus: Plus,
  save: Save,
  upload: Upload,
  refresh: RefreshCw,
} as const

export type FormSubmitIconName = keyof typeof ICON_MAP

interface FormSubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  pendingLabel?: string
  icon?: FormSubmitIconName
  variant?: "primary" | "secondary" | "destructive" | "outline"
}

export function FormSubmitButton({
  children = "Simpan",
  pendingLabel = "Menyimpan...",
  icon,
  variant = "primary",
  className = "",
  disabled,
  ...props
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus()
  const IconComponent = icon ? ICON_MAP[icon] : null

  const variantStyles = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs active:scale-[0.98]",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs active:scale-[0.98]",
    outline:
      "border border-border bg-background text-foreground hover:bg-muted active:scale-[0.98]",
  }

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all duration-150 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {pending ? (
        <>
          <Loader2 className="size-3.5 animate-spin" />
          <span>{pendingLabel}</span>
        </>
      ) : (
        <>
          {IconComponent && <IconComponent className="size-3.5" />}
          <span>{children}</span>
        </>
      )}
    </button>
  )
}

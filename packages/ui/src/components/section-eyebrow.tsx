import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

export interface SectionEyebrowProps extends React.HTMLAttributes<HTMLDivElement> {
  number?: number | string
  label: string
  separator?: string
}

export function SectionEyebrow({
  number,
  label,
  separator = "//",
  className,
  ...props
}: SectionEyebrowProps) {
  const formattedNumber =
    typeof number === "number"
      ? String(number).padStart(2, "0")
      : number !== undefined && number !== null && String(number).length === 1
        ? String(number).padStart(2, "0")
        : number

  return (
    <div
      className={cn("flex items-center gap-x-2 text-sm font-medium", className)}
      {...props}
    >
      {formattedNumber && <span>{formattedNumber}</span>}
      {formattedNumber && (
        <span className="text-sm text-ring select-none" aria-hidden="true">
          {separator}
        </span>
      )}
      <p>{label}</p>
    </div>
  )
}

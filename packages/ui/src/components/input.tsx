import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        aria-invalid={error ? "true" : undefined}
        className={cn(
          "w-full rounded-2xl border border-foreground/10 bg-background/50 px-4 py-2.5 text-xs text-foreground transition-luxury outline-none placeholder:text-muted-foreground/60 md:text-sm",
          "hover:border-foreground/20 hover:bg-background/80",
          "focus:border-foreground/30 focus:bg-background focus:ring-4 focus:ring-foreground/10",
          "disabled:pointer-events-none disabled:opacity-50",
          error &&
            "animate-shake border-destructive text-destructive focus:border-destructive focus:ring-destructive/20",
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export interface FloatingInputProps extends InputProps {
  label: string
}

export const FloatingInput = React.forwardRef<
  HTMLInputElement,
  FloatingInputProps
>(({ label, id, className, error, ...props }, ref) => {
  const inputId = id || React.useId()

  return (
    <div className="relative w-full">
      <input
        id={inputId}
        ref={ref}
        placeholder=" "
        aria-invalid={error ? "true" : undefined}
        className={cn(
          "peer w-full rounded-2xl border border-foreground/10 bg-background/50 px-4 pt-5 pb-2 text-xs text-foreground transition-luxury outline-none md:text-sm",
          "hover:border-foreground/20 hover:bg-background/80",
          "focus:border-foreground/30 focus:bg-background focus:ring-4 focus:ring-foreground/10",
          "disabled:pointer-events-none disabled:opacity-50",
          error &&
            "animate-shake border-destructive text-destructive focus:border-destructive focus:ring-destructive/20",
          className
        )}
        {...props}
      />
      <label
        htmlFor={inputId}
        className={cn(
          "pointer-events-none absolute top-2 left-4 origin-left font-mono text-[10px] tracking-wider text-muted-foreground uppercase transition-transform-luxury",
          "peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-muted-foreground/60",
          "peer-focus:top-2 peer-focus:text-[10px] peer-focus:tracking-wider peer-focus:text-foreground",
          error && "text-destructive peer-focus:text-destructive"
        )}
      >
        {label}
      </label>
    </div>
  )
})
FloatingInput.displayName = "FloatingInput"

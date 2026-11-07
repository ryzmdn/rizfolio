import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export interface ModalOverlayProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl"
  className?: string
}

export function ModalOverlay({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "xl",
  className,
}: ModalOverlayProps) {
  const dialogRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  }

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative max-h-[90vh] w-full overflow-y-auto rounded-3xl border border-foreground/10 bg-card/95 p-6 shadow-2xl backdrop-blur-2xl ring-1 ring-foreground/5 animate-in zoom-in-95 duration-300 ease-luxury sm:p-8",
          maxWidthClasses[maxWidth],
          className
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-6 top-6 rounded-full border border-foreground/10 p-2 text-muted-foreground transition-transform duration-300 ease-luxury hover:rotate-90 hover:bg-foreground/10 hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
        >
          <X className="size-4" />
        </button>

        {(title || description) && (
          <div className="mb-6 border-b border-foreground/8 pb-4 pr-10">
            {title && (
              <h2 className="font-serif text-lg md:text-xl font-medium tracking-tight text-foreground">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  )
}


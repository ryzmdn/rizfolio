import { ReactNode } from "react"

export interface CmsPageShellProps {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

export function CmsPageShell({
  title,
  description,
  actions,
  children,
}: CmsPageShellProps) {
  return (
    <div className="space-y-6 p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/70 pb-5">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h1>
          {description && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      <div>{children}</div>
    </div>
  )
}

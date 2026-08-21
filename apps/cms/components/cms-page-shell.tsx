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
    <div className="mx-auto max-w-6xl space-y-6 p-6 md:p-8">
      <div className="flex flex-col gap-3 border-b border-border/70 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h1>
          {description && (
            <p className="text-xs leading-relaxed text-muted-foreground">
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

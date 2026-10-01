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
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="flex flex-col gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2 sm:self-auto">
            {actions}
          </div>
        )}
      </div>

      <div>{children}</div>
    </div>
  )
}

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
    <div className="mx-auto max-w-7xl space-y-10 p-5 sm:p-8 md:p-10 lg:p-12">
      <div className="flex flex-col gap-6 border-b border-foreground/8 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.03] px-3.5 py-1 font-mono text-[11px] tracking-widest text-muted-foreground uppercase backdrop-blur-md">
            <span>[ MISSION CONTROL // 06 ]</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="max-w-3xl text-sm sm:text-base font-light leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2.5 sm:self-auto">
            {actions}
          </div>
        )}
      </div>

      <div>{children}</div>
    </div>
  )
}

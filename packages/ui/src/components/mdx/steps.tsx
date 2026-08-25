import React from "react"

interface StepsProps {
  children: React.ReactNode
  className?: string
}

export function Steps({ children, className = "" }: StepsProps) {
  return (
    <div
      className={`my-6 ml-4 space-y-6 border-l border-border/80 pl-6 [counter-reset:step] ${className}`}
    >
      {children}
    </div>
  )
}

interface StepProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export function Step({ title, children, className = "" }: StepProps) {
  return (
    <div className={`relative [counter-increment:step] ${className}`}>
      <div className="absolute top-0 -left-9.25 flex size-6 items-center justify-center rounded-full border border-border/80 bg-card text-[11px] font-semibold text-primary shadow-xs ring-4 ring-background before:content-[counter(step)]" />
      {title && (
        <h4 className="mb-2 text-sm font-semibold tracking-tight text-foreground">
          {title}
        </h4>
      )}
      <div className="text-sm leading-relaxed text-muted-foreground [&>p]:leading-relaxed">
        {children}
      </div>
    </div>
  )
}

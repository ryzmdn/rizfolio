import { type ComponentPropsWithoutRef } from "react"

import { cn } from "@workspace/ui/lib/utils"

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode
  reverse?: boolean
  pauseOnHover?: boolean
  vertical?: boolean
  repeat?: number
  className?: string
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex gap-(--gap) overflow-hidden p-2 [--duration:40s] [--gap:1rem]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around gap-(--gap)", {
              "animate-marquee flex-row": !vertical,
              "animate-marquee-vertical flex-col": vertical,
              "group-hover:paused": pauseOnHover,
              "shimmer-reverse": reverse,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  )
}

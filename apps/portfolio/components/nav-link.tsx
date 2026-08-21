import Link from "next/link"
import { cn } from "@workspace/ui/lib/utils"

interface SwapTextProps extends React.ComponentPropsWithoutRef<"div"> {
  first: string
  last: string
  supportsHover?: boolean
  textClassName?: string
  initialTextClassName?: string
  finalTextClassName?: string
  href: string
}

export function NavLink({
  first,
  last,
  className,
  supportsHover = true,
  textClassName,
  initialTextClassName,
  finalTextClassName,
  href,
  ...props
}: SwapTextProps) {
  const common = "transition-transform duration-200 ease-linear"

  const longWord = last.length > first.length ? last : null

  return (
    <div
      {...props}
      className={cn("relative overflow-hidden text-foreground", className)}
    >
      <Link href={href} className={cn("group/swap text-left", textClassName)}>
        <span
          className={cn(common, initialTextClassName, {
            "flex flex-col": true,
            "group-hover/swap:-translate-y-full": supportsHover,
          })}
        >
          {first}
          {Boolean(longWord?.length) && (
            <span className="invisible h-0">{longWord}</span>
          )}
        </span>
        <span
          className={cn(`${common} absolute top-full`, finalTextClassName, {
            "group-hover/swap:-translate-y-full": supportsHover,
          })}
        >
          {last}
        </span>
      </Link>
    </div>
  )
}

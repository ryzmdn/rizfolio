import { cn } from "@workspace/ui/lib/utils"

export interface Props {
  className?: string
  height?: string
  blurLevels?: number[]
  position?: "top" | "bottom"
}

export function ProgressiveBlur({
  className,
  height = "30%",
  blurLevels = [0.5, 1, 2, 4, 8, 16, 32, 64],
  position = "bottom",
}: Readonly<Props>) {
  const divElements = Array.from(
    { length: Math.max(blurLevels.length - 2, 0) }
  )

  const direction = position === "top" ? "to top" : "to bottom"
  const step = 100 / blurLevels.length

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 z-10",
        position === "top" ? "top-0" : "bottom-0",
        className
      )}
      style={{ height }}
    >
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          backdropFilter: `blur(${blurLevels[0]}px)`,
          WebkitBackdropFilter: `blur(${blurLevels[0]}px)`,
          maskImage: `
            linear-gradient(
              ${direction},
              rgba(0,0,0,0) 0%,
              rgba(0,0,0,1) ${step}%,
              rgba(0,0,0,1) ${step * 2}%,
              rgba(0,0,0,0) ${step * 3}%
            )
          `,
          WebkitMaskImage: `
            linear-gradient(
              ${direction},
              rgba(0,0,0,0) 0%,
              rgba(0,0,0,1) ${step}%,
              rgba(0,0,0,1) ${step * 2}%,
              rgba(0,0,0,0) ${step * 3}%
            )
          `,
        }}
      />

      {divElements.map((_, index) => {
        const blurIndex = index + 1
        const startPercent = blurIndex * step
        const midPercent = (blurIndex + 1) * step
        const endPercent = (blurIndex + 2) * step
        const fadeOutPercent = (blurIndex + 3) * step

        const maskGradient = `
          linear-gradient(
            ${direction},
            rgba(0,0,0,0) ${startPercent}%,
            rgba(0,0,0,1) ${midPercent}%,
            rgba(0,0,0,1) ${endPercent}%,
            rgba(0,0,0,0) ${fadeOutPercent}%
          )
        `

        return (
          <div
            key={`blur-${index}`}
            className="absolute inset-0"
            style={{
              zIndex: index + 2,
              backdropFilter: `blur(${blurLevels[blurIndex]}px)`,
              WebkitBackdropFilter: `blur(${blurLevels[blurIndex]}px)`,
              maskImage: maskGradient,
              WebkitMaskImage: maskGradient,
            }}
          />
        )
      })}

      <div
        className="absolute inset-0"
        style={{
          zIndex: blurLevels.length,
          backdropFilter: `blur(${blurLevels.at(-1)}px)`,
          WebkitBackdropFilter: `blur(${blurLevels.at(-1)}px)`,
          maskImage: `
            linear-gradient(
              ${direction},
              rgba(0,0,0,0) ${100 - step}%,
              rgba(0,0,0,1) 100%
            )
          `,
          WebkitMaskImage: `
            linear-gradient(
              ${direction},
              rgba(0,0,0,0) ${100 - step}%,
              rgba(0,0,0,1) 100%
            )
          `,
        }}
      />
    </div>
  )
}
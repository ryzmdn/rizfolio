"use client"

import { useState } from "react"
import Image from "next/image"
import { Layers } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface ImageGalleryProps {
  images: string[]
  title: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-16/10 w-full items-center justify-center rounded-lg border border-border/60 bg-muted/30 text-muted-foreground">
        <Layers className="size-10" />
      </div>
    )
  }

  const activeImage = images[selectedIndex] || images[0] || ""

  return (
    <div className="space-y-3">
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-lg border border-border/60 bg-muted/30">
        <Image
          src={activeImage}
          alt={`${title} preview ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover transition-opacity duration-300"
        />

        <div className="absolute bottom-2.5 right-2.5 rounded-md border border-border/70 bg-background/95 px-2 py-0.5 text-[10px] font-mono text-muted-foreground shadow-xs">
          <span>
            {selectedIndex + 1} / {images.length}
          </span>
        </div>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-5">
          {images.map((img, idx) => {
            const isSelected = idx === selectedIndex

            return (
              <button
                key={img + idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                aria-label={`View preview image ${idx + 1}`}
                className={cn(
                  "relative aspect-video overflow-hidden rounded-md border transition-all duration-150 focus:outline-hidden",
                  isSelected
                    ? "border-foreground/80 ring-1 ring-foreground/30 opacity-100"
                    : "border-border/60 opacity-60 hover:border-border hover:opacity-90"
                )}
              >
                <Image
                  src={img}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

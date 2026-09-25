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
      <div className="flex aspect-16/10 w-full items-center justify-center rounded-2xl border border-border/80 bg-muted/50 text-muted-foreground">
        <Layers className="size-12" />
      </div>
    )
  }

  const activeImage = images[selectedIndex] || images[0] || ""

  return (
    <div className="space-y-4">
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl border border-border/80 bg-muted shadow-sm">
        <Image
          src={activeImage}
          alt={`${title} preview ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover transition-opacity duration-300"
        />

        <div className="absolute bottom-3 right-3 rounded-lg border border-border/80 bg-background/80 px-2.5 py-1 text-[11px] font-mono text-muted-foreground backdrop-blur-md">
          <span>
            {selectedIndex + 1} / {images.length}
          </span>
        </div>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((img, idx) => {
            const isSelected = idx === selectedIndex

            return (
              <button
                key={img + idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                aria-label={`View preview image ${idx + 1}`}
                className={cn(
                  "relative aspect-video overflow-hidden rounded-xl border transition-all duration-200 focus:outline-hidden",
                  isSelected
                    ? "border-primary ring-2 ring-primary/40 shadow-xs"
                    : "border-border/60 opacity-70 hover:border-border hover:opacity-100"
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

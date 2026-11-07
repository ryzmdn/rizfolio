import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

export interface ImageZoomProps extends React.HTMLAttributes<HTMLDivElement> {
  scale?: "sm" | "md" | "lg"
  children: React.ReactNode
}

export function ImageZoom({
  scale = "md",
  className,
  children,
  ...props
}: ImageZoomProps) {
  const scaleClasses = {
    sm: "group-hover:scale-103",
    md: "group-hover:scale-105",
    lg: "group-hover:scale-108",
  }

  return (
    <div
      className={cn(
        "group overflow-hidden rounded-2xl [&_img]:transition-transform [&_img]:duration-500 [&_img]:ease-luxury",
        scaleClasses[scale],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface ImageOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  overlayClassName?: string
  children: React.ReactNode
}

export function ImageOverlay({
  overlayClassName,
  className,
  children,
  ...props
}: ImageOverlayProps) {
  return (
    <div className={cn("group relative overflow-hidden", className)} {...props}>
      {children}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-background/0 transition-colors duration-400 ease-luxury group-hover:bg-background/20",
          overlayClassName
        )}
      />
    </div>
  )
}

export interface ImageGrayscaleProps extends React.HTMLAttributes<HTMLDivElement> {
  reverse?: boolean
  children: React.ReactNode
}

export function ImageGrayscale({
  reverse = false,
  className,
  children,
  ...props
}: ImageGrayscaleProps) {
  return (
    <div
      className={cn(
        "group overflow-hidden [&_img]:transition-all [&_img]:duration-500 [&_img]:ease-luxury",
        reverse
          ? "[&_img]:grayscale-0 group-hover:[&_img]:grayscale"
          : "[&_img]:grayscale group-hover:[&_img]:grayscale-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

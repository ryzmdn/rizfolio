export const SHARED_ASSETS = {
  logos: {
    default: "/logos/logo.svg",
  },
  icons: {
    file: "/file.svg",
    globe: "/globe.svg",
    window: "/window.svg",
    next: "/next.svg",
    vercel: "/vercel.svg",
  },
  get: (path: string): string => (path.startsWith("/") ? path : `/${path}`),
} as const

export type SharedAssets = typeof SHARED_ASSETS

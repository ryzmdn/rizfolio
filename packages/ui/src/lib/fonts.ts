import { Google_Sans, Google_Sans_Code, Lora } from "next/font/google"

export const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
})

export const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
})

export const googleSansCode = Google_Sans_Code({
  variable: "--font-google-sans-code",
  subsets: ["latin"],
})

export const fontVariables = `${googleSans.variable} ${googleSansCode.variable} ${lora.variable}`

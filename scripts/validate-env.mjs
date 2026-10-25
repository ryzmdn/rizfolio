import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")

export function validateEnvironment() {
  const envPath = path.join(rootDir, ".env")
  if (fs.existsSync(envPath)) {
    const rawContent = fs.readFileSync(envPath, "utf-8")
    const lines = rawContent.split(/\r?\n/)
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const match = trimmed.match(/^([^=]+)=(.*)$/)
      if (match) {
        const key = match[1].trim()
        let val = match[2].trim()
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1)
        }
        if (!process.env[key]) {
          process.env[key] = val
        }
      }
    }
  }

  const configurations = [
    {
      key: "DATABASE_URL",
      fallback: null,
      requiredInProduction: true,
    },
    {
      key: "NEXT_PUBLIC_API_URL",
      fallback: "https://api.ryzmdn.me",
      requiredInProduction: false,
    },
    {
      key: "API_MASTER_KEY",
      fallback: "rz_live_9f83ac74e12e8b217643db841fce9a12",
      requiredInProduction: false,
    },
  ]

  let isMissingCritical = false

  for (const config of configurations) {
    if (!process.env[config.key]) {
      if (config.fallback) {
        process.env[config.key] = config.fallback
      } else if (
        process.env.NODE_ENV === "production" &&
        config.requiredInProduction
      ) {
        console.error(
          `[Environment Validation Error]: Required environment variable '${config.key}' is missing.`
        )
        isMissingCritical = true
      }
    }
  }

  if (isMissingCritical) {
    process.exit(1)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  validateEnvironment()
}

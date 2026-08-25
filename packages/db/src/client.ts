import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

if (!process.env.DATABASE_URL) {
  try {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    dotenv.config({ path: path.resolve(__dirname, "../../.env") })
    dotenv.config({ path: path.resolve(__dirname, "../../../../.env") })
    dotenv.config({ path: path.resolve(process.cwd(), ".env") })
    dotenv.config({ path: path.resolve(process.cwd(), "../../.env") })
  } catch {
    // Ignore in non-file environments
  }
}

const rawConnectionString = process.env.DATABASE_URL

if (!rawConnectionString || rawConnectionString.trim() === "") {
  if (process.env.NODE_ENV === "test") {
    process.env.DATABASE_URL =
      "postgresql://postgres:postgres@localhost:5432/postgres_test"
  } else {
    throw new Error(
      "CRITICAL DATABASE CONFIGURATION ERROR: DATABASE_URL environment variable is missing. Please define a valid PostgreSQL connection string in your .env or deployment configuration."
    )
  }
}

const connectionString = process.env
  .DATABASE_URL!.replace(/&#35;/g, "%23")
  .trim()

const isProduction = process.env.NODE_ENV === "production"

const isSupabase = connectionString.includes(".supabase.com")

declare global {
  var __postgresClient: ReturnType<typeof postgres> | undefined
  var __drizzleDb: ReturnType<typeof drizzle<typeof schema>> | undefined
}

const client =
  globalThis.__postgresClient ??
  postgres(connectionString, {
    prepare: false,
    max: isProduction ? 15 : 10,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: isSupabase ? "require" : isProduction ? "require" : false,
  })

if (!isProduction) {
  globalThis.__postgresClient = client
}

export const db = globalThis.__drizzleDb ?? drizzle(client, { schema })

if (!isProduction) {
  globalThis.__drizzleDb = db
}
export type Database = typeof db

export { client }

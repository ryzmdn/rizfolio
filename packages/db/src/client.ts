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

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/postgres"

const client = postgres(connectionString, {
  prepare: false,
  max: 10,
  idle_timeout: 30,
  connect_timeout: 10,
})

export const db = drizzle(client, { schema })
export type Database = typeof db

export { client }

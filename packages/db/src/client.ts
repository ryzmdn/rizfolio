import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/postgres"

// Disable prefetch in serverless/pooled environments
const client = postgres(connectionString, {
  prepare: false,
  max: process.env.NODE_ENV === "production" ? 10 : 1,
})

export const db = drizzle(client, { schema })
export type Database = typeof db

export { client }

import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import postgres from "postgres"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, "../../.env") })
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") })

async function runKeepAlive() {
  const startTime = Date.now()
  console.log("Starting Supabase Keep-Alive Health Check...")

  const databaseUrl = process.env.DATABASE_URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  let pgSuccess = false
  let restSuccess = false

  if (databaseUrl) {
    try {
      console.log("Pinging PostgreSQL database...")
      const sql = postgres(databaseUrl, {
        max: 1,
        idle_timeout: 5,
        connect_timeout: 10,
        ssl: "require",
      })

      const result =
        await sql`SELECT NOW() AS server_time, current_database() AS db_name;`
      await sql.end()

      const first = result?.[0]
      if (first) {
        console.log(
          `[PASS] PostgreSQL Connected: Database '${first.db_name}' at ${first.server_time}`
        )
        pgSuccess = true
      }
    } catch (error) {
      console.error(
        "[WARN] PostgreSQL connection failed:",
        error instanceof Error ? error.message : error
      )
    }
  } else {
    console.log("[INFO] DATABASE_URL not provided, skipping direct SQL ping.")
  }

  if (supabaseUrl && supabaseKey) {
    try {
      console.log("Pinging Supabase PostgREST endpoint...")
      const endpoint = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/`
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      })

      if (response.ok || response.status === 200 || response.status === 404) {
        console.log(
          `[PASS] Supabase REST API Active: HTTP status ${response.status}`
        )
        restSuccess = true
      } else {
        console.warn(
          `[WARN] Supabase REST API returned unexpected status: ${response.status}`
        )
      }
    } catch (error) {
      console.error(
        "[WARN] Supabase REST ping failed:",
        error instanceof Error ? error.message : error
      )
    }
  } else {
    console.log(
      "[INFO] NEXT_PUBLIC_SUPABASE_URL or API key not provided, skipping REST ping."
    )
  }

  const duration = Date.now() - startTime
  console.log(`Keep-Alive routine completed in ${duration}ms.`)

  if (!pgSuccess && !restSuccess && (databaseUrl || supabaseUrl)) {
    console.error(
      "[ERROR] All keep-alive ping mechanisms failed. Check network or credentials."
    )
    process.exit(1)
  }

  console.log("[SUCCESS] Supabase activity recorded successfully.")
}

runKeepAlive().catch((err) => {
  console.error("[FATAL] Keep-alive script crashed:", err)
  process.exit(1)
})

import { spawn } from "node:child_process"
import http from "node:http"

const PORT = 3007
const BASE_URL = `http://localhost:${PORT}`
const MASTER_KEY = "rz_live_9f83ac74e12e8b217643db841fce9a12"

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function request(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url)
    const req = http.request(
      {
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname + parsed.search,
        method: options.method || "GET",
        headers: options.headers || {},
      },
      (res) => {
        let data = ""
        res.on("data", (chunk) => {
          data += chunk
        })
        res.on("end", () => {
          let json = null
          try {
            json = JSON.parse(data)
          } catch {
            // non-json
          }
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: json || data,
          })
        })
      }
    )

    req.on("error", reject)

    if (body) {
      req.write(typeof body === "string" ? body : JSON.stringify(body))
    }
    req.end()
  })
}

async function runTests() {
  console.log("🔍 Checking if server is already running on port 3007...")
  let serverProc = null
  let serverAlreadyRunning = false

  try {
    const check = await request(`${BASE_URL}/api/v1/health`)
    if (check.status === 200) {
      serverAlreadyRunning = true
      console.log("✅ Reusing currently active server on port 3007")
    }
  } catch {
    // not running
  }

  if (!serverAlreadyRunning) {
    console.log(
      "🚀 Starting apps/api on port 3007 for automated live verification..."
    )
    serverProc = spawn("pnpm", ["--filter", "api", "start"], {
      shell: true,
      stdio: "pipe",
      env: { ...process.env, PORT: String(PORT) },
    })

    serverProc.stdout.on("data", (d) => {
      const str = d.toString()
      if (
        str.includes("Ready in") ||
        str.includes("Listening on") ||
        str.includes("http://")
      ) {
        console.log(`[server stdout] ${str.trim()}`)
      }
    })

    serverProc.stderr.on("data", (d) => {
      console.error(`[server stderr] ${d.toString().trim()}`)
    })

    // Wait for server to be responsive
    let ready = false
    for (let attempt = 1; attempt <= 30; attempt++) {
      await wait(1000)
      try {
        const res = await request(`${BASE_URL}/api/v1/health`)
        if (res.status === 200) {
          ready = true
          console.log(`✅ Server is healthy & responsive after ${attempt}s`)
          break
        }
      } catch {
        process.stdout.write(".")
      }
    }

    if (!ready) {
      serverProc.kill("SIGTERM")
      throw new Error(
        "❌ Server failed to respond to /api/v1/health within 30 seconds"
      )
    }
  }

  const results = []

  const runCheck = async (name, fn) => {
    try {
      await fn()
      results.push({ name, passed: true })
      console.log(`  ✅ PASS: ${name}`)
    } catch (err) {
      results.push({ name, passed: false, error: err.message })
      console.error(`  ❌ FAIL: ${name} ->`, err.message)
    }
  }

  console.log("\n🧪 Running API Test Suite:")

  // Test 1: Healthcheck
  await runCheck(
    "GET /api/v1/health returns healthy operational status",
    async () => {
      const res = await request(`${BASE_URL}/api/v1/health`)
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
      if (res.body?.success !== true) throw new Error("Expected success: true")
      if (!res.body?.data?.status) throw new Error("Missing status in response")
    }
  )

  // Test 2: OpenAPI 3.1 Spec
  await runCheck(
    "GET /api/v1/openapi.json serves valid OpenAPI 3.1 document",
    async () => {
      const res = await request(`${BASE_URL}/api/v1/openapi.json`)
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
      if (res.body?.openapi !== "3.1.0")
        throw new Error(`Expected openapi 3.1.0, got ${res.body?.openapi}`)
      if (!res.body?.paths?.["/api/v1/health"])
        throw new Error("Missing health endpoint in OpenAPI paths")
    }
  )

  // Test 3: CORS Preflight OPTIONS
  await runCheck(
    "OPTIONS /api/v1/portfolio/profile handles CORS preflight",
    async () => {
      const res = await request(`${BASE_URL}/api/v1/portfolio/profile`, {
        method: "OPTIONS",
        headers: {
          Origin: "https://ryzmdn.me",
          "Access-Control-Request-Method": "GET",
        },
      })
      if (res.status !== 204 && res.status !== 200)
        throw new Error(`Expected 204/200, got ${res.status}`)
      if (!res.headers["access-control-allow-origin"])
        throw new Error("Missing Access-Control-Allow-Origin header")
    }
  )

  // Test 4: Public GET Endpoint
  await runCheck(
    "GET /api/v1/portfolio/profile returns profile data",
    async () => {
      const res = await request(`${BASE_URL}/api/v1/portfolio/profile`, {
        headers: { Origin: "https://ryzmdn.me" },
      })
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
      if (res.body?.success !== true) throw new Error("Expected success: true")
      if (!res.headers["x-response-time-ms"])
        throw new Error("Missing X-Response-Time-Ms header")
    }
  )

  // Test 5: Unauthenticated access to protected CMS endpoint
  await runCheck(
    "GET /api/v1/cms/overview rejects unauthenticated request with 401",
    async () => {
      const res = await request(`${BASE_URL}/api/v1/cms/overview`)
      if (res.status !== 401)
        throw new Error(`Expected 401 Unauthorized, got ${res.status}`)
      if (res.body?.success !== false)
        throw new Error("Expected success: false in error envelope")
      if (res.body?.error?.code !== "UNAUTHORIZED")
        throw new Error(`Expected UNAUTHORIZED, got ${res.body?.error?.code}`)
    }
  )

  // Test 6: Authenticated access via Master API Key
  await runCheck(
    "GET /api/v1/cms/overview succeeds with valid X-API-Key",
    async () => {
      const res = await request(`${BASE_URL}/api/v1/cms/overview`, {
        headers: {
          "X-API-Key": MASTER_KEY,
        },
      })
      if (res.status !== 200)
        throw new Error(
          `Expected 200 OK, got ${res.status} (${JSON.stringify(res.body)})`
        )
      if (typeof res.body?.data?.metrics?.posts?.total !== "number")
        throw new Error("Expected metrics.posts.total in overview")
    }
  )

  // Test 7: Validation error envelope
  await runCheck(
    "POST /api/v1/auth/login with invalid payload returns 400 with details",
    async () => {
      const res = await request(
        `${BASE_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
        { email: "not-an-email", password: "" }
      )
      if (res.status !== 400)
        throw new Error(`Expected 400 Bad Request, got ${res.status}`)
      if (res.body?.success !== false)
        throw new Error("Expected success: false")
      if (res.body?.error?.code !== "VALIDATION_ERROR")
        throw new Error(
          `Expected VALIDATION_ERROR, got ${res.body?.error?.code}`
        )
      if (!Array.isArray(res.body?.error?.details))
        throw new Error("Expected validation details array")
    }
  )

  // Test 8: Anti-bot Honeypot trap
  await runCheck(
    "POST /api/v1/portfolio/inquiries rejects spambot honeypot payload",
    async () => {
      const res = await request(
        `${BASE_URL}/api/v1/portfolio/inquiries`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
        {
          name: "Bot Spammer",
          email: "bot@spam.com",
          subject: "Spam proposal",
          message: "Buy cheap goods",
          honeypot: "I am a malicious bot filling invisible fields",
        }
      )
      // Honeypot should trigger 400
      if (res.status !== 400)
        throw new Error(`Expected 400 on honeypot fill, got ${res.status}`)
    }
  )

  // Test 9: Public Blog Posts endpoint
  await runCheck(
    "GET /api/v1/blog/posts returns paginated articles list",
    async () => {
      const res = await request(`${BASE_URL}/api/v1/blog/posts?page=1&limit=5`)
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
      if (res.body?.success !== true) throw new Error("Expected success: true")
      if (!Array.isArray(res.body?.data)) throw new Error("Expected data array")
    }
  )

  // Test 10: Public Shop Products endpoint
  await runCheck("GET /api/v1/shop/products returns product list", async () => {
    const res = await request(`${BASE_URL}/api/v1/shop/products`)
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
    if (res.body?.success !== true) throw new Error("Expected success: true")
  })

  // Test 11: Developer Portal Page UI HTML
  await runCheck("GET / serves Interactive Developer Portal UI", async () => {
    const res = await request(`${BASE_URL}/`)
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
    const html =
      typeof res.body === "string" ? res.body : JSON.stringify(res.body)
    if (
      !html.includes("Rizfolio Developer Gateway") &&
      !html.includes("v1.0.0")
    ) {
      throw new Error(
        "HTML does not contain Developer Gateway title or version"
      )
    }
  })

  if (serverProc) {
    console.log("\n🧹 Shutting down test server...")
    serverProc.kill("SIGTERM")
    spawn("taskkill", ["/pid", serverProc.pid, "/f", "/t"])
  }

  const passedCount = results.filter((r) => r.passed).length
  console.log(`\n========================================`)
  console.log(`📊 Test Results: ${passedCount}/${results.length} PASSED`)
  console.log(`========================================`)

  if (passedCount !== results.length) {
    process.exit(1)
  }
  process.exit(0)
}

runTests().catch((err) => {
  console.error("Test execution failed:", err)
  process.exit(1)
})

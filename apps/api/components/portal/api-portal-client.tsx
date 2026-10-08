"use client"

import * as React from "react"
import Link from "next/link"
import {
  API_ENDPOINTS_CATALOG,
  API_TAGS,
  type EndpointDefinition,
} from "@/lib/api/openapi"
import { ThemeToggle } from "@workspace/ui/components/theme-toggle"
import {
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  Copy,
  ExternalLink,
  Globe,
  Key,
  Layers,
  Lock,
  Play,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react"

type HttpMethod = "ALL" | "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

interface EndpointPlaygroundState {
  params: Record<string, string>
  body: string
  loading: boolean
  response: {
    status: number
    statusText: string
    timeMs: number
    headers: Record<string, string>
    data: unknown
  } | null
  error: string | null
}

export function ApiPortalClient() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedTag, setSelectedTag] = React.useState<string>("All")
  const [selectedMethod, setSelectedMethod] = React.useState<HttpMethod>("ALL")
  const [expandedId, setExpandedId] = React.useState<string | null>(
    "system-health"
  )
  const [activeGuideTab, setActiveGuideTab] = React.useState<
    "apikey" | "jwt" | "ratelimit" | "envelope"
  >("apikey")

  // Global auth tokens for playground testing
  const [globalApiKey, setGlobalApiKey] = React.useState("")
  const [globalBearerToken, setGlobalBearerToken] = React.useState("")

  // Live health status
  const [healthStatus, setHealthStatus] = React.useState<{
    healthy: boolean
    latencyMs: number
    uptime?: number
    version?: string
  } | null>(null)
  const [healthChecking, setHealthChecking] = React.useState(false)

  // Playground state map per endpoint
  const [playgroundStates, setPlaygroundStates] = React.useState<
    Record<string, EndpointPlaygroundState>
  >({})
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  // Ping health on mount and on user request
  const checkHealth = React.useCallback(async () => {
    setHealthChecking(true)
    const start = performance.now()
    try {
      const res = await fetch("/api/v1/health", { cache: "no-store" })
      const elapsed = Math.round(performance.now() - start)
      if (res.ok) {
        const json = await res.json()
        setHealthStatus({
          healthy: json.success && json.data?.status === "healthy",
          latencyMs: json.data?.database?.latencyMs ?? elapsed,
          uptime: json.data?.uptime,
          version: json.data?.version ?? "1.0.0",
        })
      } else {
        setHealthStatus({ healthy: false, latencyMs: elapsed })
      }
    } catch {
      setHealthStatus({ healthy: false, latencyMs: 0 })
    } finally {
      setHealthChecking(false)
    }
  }, [])

  React.useEffect(() => {
    let ignore = false
    const initHealth = async () => {
      setHealthChecking(true)
      const start = performance.now()
      try {
        const res = await fetch("/api/v1/health", { cache: "no-store" })
        const elapsed = Math.round(performance.now() - start)
        if (!ignore) {
          if (res.ok) {
            const json = await res.json()
            setHealthStatus({
              healthy: json.success && json.data?.status === "healthy",
              latencyMs: json.data?.database?.latencyMs ?? elapsed,
              uptime: json.data?.uptime,
              version: json.data?.version ?? "1.0.0",
            })
          } else {
            setHealthStatus({ healthy: false, latencyMs: elapsed })
          }
        }
      } catch {
        if (!ignore) {
          setHealthStatus({ healthy: false, latencyMs: 0 })
        }
      } finally {
        if (!ignore) {
          setHealthChecking(false)
        }
      }
    }
    initHealth()
    return () => {
      ignore = true
    }
  }, [])

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => {
      setCopiedId((curr) => (curr === id ? null : curr))
    }, 2000)
  }

  // Filter endpoints
  const filteredEndpoints = React.useMemo(() => {
    return API_ENDPOINTS_CATALOG.filter((ep) => {
      // Tag filter
      if (selectedTag !== "All" && ep.tag !== selectedTag) return false
      // Method filter
      if (selectedMethod !== "ALL" && ep.method !== selectedMethod) return false
      // Search query
      if (!searchQuery.trim()) return true
      const query = searchQuery.toLowerCase()
      return (
        ep.path.toLowerCase().includes(query) ||
        ep.summary.toLowerCase().includes(query) ||
        ep.tag.toLowerCase().includes(query) ||
        ep.description.toLowerCase().includes(query)
      )
    })
  }, [selectedTag, selectedMethod, searchQuery])

  // Initialize state for an endpoint if not present
  const getPlaygroundState = (
    ep: EndpointDefinition
  ): EndpointPlaygroundState => {
    const existing = playgroundStates[ep.id]
    if (existing) return existing
    const initialParams: Record<string, string> = {}
    if (ep.parameters) {
      for (const p of ep.parameters) {
        initialParams[p.name] = p.example ? String(p.example) : ""
      }
    }
    return {
      params: initialParams,
      body: ep.requestBody?.sampleJson || "",
      loading: false,
      response: null,
      error: null,
    }
  }

  const updateParam = (epId: string, paramName: string, value: string) => {
    setPlaygroundStates((prev) => {
      const ep = API_ENDPOINTS_CATALOG.find((e) => e.id === epId)
      const curr = prev[epId] || getPlaygroundState(ep!)
      return {
        ...prev,
        [epId]: {
          ...curr,
          params: { ...curr.params, [paramName]: value },
        },
      }
    })
  }

  const updateBody = (epId: string, body: string) => {
    setPlaygroundStates((prev) => {
      const ep = API_ENDPOINTS_CATALOG.find((e) => e.id === epId)
      const curr = prev[epId] || getPlaygroundState(ep!)
      return {
        ...prev,
        [epId]: { ...curr, body },
      }
    })
  }

  // Generate dynamic cURL command
  const generateCurl = (ep: EndpointDefinition): string => {
    const state = getPlaygroundState(ep)
    let resolvedPath = ep.path
    const queryParams = new URLSearchParams()

    if (ep.parameters) {
      for (const p of ep.parameters) {
        const val = state.params[p.name] || (p.example ? String(p.example) : "")
        if (p.in === "path") {
          resolvedPath = resolvedPath.replace(
            `{${p.name}}`,
            encodeURIComponent(val || `:${p.name}`)
          )
        } else if (p.in === "query" && val) {
          queryParams.append(p.name, val)
        }
      }
    }

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : ""
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3007"
    const fullUrl = `${baseUrl}${resolvedPath}${queryString}`

    const headers: string[] = []
    if (globalApiKey) {
      headers.push(`-H "X-API-Key: ${globalApiKey}"`)
    }
    if (globalBearerToken) {
      headers.push(`-H "Authorization: Bearer ${globalBearerToken}"`)
    }

    if (["POST", "PUT", "PATCH"].includes(ep.method)) {
      headers.push(`-H "Content-Type: application/json"`)
      const bodySnippet = (
        state.body ||
        ep.requestBody?.sampleJson ||
        "{}"
      ).replace(/\n\s*/g, " ")
      return `curl -X ${ep.method} "${fullUrl}" \\\n  ${headers.join(" \\\n  ")} \\\n  -d '${bodySnippet}'`
    }

    if (headers.length > 0) {
      return `curl -X ${ep.method} "${fullUrl}" \\\n  ${headers.join(" \\\n  ")}`
    }

    return `curl -X ${ep.method} "${fullUrl}"`
  }

  // Execute live API request from browser
  const handleExecuteRequest = async (ep: EndpointDefinition) => {
    const state = getPlaygroundState(ep)
    setPlaygroundStates((prev) => ({
      ...prev,
      [ep.id]: { ...state, loading: true, error: null, response: null },
    }))

    let resolvedPath = ep.path
    const queryParams = new URLSearchParams()

    if (ep.parameters) {
      for (const p of ep.parameters) {
        const val = state.params[p.name] || (p.example ? String(p.example) : "")
        if (p.in === "path") {
          resolvedPath = resolvedPath.replace(
            `{${p.name}}`,
            encodeURIComponent(val || `:${p.name}`)
          )
        } else if (p.in === "query" && val) {
          queryParams.append(p.name, val)
        }
      }
    }

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : ""
    const targetUrl = `${resolvedPath}${queryString}`

    const requestHeaders: Record<string, string> = {}
    if (["POST", "PUT", "PATCH"].includes(ep.method)) {
      requestHeaders["Content-Type"] = "application/json"
    }
    if (globalApiKey) {
      requestHeaders["X-API-Key"] = globalApiKey
    }
    if (globalBearerToken) {
      requestHeaders["Authorization"] = `Bearer ${globalBearerToken}`
    }

    const startTime = performance.now()
    try {
      const fetchOpts: RequestInit = {
        method: ep.method,
        headers: requestHeaders,
      }

      if (["POST", "PUT", "PATCH"].includes(ep.method)) {
        fetchOpts.body = state.body || ep.requestBody?.sampleJson || "{}"
      }

      const res = await fetch(targetUrl, fetchOpts)
      const elapsed = Math.round(performance.now() - startTime)

      const headerObj: Record<string, string> = {}
      res.headers.forEach((val, key) => {
        headerObj[key] = val
      })

      let responseData: unknown = null
      const contentType = res.headers.get("content-type") || ""
      if (contentType.includes("application/json")) {
        responseData = await res.json()
      } else {
        responseData = await res.text()
      }

      setPlaygroundStates((prev) => ({
        ...prev,
        [ep.id]: {
          ...state,
          loading: false,
          response: {
            status: res.status,
            statusText:
              res.statusText ||
              (res.status === 200 ? "OK" : "Status " + res.status),
            timeMs: elapsed,
            headers: headerObj,
            data: responseData,
          },
        },
      }))
    } catch (err: unknown) {
      const elapsed = Math.round(performance.now() - startTime)
      const message = err instanceof Error ? err.message : "Request failed"
      setPlaygroundStates((prev) => ({
        ...prev,
        [ep.id]: {
          ...state,
          loading: false,
          error: `${message} (${elapsed}ms)`,
        },
      }))
    }
  }

  const methodColors: Record<
    string,
    { bg: string; text: string; border: string }
  > = {
    GET: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-500",
      border: "border-emerald-500/25",
    },
    POST: {
      bg: "bg-blue-500/10",
      text: "text-blue-500",
      border: "border-blue-500/25",
    },
    PUT: {
      bg: "bg-amber-500/10",
      text: "text-amber-500",
      border: "border-amber-500/25",
    },
    PATCH: {
      bg: "bg-purple-500/10",
      text: "text-purple-500",
      border: "border-purple-500/25",
    },
    DELETE: {
      bg: "bg-rose-500/10",
      text: "text-rose-500",
      border: "border-rose-500/25",
    },
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top Glassmorphic Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-xs">
              <Terminal className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-tight">
                  Rizfolio Gateway
                </span>
                <span className="rounded-md border border-primary/20 bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-medium text-primary uppercase">
                  v1.0.0
                </span>
              </div>
              <p className="hidden text-[11px] text-muted-foreground sm:block">
                Unified REST API & Developer Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Gateway Health Indicator */}
            <button
              onClick={checkHealth}
              disabled={healthChecking}
              title="Click to re-ping API health"
              className="flex items-center gap-2 rounded-full border border-border/50 bg-secondary/30 px-2.5 py-1 font-mono text-xs transition-colors hover:bg-secondary/60"
            >
              <span className="relative flex size-2">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                    healthStatus?.healthy ? "bg-emerald-400" : "bg-amber-400"
                  }`}
                />
                <span
                  className={`relative inline-flex size-2 rounded-full ${
                    healthStatus?.healthy ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
              </span>
              <span className="font-sans text-[11px] text-muted-foreground">
                {healthChecking
                  ? "Pinging..."
                  : healthStatus?.healthy
                    ? `Live (${healthStatus.latencyMs}ms)`
                    : "Checking..."}
              </span>
            </button>

            {/* Quick Links */}
            <Link
              href="/api/v1/openapi.json"
              target="_blank"
              className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground md:flex"
            >
              <Code2 className="size-3.5" />
              <span>OpenAPI Spec</span>
              <ExternalLink className="size-3 opacity-60" />
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 py-12 md:py-16">
        {/* Subtle grid background glow */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" />
              <span>Monorepo Production Gateway • Port 3007</span>
            </div>

            <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Deterministic, Secure REST API for the Rizfolio Ecosystem
            </h1>

            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Serving Portfolio, Blog, Shop, Changelog, Docs/Archive, Linkbio,
              and CMS Control Plane with machine-to-machine authentication,
              sliding-window rate limiting, and RFC 7807 problem details.
            </p>

            {/* Fast Stats Bar */}
            <div className="mt-4 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="flex flex-col gap-1 rounded-xl border border-border/50 bg-card/40 p-3.5 backdrop-blur-xs">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Layers className="size-3.5 text-primary" /> Endpoints
                </span>
                <span className="font-mono text-xl font-bold tracking-tight">
                  38+ Routes
                </span>
              </div>

              <div className="flex flex-col gap-1 rounded-xl border border-border/50 bg-card/40 p-3.5 backdrop-blur-xs">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Globe className="size-3.5 text-primary" /> Micro-Services
                </span>
                <span className="font-mono text-xl font-bold tracking-tight">
                  9 Domains
                </span>
              </div>

              <div className="flex flex-col gap-1 rounded-xl border border-border/50 bg-card/40 p-3.5 backdrop-blur-xs">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <ShieldCheck className="size-3.5 text-primary" /> Auth
                  Protocol
                </span>
                <span className="font-mono text-xl font-bold tracking-tight">
                  Dual-Mode
                </span>
              </div>

              <div className="flex flex-col gap-1 rounded-xl border border-border/50 bg-card/40 p-3.5 backdrop-blur-xs">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Zap className="size-3.5 text-primary" /> Response Time
                </span>
                <span className="font-mono text-xl font-bold tracking-tight">
                  {healthStatus?.latencyMs
                    ? `${healthStatus.latencyMs}ms`
                    : "< 25ms"}
                </span>
              </div>
            </div>

            {/* Global API Key & Bearer Input Box */}
            <div className="mt-4 flex w-full max-w-3xl flex-col items-stretch gap-3 rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-md sm:flex-row sm:items-center">
              <div className="flex shrink-0 items-center gap-2 text-xs font-medium text-muted-foreground">
                <Key className="size-4 text-primary" />
                <span>Test Credentials:</span>
              </div>
              <div className="flex flex-1 flex-col gap-2 sm:flex-row">
                <input
                  type="password"
                  placeholder="Master API Key (X-API-Key)"
                  value={globalApiKey}
                  onChange={(e) => setGlobalApiKey(e.target.value)}
                  className="flex-1 rounded-lg border border-border/70 bg-background px-3 py-1.5 font-mono text-xs placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="Owner JWT (Bearer Token)"
                  value={globalBearerToken}
                  onChange={(e) => setGlobalBearerToken(e.target.value)}
                  className="flex-1 rounded-lg border border-border/70 bg-background px-3 py-1.5 font-mono text-xs placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                />
              </div>
              <div className="shrink-0 self-center text-[11px] text-muted-foreground sm:self-auto">
                Auto-injected into playground
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Documentation & Interactive Playground Content */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Quick Start & Security Guides Accordion/Tabs */}
        <section className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-card/30 p-5 backdrop-blur-xs">
          <div className="flex flex-col justify-between gap-3 border-b border-border/40 pb-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-semibold tracking-tight">
                API Integration & Security Reference
              </h2>
              <p className="text-xs text-muted-foreground">
                Standardized conventions for consumer applications
              </p>
            </div>
            {/* Guide Tabs */}
            <div className="flex items-center gap-1.5 rounded-xl bg-muted/60 p-1 text-xs">
              <button
                onClick={() => setActiveGuideTab("apikey")}
                className={`rounded-lg px-3 py-1 font-medium transition-all ${
                  activeGuideTab === "apikey"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                API Key
              </button>
              <button
                onClick={() => setActiveGuideTab("jwt")}
                className={`rounded-lg px-3 py-1 font-medium transition-all ${
                  activeGuideTab === "jwt"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Bearer JWT
              </button>
              <button
                onClick={() => setActiveGuideTab("ratelimit")}
                className={`rounded-lg px-3 py-1 font-medium transition-all ${
                  activeGuideTab === "ratelimit"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Rate Limits
              </button>
              <button
                onClick={() => setActiveGuideTab("envelope")}
                className={`rounded-lg px-3 py-1 font-medium transition-all ${
                  activeGuideTab === "envelope"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                RFC 7807 Errors
              </button>
            </div>
          </div>

          {/* Guide Tab Contents */}
          <div className="text-xs">
            {activeGuideTab === "apikey" && (
              <div className="flex flex-col gap-2.5">
                <p className="text-muted-foreground">
                  Use Machine-to-Machine authentication for server-side daemons,
                  cron jobs, and background workers by passing the secret master
                  key in the{" "}
                  <code className="rounded bg-primary/10 px-1 py-0.5 font-mono text-primary">
                    X-API-Key
                  </code>{" "}
                  request header:
                </p>
                <div className="group relative">
                  <pre className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-3 font-mono text-[11px] text-zinc-100">
                    <code>
                      curl -H &quot;X-API-Key: rf_live_your_secret_key&quot;
                      http://localhost:3007/api/v1/cms/overview
                    </code>
                  </pre>
                  <button
                    onClick={() =>
                      handleCopy(
                        'curl -H "X-API-Key: rf_live_your_secret_key" http://localhost:3007/api/v1/cms/overview',
                        "guide-key"
                      )
                    }
                    className="absolute top-2.5 right-2.5 rounded-md bg-zinc-800 p-1.5 text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
                  >
                    {copiedId === "guide-key" ? (
                      <Check className="size-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeGuideTab === "jwt" && (
              <div className="flex flex-col gap-2.5">
                <p className="text-muted-foreground">
                  Interactive admin sessions authenticate via JSON Web Tokens
                  passed in the{" "}
                  <code className="rounded bg-primary/10 px-1 py-0.5 font-mono text-primary">
                    Authorization: Bearer &lt;token&gt;
                  </code>{" "}
                  header or via the HttpOnly{" "}
                  <code className="rounded bg-primary/10 px-1 py-0.5 font-mono text-primary">
                    rizfolio_cms_session
                  </code>{" "}
                  cookie:
                </p>
                <div className="group relative">
                  <pre className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-3 font-mono text-[11px] text-zinc-100">
                    <code>
                      curl -H &quot;Authorization: Bearer
                      eyJhbGciOiJIUzI1Ni...&quot;
                      http://localhost:3007/api/v1/auth/me
                    </code>
                  </pre>
                  <button
                    onClick={() =>
                      handleCopy(
                        'curl -H "Authorization: Bearer eyJhbGciOiJIUzI1Ni..." http://localhost:3007/api/v1/auth/me',
                        "guide-jwt"
                      )
                    }
                    className="absolute top-2.5 right-2.5 rounded-md bg-zinc-800 p-1.5 text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
                  >
                    {copiedId === "guide-jwt" ? (
                      <Check className="size-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeGuideTab === "ratelimit" && (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
                <div className="flex flex-col gap-1 rounded-lg border border-border/50 bg-background/50 p-2.5">
                  <span className="font-semibold text-foreground">
                    Public Endpoints
                  </span>
                  <span className="text-muted-foreground">
                    60 requests / min
                  </span>
                  <span className="font-mono text-[10px] text-primary">
                    Sliding window
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border border-border/50 bg-background/50 p-2.5">
                  <span className="font-semibold text-foreground">
                    Authenticated
                  </span>
                  <span className="text-muted-foreground">
                    120 requests / min
                  </span>
                  <span className="font-mono text-[10px] text-primary">
                    JWT / API Key
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border border-border/50 bg-background/50 p-2.5">
                  <span className="font-semibold text-foreground">
                    Public Mutations
                  </span>
                  <span className="text-muted-foreground">
                    30 requests / min
                  </span>
                  <span className="font-mono text-[10px] text-primary">
                    Honeypot + IP check
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border border-border/50 bg-background/50 p-2.5">
                  <span className="font-semibold text-foreground">
                    Webhooks
                  </span>
                  <span className="text-muted-foreground">
                    200 requests / min
                  </span>
                  <span className="font-mono text-[10px] text-primary">
                    HMAC signature
                  </span>
                </div>
              </div>
            )}

            {activeGuideTab === "envelope" && (
              <div className="flex flex-col gap-2.5">
                <p className="text-muted-foreground">
                  All error responses strictly follow the RFC 7807 Problem
                  Details specification with structured field validation arrays:
                </p>
                <pre className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-3 font-mono text-[11px] text-zinc-100">
                  <code>
                    {JSON.stringify(
                      {
                        success: false,
                        error: {
                          code: "VALIDATION_ERROR",
                          message: "Invalid input parameters",
                          status: 400,
                          details: [
                            { field: "email", message: "Invalid email format" },
                          ],
                        },
                        meta: {
                          timestamp: "2026-10-04T12:00:00.000Z",
                          traceId: "req_f89c2",
                        },
                      },
                      null,
                      2
                    )}
                  </code>
                </pre>
              </div>
            )}
          </div>
        </section>

        {/* Endpoint Explorer & Interactive Playground Console */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                Interactive Endpoint Explorer
              </h2>
              <p className="text-xs text-muted-foreground">
                Showing {filteredEndpoints.length} of{" "}
                {API_ENDPOINTS_CATALOG.length} documented endpoints
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search path, tag, or action..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border/60 bg-card/60 py-1.5 pr-3 pl-9 text-xs transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Tag Pills */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border/40 bg-muted/40 p-1">
              <button
                onClick={() => setSelectedTag("All")}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  selectedTag === "All"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All Domains
              </button>
              {API_TAGS.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setSelectedTag(t.name)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    selectedTag === t.name
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>

            {/* Method Pills */}
            <div className="flex items-center gap-1 rounded-xl border border-border/40 bg-muted/40 p-1">
              {(["ALL", "GET", "POST", "PUT", "DELETE"] as HttpMethod[]).map(
                (m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMethod(m)}
                    className={`rounded-lg px-2 py-0.5 font-mono text-xs font-medium transition-all ${
                      selectedMethod === m
                        ? "bg-foreground font-semibold text-background"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Endpoints List */}
          <div className="flex flex-col gap-3">
            {filteredEndpoints.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-xs text-muted-foreground">
                No endpoints found matching your criteria. Try clearing filters.
              </div>
            ) : (
              filteredEndpoints.map((ep) => {
                const isExpanded = expandedId === ep.id
                const state = getPlaygroundState(ep)
                const colors = methodColors[ep.method] || {
                  bg: "bg-secondary",
                  text: "text-foreground",
                  border: "border-border",
                }

                return (
                  <div
                    key={ep.id}
                    className={`rounded-xl border transition-all ${
                      isExpanded
                        ? "border-primary/50 bg-card/70 shadow-md shadow-primary/5"
                        : "border-border/50 bg-card/30 hover:border-border hover:bg-card/50"
                    }`}
                  >
                    {/* Collapsed Header Bar */}
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : ep.id)}
                      className="flex cursor-pointer flex-col justify-between gap-3 p-3.5 select-none sm:flex-row sm:items-center"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Method Badge */}
                        <span
                          className={`rounded-md border px-2.5 py-1 font-mono text-[11px] font-bold ${colors.bg} ${colors.text} ${colors.border}`}
                        >
                          {ep.method}
                        </span>

                        {/* Path */}
                        <span className="font-mono text-xs font-semibold tracking-tight text-foreground">
                          {ep.path}
                        </span>

                        {/* Access Badge */}
                        <span className="rounded-full border border-border/40 bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                          {ep.access}
                        </span>

                        {/* Tag Pill */}
                        <span className="font-mono text-[10px] text-muted-foreground">
                          [{ep.tag}]
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground sm:justify-end">
                        <span className="max-w-xs truncate text-right text-[11px]">
                          {ep.summary}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCopy(generateCurl(ep), `curl-${ep.id}`)
                            }}
                            title="Copy cURL command"
                            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            {copiedId === `curl-${ep.id}` ? (
                              <Check className="size-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="size-3.5" />
                            )}
                          </button>
                          {isExpanded ? (
                            <ChevronDown className="size-4 text-primary" />
                          ) : (
                            <ChevronRight className="size-4" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Detail & Interactive Playground */}
                    {isExpanded && (
                      <div className="flex flex-col gap-5 border-t border-border/40 bg-background/40 p-4 sm:p-5">
                        {/* Endpoint Description & Security */}
                        <div className="flex flex-col justify-between gap-2 text-xs sm:flex-row sm:items-center">
                          <p className="leading-relaxed text-muted-foreground">
                            {ep.description}
                          </p>
                          {ep.security && (
                            <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-500">
                              <Lock className="size-3" />
                              <span>Requires: {ep.security.join(" or ")}</span>
                            </div>
                          )}
                        </div>

                        {/* Parameters Table (If any) */}
                        {ep.parameters && ep.parameters.length > 0 && (
                          <div className="flex flex-col gap-2">
                            <h4 className="font-mono text-xs font-semibold tracking-wider text-foreground uppercase">
                              Parameters
                            </h4>
                            <div className="overflow-hidden rounded-xl border border-border/50 text-xs">
                              <div className="grid grid-cols-12 bg-muted/40 px-3 py-2 text-[11px] font-medium text-muted-foreground">
                                <div className="col-span-3">Name</div>
                                <div className="col-span-2">In</div>
                                <div className="col-span-4">Description</div>
                                <div className="col-span-3">Test Value</div>
                              </div>
                              {ep.parameters.map((p) => (
                                <div
                                  key={p.name}
                                  className="grid grid-cols-12 items-center gap-2 border-t border-border/40 bg-card/20 px-3 py-2"
                                >
                                  <div className="col-span-3 flex items-center gap-1 font-mono font-medium text-primary">
                                    <span>{p.name}</span>
                                    {p.required && (
                                      <span className="text-[10px] text-rose-500">
                                        *
                                      </span>
                                    )}
                                  </div>
                                  <div className="col-span-2 font-mono text-[10px] text-muted-foreground uppercase">
                                    {p.in}
                                  </div>
                                  <div className="col-span-4 text-[11px] leading-tight text-muted-foreground">
                                    {p.description}
                                  </div>
                                  <div className="col-span-3">
                                    <input
                                      type="text"
                                      placeholder={
                                        p.example
                                          ? String(p.example)
                                          : "value..."
                                      }
                                      value={state.params[p.name] ?? ""}
                                      onChange={(e) =>
                                        updateParam(
                                          ep.id,
                                          p.name,
                                          e.target.value
                                        )
                                      }
                                      className="w-full rounded-md border border-border/60 bg-background px-2 py-1 font-mono text-xs focus:border-primary focus:outline-none"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Request Body Editor (For POST/PUT/PATCH) */}
                        {ep.requestBody && (
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-mono text-xs font-semibold tracking-wider text-foreground uppercase">
                                Request Body (JSON)
                              </h4>
                              <span className="font-mono text-[11px] text-muted-foreground">
                                application/json
                              </span>
                            </div>
                            <textarea
                              rows={5}
                              value={state.body}
                              onChange={(e) =>
                                updateBody(ep.id, e.target.value)
                              }
                              className="w-full resize-y rounded-xl border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-100 focus:border-primary focus:outline-none"
                            />
                          </div>
                        )}

                        {/* Interactive Execution Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <button
                            onClick={() => handleExecuteRequest(ep)}
                            disabled={state.loading}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-xs transition-opacity hover:opacity-90 disabled:opacity-50"
                          >
                            {state.loading ? (
                              <RefreshCw className="size-3.5 animate-spin" />
                            ) : (
                              <Play className="size-3.5 fill-current" />
                            )}
                            <span>
                              {state.loading
                                ? "Sending Request..."
                                : "Send Live Request"}
                            </span>
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleCopy(
                                  generateCurl(ep),
                                  `curl-${ep.id}-body`
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-secondary/30 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary/70"
                            >
                              {copiedId === `curl-${ep.id}-body` ? (
                                <Check className="size-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="size-3.5" />
                              )}
                              <span>Copy cURL</span>
                            </button>
                          </div>
                        </div>

                        {/* Live Response Panel */}
                        {state.response && (
                          <div className="mt-2 flex flex-col gap-2 border-t border-border/40 pt-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <h4 className="font-mono text-xs font-semibold tracking-wider text-foreground uppercase">
                                  Response
                                </h4>
                                <span
                                  className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-bold ${
                                    state.response.status >= 200 &&
                                    state.response.status < 300
                                      ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                                      : "border border-rose-500/30 bg-rose-500/15 text-rose-400"
                                  }`}
                                >
                                  {state.response.status}{" "}
                                  {state.response.statusText}
                                </span>
                                <span className="font-mono text-[11px] text-muted-foreground">
                                  {state.response.timeMs}ms
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  handleCopy(
                                    JSON.stringify(
                                      state.response?.data,
                                      null,
                                      2
                                    ),
                                    `resp-${ep.id}`
                                  )
                                }
                                className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-foreground"
                              >
                                {copiedId === `resp-${ep.id}` ? (
                                  <Check className="size-3 text-emerald-400" />
                                ) : (
                                  <Copy className="size-3" />
                                )}
                                <span>Copy JSON</span>
                              </button>
                            </div>

                            <pre className="max-h-80 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-3.5 font-mono text-[11px] text-emerald-400">
                              <code>
                                {JSON.stringify(state.response.data, null, 2)}
                              </code>
                            </pre>
                          </div>
                        )}

                        {/* Error state */}
                        {state.error && (
                          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 font-mono text-xs text-rose-400">
                            {state.error}
                          </div>
                        )}

                        {/* Schema Response Sample Preview (if no live response yet) */}
                        {!state.response && !state.error && (
                          <div className="flex flex-col gap-1.5 opacity-70">
                            <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                              Expected Response Structure (Sample{" "}
                              {ep.responseSample.status})
                            </span>
                            <pre className="overflow-x-auto rounded-xl border border-zinc-900 bg-zinc-950/70 p-3 font-mono text-[11px] text-zinc-300">
                              <code>{ep.responseSample.sampleJson}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </section>
      </main>

      {/* Monorepo Footer */}
      <footer className="border-t border-border/40 bg-card/20 py-8 text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-6 md:flex-row lg:px-8">
          <div className="flex items-center gap-2">
            <Terminal className="size-4 text-primary" />
            <span className="font-semibold text-foreground">
              Rizfolio Gateway
            </span>
            <span>•</span>
            <span>Architected by Rizky Ramadhan</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <a
              href="https://portfolio.ryzmdn.me"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              Portfolio
            </a>
            <a
              href="https://blog.ryzmdn.me"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              Blog
            </a>
            <a
              href="https://shop.ryzmdn.me"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              Shop
            </a>
            <a
              href="https://docs.ryzmdn.me"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              Archive & Docs
            </a>
            <a
              href="https://changelog.ryzmdn.me"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              Changelog
            </a>
            <a
              href="https://links.ryzmdn.me"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              Linkbio
            </a>
            <a
              href="https://cms.ryzmdn.me"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              CMS Control Plane
            </a>
          </div>

          <div>Next.js 16 • React 19 • Turborepo</div>
        </div>
      </footer>
    </div>
  )
}

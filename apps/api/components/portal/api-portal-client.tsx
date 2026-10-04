"use client";

import * as React from "react";
import Link from "next/link";
import {
  API_ENDPOINTS_CATALOG,
  API_TAGS,
  type EndpointDefinition,
} from "@/lib/api/openapi";
import { ThemeToggle } from "@workspace/ui/components/theme-toggle";
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
} from "lucide-react";

type HttpMethod = "ALL" | "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface EndpointPlaygroundState {
  params: Record<string, string>;
  body: string;
  loading: boolean;
  response: {
    status: number;
    statusText: string;
    timeMs: number;
    headers: Record<string, string>;
    data: unknown;
  } | null;
  error: string | null;
}

export function ApiPortalClient() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTag, setSelectedTag] = React.useState<string>("All");
  const [selectedMethod, setSelectedMethod] = React.useState<HttpMethod>("ALL");
  const [expandedId, setExpandedId] = React.useState<string | null>("system-health");
  const [activeGuideTab, setActiveGuideTab] = React.useState<"apikey" | "jwt" | "ratelimit" | "envelope">("apikey");

  // Global auth tokens for playground testing
  const [globalApiKey, setGlobalApiKey] = React.useState("");
  const [globalBearerToken, setGlobalBearerToken] = React.useState("");

  // Live health status
  const [healthStatus, setHealthStatus] = React.useState<{
    healthy: boolean;
    latencyMs: number;
    uptime?: number;
    version?: string;
  } | null>(null);
  const [healthChecking, setHealthChecking] = React.useState(false);

  // Playground state map per endpoint
  const [playgroundStates, setPlaygroundStates] = React.useState<Record<string, EndpointPlaygroundState>>({});
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Ping health on mount and on user request
  const checkHealth = React.useCallback(async () => {
    setHealthChecking(true);
    const start = performance.now();
    try {
      const res = await fetch("/api/v1/health", { cache: "no-store" });
      const elapsed = Math.round(performance.now() - start);
      if (res.ok) {
        const json = await res.json();
        setHealthStatus({
          healthy: json.success && json.data?.status === "healthy",
          latencyMs: json.data?.database?.latencyMs ?? elapsed,
          uptime: json.data?.uptime,
          version: json.data?.version ?? "1.0.0",
        });
      } else {
        setHealthStatus({ healthy: false, latencyMs: elapsed });
      }
    } catch {
      setHealthStatus({ healthy: false, latencyMs: 0 });
    } finally {
      setHealthChecking(false);
    }
  }, []);

  React.useEffect(() => {
    let ignore = false;
    const initHealth = async () => {
      setHealthChecking(true);
      const start = performance.now();
      try {
        const res = await fetch("/api/v1/health", { cache: "no-store" });
        const elapsed = Math.round(performance.now() - start);
        if (!ignore) {
          if (res.ok) {
            const json = await res.json();
            setHealthStatus({
              healthy: json.success && json.data?.status === "healthy",
              latencyMs: json.data?.database?.latencyMs ?? elapsed,
              uptime: json.data?.uptime,
              version: json.data?.version ?? "1.0.0",
            });
          } else {
            setHealthStatus({ healthy: false, latencyMs: elapsed });
          }
        }
      } catch {
        if (!ignore) {
          setHealthStatus({ healthy: false, latencyMs: 0 });
        }
      } finally {
        if (!ignore) {
          setHealthChecking(false);
        }
      }
    };
    initHealth();
    return () => {
      ignore = true;
    };
  }, []);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((curr) => (curr === id ? null : curr));
    }, 2000);
  };

  // Filter endpoints
  const filteredEndpoints = React.useMemo(() => {
    return API_ENDPOINTS_CATALOG.filter((ep) => {
      // Tag filter
      if (selectedTag !== "All" && ep.tag !== selectedTag) return false;
      // Method filter
      if (selectedMethod !== "ALL" && ep.method !== selectedMethod) return false;
      // Search query
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        ep.path.toLowerCase().includes(query) ||
        ep.summary.toLowerCase().includes(query) ||
        ep.tag.toLowerCase().includes(query) ||
        ep.description.toLowerCase().includes(query)
      );
    });
  }, [selectedTag, selectedMethod, searchQuery]);

  // Initialize state for an endpoint if not present
  const getPlaygroundState = (ep: EndpointDefinition): EndpointPlaygroundState => {
    const existing = playgroundStates[ep.id];
    if (existing) return existing;
    const initialParams: Record<string, string> = {};
    if (ep.parameters) {
      for (const p of ep.parameters) {
        initialParams[p.name] = p.example ? String(p.example) : "";
      }
    }
    return {
      params: initialParams,
      body: ep.requestBody?.sampleJson || "",
      loading: false,
      response: null,
      error: null,
    };
  };

  const updateParam = (epId: string, paramName: string, value: string) => {
    setPlaygroundStates((prev) => {
      const ep = API_ENDPOINTS_CATALOG.find((e) => e.id === epId);
      const curr = prev[epId] || getPlaygroundState(ep!);
      return {
        ...prev,
        [epId]: {
          ...curr,
          params: { ...curr.params, [paramName]: value },
        },
      };
    });
  };

  const updateBody = (epId: string, body: string) => {
    setPlaygroundStates((prev) => {
      const ep = API_ENDPOINTS_CATALOG.find((e) => e.id === epId);
      const curr = prev[epId] || getPlaygroundState(ep!);
      return {
        ...prev,
        [epId]: { ...curr, body },
      };
    });
  };

  // Generate dynamic cURL command
  const generateCurl = (ep: EndpointDefinition): string => {
    const state = getPlaygroundState(ep);
    let resolvedPath = ep.path;
    const queryParams = new URLSearchParams();

    if (ep.parameters) {
      for (const p of ep.parameters) {
        const val = state.params[p.name] || (p.example ? String(p.example) : "");
        if (p.in === "path") {
          resolvedPath = resolvedPath.replace(`{${p.name}}`, encodeURIComponent(val || `:${p.name}`));
        } else if (p.in === "query" && val) {
          queryParams.append(p.name, val);
        }
      }
    }

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3007";
    const fullUrl = `${baseUrl}${resolvedPath}${queryString}`;

    const headers: string[] = [];
    if (globalApiKey) {
      headers.push(`-H "X-API-Key: ${globalApiKey}"`);
    }
    if (globalBearerToken) {
      headers.push(`-H "Authorization: Bearer ${globalBearerToken}"`);
    }

    if (["POST", "PUT", "PATCH"].includes(ep.method)) {
      headers.push(`-H "Content-Type: application/json"`);
      const bodySnippet = (state.body || ep.requestBody?.sampleJson || "{}").replace(/\n\s*/g, " ");
      return `curl -X ${ep.method} "${fullUrl}" \\\n  ${headers.join(" \\\n  ")} \\\n  -d '${bodySnippet}'`;
    }

    if (headers.length > 0) {
      return `curl -X ${ep.method} "${fullUrl}" \\\n  ${headers.join(" \\\n  ")}`;
    }

    return `curl -X ${ep.method} "${fullUrl}"`;
  };

  // Execute live API request from browser
  const handleExecuteRequest = async (ep: EndpointDefinition) => {
    const state = getPlaygroundState(ep);
    setPlaygroundStates((prev) => ({
      ...prev,
      [ep.id]: { ...state, loading: true, error: null, response: null },
    }));

    let resolvedPath = ep.path;
    const queryParams = new URLSearchParams();

    if (ep.parameters) {
      for (const p of ep.parameters) {
        const val = state.params[p.name] || (p.example ? String(p.example) : "");
        if (p.in === "path") {
          resolvedPath = resolvedPath.replace(`{${p.name}}`, encodeURIComponent(val || `:${p.name}`));
        } else if (p.in === "query" && val) {
          queryParams.append(p.name, val);
        }
      }
    }

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    const targetUrl = `${resolvedPath}${queryString}`;

    const requestHeaders: Record<string, string> = {};
    if (["POST", "PUT", "PATCH"].includes(ep.method)) {
      requestHeaders["Content-Type"] = "application/json";
    }
    if (globalApiKey) {
      requestHeaders["X-API-Key"] = globalApiKey;
    }
    if (globalBearerToken) {
      requestHeaders["Authorization"] = `Bearer ${globalBearerToken}`;
    }

    const startTime = performance.now();
    try {
      const fetchOpts: RequestInit = {
        method: ep.method,
        headers: requestHeaders,
      };

      if (["POST", "PUT", "PATCH"].includes(ep.method)) {
        fetchOpts.body = state.body || ep.requestBody?.sampleJson || "{}";
      }

      const res = await fetch(targetUrl, fetchOpts);
      const elapsed = Math.round(performance.now() - startTime);

      const headerObj: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        headerObj[key] = val;
      });

      let responseData: unknown = null;
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        responseData = await res.json();
      } else {
        responseData = await res.text();
      }

      setPlaygroundStates((prev) => ({
        ...prev,
        [ep.id]: {
          ...state,
          loading: false,
          response: {
            status: res.status,
            statusText: res.statusText || (res.status === 200 ? "OK" : "Status " + res.status),
            timeMs: elapsed,
            headers: headerObj,
            data: responseData,
          },
        },
      }));
    } catch (err: unknown) {
      const elapsed = Math.round(performance.now() - startTime);
      const message = err instanceof Error ? err.message : "Request failed";
      setPlaygroundStates((prev) => ({
        ...prev,
        [ep.id]: {
          ...state,
          loading: false,
          error: `${message} (${elapsed}ms)`,
        },
      }));
    }
  };

  const methodColors: Record<string, { bg: string; text: string; border: string }> = {
    GET: { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/25" },
    POST: { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/25" },
    PUT: { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/25" },
    PATCH: { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/25" },
    DELETE: { bg: "bg-rose-500/10", text: "text-rose-500", border: "border-rose-500/25" },
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Glassmorphic Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
              <Terminal className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-tight">Rizfolio Gateway</span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-medium">
                  v1.0.0
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">Unified REST API & Developer Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Gateway Health Indicator */}
            <button
              onClick={checkHealth}
              disabled={healthChecking}
              title="Click to re-ping API health"
              className="flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono border border-border/50 bg-secondary/30 hover:bg-secondary/60 transition-colors"
            >
              <span className="relative flex size-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    healthStatus?.healthy ? "bg-emerald-400" : "bg-amber-400"
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full size-2 ${
                    healthStatus?.healthy ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
              </span>
              <span className="text-muted-foreground font-sans text-[11px]">
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
              className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium px-2.5 py-1.5 rounded-lg hover:bg-accent/40 transition-colors"
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
      <section className="relative border-b border-border/40 py-12 md:py-16 overflow-hidden">
        {/* Subtle grid background glow */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 border border-primary/20 text-primary">
              <Sparkles className="size-3.5" />
              <span>Monorepo Production Gateway • Port 3007</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground max-w-3xl">
              Deterministic, Secure REST API for the Rizfolio Ecosystem
            </h1>

            <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
              Serving Portfolio, Blog, Shop, Changelog, Docs/Archive, Linkbio, and CMS Control Plane with
              machine-to-machine authentication, sliding-window rate limiting, and RFC 7807 problem details.
            </p>

            {/* Fast Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl mt-4">
              <div className="p-3.5 rounded-xl border border-border/50 bg-card/40 backdrop-blur-xs flex flex-col gap-1">
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                  <Layers className="size-3.5 text-primary" /> Endpoints
                </span>
                <span className="text-xl font-bold font-mono tracking-tight">38+ Routes</span>
              </div>

              <div className="p-3.5 rounded-xl border border-border/50 bg-card/40 backdrop-blur-xs flex flex-col gap-1">
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                  <Globe className="size-3.5 text-primary" /> Micro-Services
                </span>
                <span className="text-xl font-bold font-mono tracking-tight">9 Domains</span>
              </div>

              <div className="p-3.5 rounded-xl border border-border/50 bg-card/40 backdrop-blur-xs flex flex-col gap-1">
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-primary" /> Auth Protocol
                </span>
                <span className="text-xl font-bold font-mono tracking-tight">Dual-Mode</span>
              </div>

              <div className="p-3.5 rounded-xl border border-border/50 bg-card/40 backdrop-blur-xs flex flex-col gap-1">
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                  <Zap className="size-3.5 text-primary" /> Response Time
                </span>
                <span className="text-xl font-bold font-mono tracking-tight">
                  {healthStatus?.latencyMs ? `${healthStatus.latencyMs}ms` : "< 25ms"}
                </span>
              </div>
            </div>

            {/* Global API Key & Bearer Input Box */}
            <div className="w-full max-w-3xl mt-4 p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-md flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground shrink-0">
                <Key className="size-4 text-primary" />
                <span>Test Credentials:</span>
              </div>
              <div className="flex-1 flex flex-col sm:flex-row gap-2">
                <input
                  type="password"
                  placeholder="Master API Key (X-API-Key)"
                  value={globalApiKey}
                  onChange={(e) => setGlobalApiKey(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs font-mono bg-background border border-border/70 focus:outline-none focus:border-primary placeholder:text-muted-foreground/60"
                />
                <input
                  type="password"
                  placeholder="Owner JWT (Bearer Token)"
                  value={globalBearerToken}
                  onChange={(e) => setGlobalBearerToken(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs font-mono bg-background border border-border/70 focus:outline-none focus:border-primary placeholder:text-muted-foreground/60"
                />
              </div>
              <div className="text-[11px] text-muted-foreground shrink-0 self-center sm:self-auto">
                Auto-injected into playground
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Documentation & Interactive Playground Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-8">
        {/* Quick Start & Security Guides Accordion/Tabs */}
        <section className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-xs p-5 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">API Integration & Security Reference</h2>
              <p className="text-xs text-muted-foreground">Standardized conventions for consumer applications</p>
            </div>
            {/* Guide Tabs */}
            <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl text-xs">
              <button
                onClick={() => setActiveGuideTab("apikey")}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  activeGuideTab === "apikey" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                API Key
              </button>
              <button
                onClick={() => setActiveGuideTab("jwt")}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  activeGuideTab === "jwt" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Bearer JWT
              </button>
              <button
                onClick={() => setActiveGuideTab("ratelimit")}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  activeGuideTab === "ratelimit" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Rate Limits
              </button>
              <button
                onClick={() => setActiveGuideTab("envelope")}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  activeGuideTab === "envelope" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
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
                  Use Machine-to-Machine authentication for server-side daemons, cron jobs, and background workers by passing the secret master key in the <code className="font-mono text-primary bg-primary/10 px-1 py-0.5 rounded">X-API-Key</code> request header:
                </p>
                <div className="relative group">
                  <pre className="p-3 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-[11px] overflow-x-auto border border-zinc-800">
                    <code>curl -H &quot;X-API-Key: rf_live_your_secret_key&quot; http://localhost:3007/api/v1/cms/overview</code>
                  </pre>
                  <button
                    onClick={() => handleCopy('curl -H "X-API-Key: rf_live_your_secret_key" http://localhost:3007/api/v1/cms/overview', "guide-key")}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                  >
                    {copiedId === "guide-key" ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                  </button>
                </div>
              </div>
            )}

            {activeGuideTab === "jwt" && (
              <div className="flex flex-col gap-2.5">
                <p className="text-muted-foreground">
                  Interactive admin sessions authenticate via JSON Web Tokens passed in the <code className="font-mono text-primary bg-primary/10 px-1 py-0.5 rounded">Authorization: Bearer &lt;token&gt;</code> header or via the HttpOnly <code className="font-mono text-primary bg-primary/10 px-1 py-0.5 rounded">rizfolio_cms_session</code> cookie:
                </p>
                <div className="relative group">
                  <pre className="p-3 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-[11px] overflow-x-auto border border-zinc-800">
                    <code>curl -H &quot;Authorization: Bearer eyJhbGciOiJIUzI1Ni...&quot; http://localhost:3007/api/v1/auth/me</code>
                  </pre>
                  <button
                    onClick={() => handleCopy('curl -H "Authorization: Bearer eyJhbGciOiJIUzI1Ni..." http://localhost:3007/api/v1/auth/me', "guide-jwt")}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                  >
                    {copiedId === "guide-jwt" ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                  </button>
                </div>
              </div>
            )}

            {activeGuideTab === "ratelimit" && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded-lg border border-border/50 bg-background/50 flex flex-col gap-1">
                  <span className="font-semibold text-foreground">Public Endpoints</span>
                  <span className="text-muted-foreground">60 requests / min</span>
                  <span className="text-[10px] text-primary font-mono">Sliding window</span>
                </div>
                <div className="p-2.5 rounded-lg border border-border/50 bg-background/50 flex flex-col gap-1">
                  <span className="font-semibold text-foreground">Authenticated</span>
                  <span className="text-muted-foreground">120 requests / min</span>
                  <span className="text-[10px] text-primary font-mono">JWT / API Key</span>
                </div>
                <div className="p-2.5 rounded-lg border border-border/50 bg-background/50 flex flex-col gap-1">
                  <span className="font-semibold text-foreground">Public Mutations</span>
                  <span className="text-muted-foreground">30 requests / min</span>
                  <span className="text-[10px] text-primary font-mono">Honeypot + IP check</span>
                </div>
                <div className="p-2.5 rounded-lg border border-border/50 bg-background/50 flex flex-col gap-1">
                  <span className="font-semibold text-foreground">Webhooks</span>
                  <span className="text-muted-foreground">200 requests / min</span>
                  <span className="text-[10px] text-primary font-mono">HMAC signature</span>
                </div>
              </div>
            )}

            {activeGuideTab === "envelope" && (
              <div className="flex flex-col gap-2.5">
                <p className="text-muted-foreground">
                  All error responses strictly follow the RFC 7807 Problem Details specification with structured field validation arrays:
                </p>
                <pre className="p-3 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-[11px] overflow-x-auto border border-zinc-800">
                  <code>{JSON.stringify({
                    success: false,
                    error: {
                      code: "VALIDATION_ERROR",
                      message: "Invalid input parameters",
                      status: 400,
                      details: [{ field: "email", message: "Invalid email format" }],
                    },
                    meta: { timestamp: "2026-10-04T12:00:00.000Z", traceId: "req_f89c2" },
                  }, null, 2)}</code>
                </pre>
              </div>
            )}
          </div>
        </section>

        {/* Endpoint Explorer & Interactive Playground Console */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Interactive Endpoint Explorer</h2>
              <p className="text-xs text-muted-foreground">
                Showing {filteredEndpoints.length} of {API_ENDPOINTS_CATALOG.length} documented endpoints
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search path, tag, or action..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-card/60 border border-border/60 focus:outline-none focus:border-primary placeholder:text-muted-foreground/60 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Tag Pills */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-muted/40 border border-border/40">
              <button
                onClick={() => setSelectedTag("All")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
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
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
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
            <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/40 border border-border/40">
              {(["ALL", "GET", "POST", "PUT", "DELETE"] as HttpMethod[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMethod(m)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    selectedMethod === m
                      ? "bg-foreground text-background font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Endpoints List */}
          <div className="flex flex-col gap-3">
            {filteredEndpoints.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-border/60 text-muted-foreground text-xs">
                No endpoints found matching your criteria. Try clearing filters.
              </div>
            ) : (
              filteredEndpoints.map((ep) => {
                const isExpanded = expandedId === ep.id;
                const state = getPlaygroundState(ep);
                const colors = methodColors[ep.method] || {
                  bg: "bg-secondary",
                  text: "text-foreground",
                  border: "border-border",
                };

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
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3 flex-wrap">
                        {/* Method Badge */}
                        <span
                          className={`font-mono font-bold text-[11px] px-2.5 py-1 rounded-md border ${colors.bg} ${colors.text} ${colors.border}`}
                        >
                          {ep.method}
                        </span>

                        {/* Path */}
                        <span className="font-mono text-xs font-semibold text-foreground tracking-tight">
                          {ep.path}
                        </span>

                        {/* Access Badge */}
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary/80 text-secondary-foreground border border-border/40">
                          {ep.access}
                        </span>

                        {/* Tag Pill */}
                        <span className="text-[10px] text-muted-foreground font-mono">
                          [{ep.tag}]
                        </span>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-muted-foreground">
                        <span className="text-right truncate max-w-xs text-[11px]">{ep.summary}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(generateCurl(ep), `curl-${ep.id}`);
                            }}
                            title="Copy cURL command"
                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
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
                      <div className="border-t border-border/40 p-4 sm:p-5 flex flex-col gap-5 bg-background/40">
                        {/* Endpoint Description & Security */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <p className="text-muted-foreground leading-relaxed">{ep.description}</p>
                          {ep.security && (
                            <div className="flex items-center gap-1.5 shrink-0 text-[11px] font-medium text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                              <Lock className="size-3" />
                              <span>Requires: {ep.security.join(" or ")}</span>
                            </div>
                          )}
                        </div>

                        {/* Parameters Table (If any) */}
                        {ep.parameters && ep.parameters.length > 0 && (
                          <div className="flex flex-col gap-2">
                            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
                              Parameters
                            </h4>
                            <div className="rounded-xl border border-border/50 overflow-hidden text-xs">
                              <div className="bg-muted/40 px-3 py-2 grid grid-cols-12 font-medium text-muted-foreground text-[11px]">
                                <div className="col-span-3">Name</div>
                                <div className="col-span-2">In</div>
                                <div className="col-span-4">Description</div>
                                <div className="col-span-3">Test Value</div>
                              </div>
                              {ep.parameters.map((p) => (
                                <div
                                  key={p.name}
                                  className="px-3 py-2 grid grid-cols-12 items-center border-t border-border/40 bg-card/20 gap-2"
                                >
                                  <div className="col-span-3 font-mono font-medium text-primary flex items-center gap-1">
                                    <span>{p.name}</span>
                                    {p.required && <span className="text-rose-500 text-[10px]">*</span>}
                                  </div>
                                  <div className="col-span-2 font-mono text-[10px] text-muted-foreground uppercase">
                                    {p.in}
                                  </div>
                                  <div className="col-span-4 text-muted-foreground text-[11px] leading-tight">
                                    {p.description}
                                  </div>
                                  <div className="col-span-3">
                                    <input
                                      type="text"
                                      placeholder={p.example ? String(p.example) : "value..."}
                                      value={state.params[p.name] ?? ""}
                                      onChange={(e) => updateParam(ep.id, p.name, e.target.value)}
                                      className="w-full px-2 py-1 rounded-md text-xs font-mono bg-background border border-border/60 focus:outline-none focus:border-primary"
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
                              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
                                Request Body (JSON)
                              </h4>
                              <span className="text-[11px] text-muted-foreground font-mono">
                                application/json
                              </span>
                            </div>
                            <textarea
                              rows={5}
                              value={state.body}
                              onChange={(e) => updateBody(ep.id, e.target.value)}
                              className="w-full p-3 rounded-xl font-mono text-xs bg-zinc-950 text-zinc-100 border border-zinc-800 focus:outline-none focus:border-primary resize-y"
                            />
                          </div>
                        )}

                        {/* Interactive Execution Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <button
                            onClick={() => handleExecuteRequest(ep)}
                            disabled={state.loading}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-xs hover:opacity-90 transition-opacity disabled:opacity-50 shadow-xs cursor-pointer"
                          >
                            {state.loading ? (
                              <RefreshCw className="size-3.5 animate-spin" />
                            ) : (
                              <Play className="size-3.5 fill-current" />
                            )}
                            <span>{state.loading ? "Sending Request..." : "Send Live Request"}</span>
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopy(generateCurl(ep), `curl-${ep.id}-body`)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-secondary/30 hover:bg-secondary/70 text-xs font-medium transition-colors"
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
                          <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-border/40">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
                                  Response
                                </h4>
                                <span
                                  className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold ${
                                    state.response.status >= 200 && state.response.status < 300
                                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                      : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                  }`}
                                >
                                  {state.response.status} {state.response.statusText}
                                </span>
                                <span className="text-[11px] text-muted-foreground font-mono">
                                  {state.response.timeMs}ms
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  handleCopy(JSON.stringify(state.response?.data, null, 2), `resp-${ep.id}`)
                                }
                                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-mono"
                              >
                                {copiedId === `resp-${ep.id}` ? (
                                  <Check className="size-3 text-emerald-400" />
                                ) : (
                                  <Copy className="size-3" />
                                )}
                                <span>Copy JSON</span>
                              </button>
                            </div>

                            <pre className="p-3.5 rounded-xl bg-zinc-950 text-emerald-400 font-mono text-[11px] overflow-x-auto border border-zinc-800 max-h-80">
                              <code>{JSON.stringify(state.response.data, null, 2)}</code>
                            </pre>
                          </div>
                        )}

                        {/* Error state */}
                        {state.error && (
                          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono">
                            {state.error}
                          </div>
                        )}

                        {/* Schema Response Sample Preview (if no live response yet) */}
                        {!state.response && !state.error && (
                          <div className="flex flex-col gap-1.5 opacity-70">
                            <span className="text-[10px] uppercase font-mono text-muted-foreground tracking-wider">
                              Expected Response Structure (Sample {ep.responseSample.status})
                            </span>
                            <pre className="p-3 rounded-xl bg-zinc-950/70 text-zinc-300 font-mono text-[11px] overflow-x-auto border border-zinc-900">
                              <code>{ep.responseSample.sampleJson}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      {/* Monorepo Footer */}
      <footer className="border-t border-border/40 py-8 bg-card/20 text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="size-4 text-primary" />
            <span className="font-semibold text-foreground">Rizfolio Gateway</span>
            <span>•</span>
            <span>Architected by Rizky Ramadhan</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <a href="https://portfolio.ryzmdn.me" target="_blank" rel="noreferrer" className="hover:text-foreground">
              Portfolio
            </a>
            <a href="https://blog.ryzmdn.me" target="_blank" rel="noreferrer" className="hover:text-foreground">
              Blog
            </a>
            <a href="https://shop.ryzmdn.me" target="_blank" rel="noreferrer" className="hover:text-foreground">
              Shop
            </a>
            <a href="https://docs.ryzmdn.me" target="_blank" rel="noreferrer" className="hover:text-foreground">
              Archive & Docs
            </a>
            <a href="https://changelog.ryzmdn.me" target="_blank" rel="noreferrer" className="hover:text-foreground">
              Changelog
            </a>
            <a href="https://links.ryzmdn.me" target="_blank" rel="noreferrer" className="hover:text-foreground">
              Linkbio
            </a>
            <a href="https://cms.ryzmdn.me" target="_blank" rel="noreferrer" className="hover:text-foreground">
              CMS Control Plane
            </a>
          </div>

          <div>Next.js 16 • React 19 • Turborepo</div>
        </div>
      </footer>
    </div>
  );
}

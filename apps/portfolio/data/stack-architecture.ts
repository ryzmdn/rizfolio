export interface StackChoiceItem {
  id: string
  name: string
  role: string
  badge: string
  summary: string
  rationale: string
  tradeoff: string
  metric: string
  tags: string[]
}

export interface ArchitectureLayer {
  id: string
  number: string
  title: string
  shortLabel: string
  headline: string
  description: string
  icon: "layers" | "database" | "server" | "shield"
  stack: StackChoiceItem[]
}

export const architectureLayers: ArchitectureLayer[] = [
  {
    id: "presentation",
    number: "01",
    title: "Presentation & UX Engine",
    shortLabel: "Frontend & UX",
    headline: "Server-First Compute & Deterministic Design Tokens",
    description:
      "Crafting zero-friction digital interfaces where aesthetic refinement meets compile-time type guarantees and featherweight client bundles.",
    icon: "layers",
    stack: [
      {
        id: "nextjs",
        name: "Next.js 16 (React 19)",
        role: "Application Architecture",
        badge: "RSC & Server Actions",
        summary: "Compute executed adjacent to data stores with streaming SSR.",
        rationale:
          "React Server Components (RSC) move heavy compute to the edge, stripping execution overhead from client devices while preserving instantaneous on-demand ISR revalidation.",
        tradeoff:
          "Server-first paradigm requires disciplined state boundaries over client-side state cascades.",
        metric: "Sub-100ms TTFB / Zero Client Bloat",
        tags: ["React 19", "RSC", "Turbopack", "Edge"],
      },
      {
        id: "tailwind-base",
        name: "Tailwind CSS v4 & Base UI",
        role: "Design System & Primitives",
        badge: "Zero-Runtime CSS",
        summary:
          "Headless accessible primitives governed by CSS-first token layers.",
        rationale:
          "Tailwind v4 delivers zero-runtime stylesheet compilation with native cascade layers, paired with headless Base UI components for uncompromising WCAG 2.1 AA accessibility.",
        tradeoff:
          "Requires strict design token governance in CSS rather than ad-hoc inline styling.",
        metric: "100% Unstyled A11y / 0ms JS Style Eval",
        tags: ["Tailwind v4", "Base UI", "Design Tokens", "A11y"],
      },
      {
        id: "typescript",
        name: "TypeScript 5 (Strict Mode)",
        role: "Static Type Invariants",
        badge: "End-to-End Safety",
        summary:
          "Unbreakable contract validation across monorepo package boundaries.",
        rationale:
          "Strict compiler flags eliminate null-reference ambiguities and runtime type drift across shared UI packages, database schemas, and client fetchers.",
        tradeoff:
          "Higher initial modeling rigor in exchange for zero production runtime regressions.",
        metric: "0 Type Errors Across 13 Packages",
        tags: ["Strict Mode", "Shared Typings", "Invariants"],
      },
    ],
  },
  {
    id: "persistence",
    number: "02",
    title: "Data Persistence & Model Layer",
    shortLabel: "Data & Storage",
    headline: "Type-Inferred Relational Systems with Zero ORM Overhead",
    description:
      "Balancing relational rigor with instant query execution and granular access policies across all public and privileged domain entities.",
    icon: "database",
    stack: [
      {
        id: "drizzle",
        name: "Drizzle ORM",
        role: "Type-Safe Query Builder",
        badge: "Zero Cold-Start Overhead",
        summary: "Pure TypeScript SQL inference with zero abstraction tax.",
        rationale:
          "Unlike heavy heavyweight ORMs, Drizzle translates directly to lean parameterized SQL without runtime engines, eliminating serverless cold-start spikes entirely.",
        tradeoff:
          "Demands strong relational SQL literacy over high-level magical abstractions.",
        metric: "< 10ms Query Execution / Zero Cold-Start",
        tags: ["Drizzle", "SQL-like", "PostgreSQL", "Type-Inferred"],
      },
      {
        id: "supabase-postgres",
        name: "Supabase (PostgreSQL 16)",
        role: "Core Relational Database",
        badge: "ACID & Transaction Pooler",
        summary:
          "Production-grade relational store with isolated asset storage buckets.",
        rationale:
          "Provides robust relational integrity, JSONB semi-structured capability, and transactional connection pooling (PgBouncer) paired with signed-url storage buckets.",
        tradeoff:
          "Requires careful transaction pooling configuration for serverless connection spikes.",
        metric: "99.9% Production Uptime / Transactional Pool",
        tags: ["PostgreSQL 16", "PgBouncer", "Storage Buckets"],
      },
      {
        id: "zod",
        name: "Zod Schema Pipeline",
        role: "Perimeter Validation",
        badge: "Contract Invariants",
        summary: "Strict input coercion and output contract enforcement.",
        rationale:
          "Validates and sanitizes all data passing across HTTP handlers, Server Actions, and database mutations before execution reaches business logic.",
        tradeoff:
          "Slight parsing overhead at boundaries for complete immunity against malformed payloads.",
        metric: "100% Boundary Sanitization",
        tags: ["Zod", "Schema Invariants", "Validation"],
      },
    ],
  },
  {
    id: "infrastructure",
    number: "03",
    title: "Orchestration & DevOps Pipeline",
    shortLabel: "DevOps & Monorepo",
    headline: "Hermetic Caching & Continuous Integration Quality Gates",
    description:
      "Enterprise monorepo toolchains engineered for instant incremental builds, isolated package scopes, and deterministic deployment pipelines.",
    icon: "server",
    stack: [
      {
        id: "turborepo",
        name: "Turborepo & pnpm Workspaces",
        role: "Build Orchestration",
        badge: "Hermetic Task Caching",
        summary: "High-performance build system with fingerprint caching.",
        rationale:
          "Parallelizes typecheck, lint, and build tasks across 7 applications and 6 shared packages, replaying cached outputs to slash CI times by over 70%.",
        tradeoff:
          "Requires explicit declaration of environment dependencies in task graphs.",
        metric: "70%+ Faster CI Pipelines / Isolated Scopes",
        tags: ["Turborepo", "pnpm", "Monorepo", "Build Graph"],
      },
      {
        id: "isr-edge",
        name: "On-Demand ISR & Edge CDN",
        role: "Global Content Delivery",
        badge: "Sub-100ms Cache Invalidation",
        summary: "Static speed with real-time editorial freshness on demand.",
        rationale:
          "Public consumer apps are served statically from edge nodes, invalidated instantaneously via cryptographically secured header handshakes from the Personal CMS.",
        tradeoff:
          "Requires header-only secret validation and granular tag-based cache architecture.",
        metric: "Instant Worldwide Cache Sync",
        tags: ["ISR", "Edge CDN", "Cache Tagging", "Vercel"],
      },
      {
        id: "github-actions",
        name: "GitHub Actions CI/CD",
        role: "Automated Quality Gates",
        badge: "Multi-Stage Gatekeeper",
        summary:
          "Parallel validation of linting, formatting, type safety, and schema checks.",
        rationale:
          "Enforces that no PR or merge reaches production without satisfying 100% test coverage, strict type checks, and zero styling discrepancies.",
        tradeoff:
          "Zero tolerance for untyped shortcuts or unformatted commits.",
        metric: "100% Automated Gate Enforcement",
        tags: ["CI/CD", "Automated Gates", "Drizzle Check"],
      },
    ],
  },
  {
    id: "security",
    number: "04",
    title: "Defense-in-Depth & Auth Security",
    shortLabel: "Security & Guard",
    headline: "Zero-Trust Perimeter & Cryptographic Session Validation",
    description:
      "Multi-layered defensive architecture protecting administrative surfaces, preventing brute-force enumeration, and eliminating credential leak vectors.",
    icon: "shield",
    stack: [
      {
        id: "session-jwt",
        name: "Hardened JWT & Strict Cookies",
        role: "Session Authentication",
        badge: "SameSite=Strict & Unique JTI",
        summary: "Stateless cryptographic tokens with revocation tracking.",
        rationale:
          "Tokens are minted with unique UUID `jti` claims, explicit issuer/audience invariants, and stored in 24h `SameSite=Strict`, `HttpOnly` cookies to neutralize CSRF vectors.",
        tradeoff:
          "Requires strict env secret rotation policies and payload length validation.",
        metric: "24h Sliding Lifetimes / Strict Anti-CSRF",
        tags: ["JWT", "jti Claim", "SameSite Strict", "HttpOnly"],
      },
      {
        id: "rate-limit-bcrypt",
        name: "Rate Limiter & Bcrypt Guard",
        role: "Brute-Force & Enumeration Shield",
        badge: "5 Tries / 15-Min Window",
        summary:
          "Automated client IP throttling with generic failure responses.",
        rationale:
          "Isolates authentication quotas per IP, preventing dictionary attacks while returning generic error messages to eliminate user enumeration vulnerability.",
        tradeoff:
          "In-memory tracking requires periodic lazy cleanup to maintain featherweight footprint.",
        metric: "Anti-Brute Force / Zero User Leakage",
        tags: ["Rate Limiter", "Bcrypt", "Anti-Enumeration"],
      },
      {
        id: "csp-headers",
        name: "Content Security Policy (CSP)",
        role: "Perimeter Response Headers",
        badge: "Zero Unsafe-Inline Eval",
        summary:
          "Strict HTTP response headers mitigating XSS and Clickjacking.",
        rationale:
          "Comprehensive CSP rules deployed across all 7 applications, complemented by HSTS, `X-Frame-Options: DENY`, and `X-Content-Type-Options: nosniff`.",
        tradeoff:
          "External asset domains (Supabase CDN, Cloudinary) must be explicitly allowlisted.",
        metric: "A+ Grade Security Header Score",
        tags: ["CSP", "HSTS", "X-Frame-Options", "Zero Trust"],
      },
    ],
  },
]

export interface EngineeringPrinciple {
  id: string
  number: string
  title: string
  mentalModel: string
  tagline: string
  description: string
  rules: string[]
  icon: "shield" | "zap" | "lock" | "compass"
}

export const engineeringPrinciples: EngineeringPrinciple[] = [
  {
    id: "determinism",
    number: "01",
    title: "Determinism Over Cleverness",
    mentalModel: "Predictability > Obscurity",
    tagline: "Simple code is not rudimentary; it is complexity resolved.",
    description:
      "I engineer systems with explicit state transitions, strict compile-time type invariants, and clear data boundaries. Code must be immediately legible to any engineer, eliminating fragile magic and hidden side effects.",
    rules: [
      "Compile-Time Invariants",
      "Explicit Data Contracts",
      "Zero Hidden Side-Effects",
    ],
    icon: "shield",
  },
  {
    id: "performance",
    number: "02",
    title: "Performance by Default",
    mentalModel: "Sub-100ms Invariant",
    tagline:
      "Latency is a feature, and responsiveness is respect for the user.",
    description:
      "Speed is an architectural discipline, not a cosmetic patch. I leverage server-first compute, on-demand ISR invalidation, and lean bundle budgeting to guarantee instant interactions and fluid Core Web Vitals.",
    rules: [
      "Server-First React 19 RSC",
      "Instant On-Demand ISR",
      "Featherweight Client Bundles",
    ],
    icon: "zap",
  },
  {
    id: "defense-in-depth",
    number: "03",
    title: "Defense-in-Depth Security",
    mentalModel: "Zero-Trust Architecture",
    tagline:
      "Security is never an afterthought; it is an unyielding foundation.",
    description:
      "Treating every boundary and client request as untrusted by default. I implement perimeter input validation, cryptographic session governance, rate limiting, and strict header-only authentication across edge to storage.",
    rules: [
      "Perimeter Input Sanitization",
      "Header-Only Verification",
      "Strict Cryptographic Sessions",
    ],
    icon: "lock",
  },
  {
    id: "product-pragmatism",
    number: "04",
    title: "Product-Driven Pragmatism",
    mentalModel: "High-ROI Engineering",
    tagline:
      "Technical elegance only matters if it ships and drives measurable business value.",
    description:
      "Resisting premature optimization and resume-driven overengineering. Every architectural decision, refactor, and tool selection is strictly measured by its return on user delight, uptime reliability, and shipping velocity.",
    rules: [
      "Reuse Before Reinvent",
      "Measurable Business Value",
      "Deterministic Shipping Cadence",
    ],
    icon: "compass",
  },
]

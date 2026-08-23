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
      "I prioritize explicit state management, predictable data flow, and compile-time type invariants over fragile, magic abstractions. Code must remain immediately comprehensible by any engineer six months from now.",
    rules: [
      "Type-Safe Invariants",
      "Explicit Data Contracts",
      "Zero Hidden Side-Effects",
    ],
    icon: "shield",
  },
  {
    id: "performance",
    number: "02",
    title: "Performance by Default",
    mentalModel: "Zero-Cost Mental Accounting",
    tagline:
      "Latency is a feature, and responsiveness is respect for the user.",
    description:
      "High performance is engineered at the architectural level—leveraging React Server Components, on-demand ISR revalidation, and granular database indexing to deliver instantaneous sub-100ms user interactions without bloated client bundles.",
    rules: [
      "Server-First Compute",
      "Sub-100ms Interactions",
      "Featherweight Bundles",
    ],
    icon: "zap",
  },
  {
    id: "defense-in-depth",
    number: "03",
    title: "Defense-in-Depth Security",
    mentalModel: "Zero Trust Architecture",
    tagline:
      "Security is never an afterthought or a final checklist; it is an invariant foundation.",
    description:
      "Treating all incoming requests as untrusted by default. Implementing cryptographic session validation, rate limiting, header-only secret handshakes, and perimeter sanitization across every layer from the edge to the database.",
    rules: [
      "Perimeter Sanitization",
      "Header-Only Secrets",
      "Strict Session Lifetimes",
    ],
    icon: "lock",
  },
  {
    id: "product-pragmatism",
    number: "04",
    title: "Product-Driven Pragmatism",
    mentalModel: "High-ROI Engineering",
    tagline:
      "Technical elegance only matters if it ships and drives measurable human impact.",
    description:
      "Resisting premature optimization and architectural vanity. Every technology choice, refactoring cycle, and architectural decision must directly defend user value, platform reliability, and business execution velocity.",
    rules: [
      "Reuse Before Reinvent",
      "Measurable Business Value",
      "Continuous Shipping Velocity",
    ],
    icon: "compass",
  },
]

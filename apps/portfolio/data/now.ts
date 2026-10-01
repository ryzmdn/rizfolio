export interface NowFocusItem {
  id: string
  category: string
  badge: string
  badgeVariant?: "default" | "secondary" | "outline"
  title: string
  description: string
  tags: string[]
  icon: "layers" | "cpu" | "book" | "activity"
  link?: {
    label: string
    url: string
  }
}

export interface NowData {
  lastUpdated: string
  location: string
  timezone: string
  items: NowFocusItem[]
}

export const nowData: NowData = {
  lastUpdated: "August 2026",
  location: "Jakarta, Indonesia",
  timezone: "GMT+7",
  items: [
    {
      id: "building",
      category: "Active Engineering",
      badge: "Active Development",
      badgeVariant: "secondary",
      title: "Rizfolio Monorepo & Personal CMS",
      description:
        "Architecting a 7-app distributed monorepo powered by Turborepo, Next.js 16, Supabase PostgreSQL with Drizzle ORM, and instantaneous on-demand ISR revalidation.",
      tags: ["Turborepo", "Next.js 16", "Drizzle ORM", "Supabase"],
      icon: "layers",
    },
    {
      id: "exploring",
      category: "R&D & Experiments",
      badge: "Research",
      badgeVariant: "outline",
      title: "Agentic AI Workflows & Tool Calling",
      description:
        "Investigating deterministic state machines for multi-agent LLM systems, structured outputs, and local model inference latency optimizations.",
      tags: ["AI Agents", "Vercel AI SDK", "Prompt Engineering", "Edge AI"],
      icon: "cpu",
    },
    {
      id: "reading",
      category: "Continuous Learning",
      badge: "Deep Study",
      badgeVariant: "outline",
      title: "Database Internals & Distributed Systems",
      description:
        "Diving into storage engines (LSM-trees vs. B-trees), consensus protocols (Raft/Paxos), and high-throughput query indexing strategies.",
      tags: ["Distributed Systems", "DDIA", "Query Optimization"],
      icon: "book",
    },
    {
      id: "momentum",
      category: "Shipping Cadence",
      badge: "Weekly Momentum",
      badgeVariant: "secondary",
      title: "Open-Source Toolkits & Architecture Audits",
      description:
        "Maintaining a consistent weekly shipping pace on GitHub, profiling web performance bottlenecks, and collaborating with forward-thinking tech founders.",
      tags: ["Open Source", "System Audits", "Core Web Vitals"],
      icon: "activity",
    },
  ],
}

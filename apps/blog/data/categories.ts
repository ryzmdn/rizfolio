export interface CategoryItem {
  id: string
  name: string
  slug: string
  description: string | null
  count: number
}

export const fallbackCategories: CategoryItem[] = [
  {
    id: "cat-1",
    name: "Architecture",
    slug: "architecture",
    description:
      "System design, distributed services, and monorepo scaling patterns.",
    count: 2,
  },
  {
    id: "cat-2",
    name: "Frontend",
    slug: "frontend",
    description:
      "Modern React 19, Next.js 16, RSC, and Tailwind CSS engineering.",
    count: 2,
  },
  {
    id: "cat-3",
    name: "Performance",
    slug: "performance",
    description: "Core Web Vitals, sub-second query latency, and edge compute.",
    count: 1,
  },
  {
    id: "cat-4",
    name: "Database",
    slug: "database",
    description: "Relational modeling, Drizzle ORM, and Supabase optimization.",
    count: 1,
  },
  {
    id: "cat-5",
    name: "DevOps & Cloud",
    slug: "devops-cloud",
    description: "CI/CD pipelines, Docker containerization, and telemetry.",
    count: 1,
  },
  {
    id: "cat-6",
    name: "Applied AI",
    slug: "applied-ai",
    description: "Streaming LLM workflows, real-time queues, and AI ergonomics.",
    count: 1,
  },
]

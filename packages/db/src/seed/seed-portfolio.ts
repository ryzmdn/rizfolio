import {
  db,
  profile,
  experiences,
  education,
  certifications,
  services,
  caseStudies,
  testimonials,
} from "@workspace/db"

export async function seedPortfolio() {
  console.log("Seeding Portfolio Domain...")

  await db.delete(profile)
  await db.insert(profile).values({
    fullName: "Rizky Ramadhan",
    headline: "Full-Stack Software Engineer & Distributed Systems Enthusiast",
    bio: "Passionate engineer with extensive expertise in modern TypeScript architectures, high-performance monorepos, and distributed web applications. Focused on developer tooling, clean system design, and zero-runtime overhead.",
    location: "Indonesia",
    resumeUrl: "https://drive.google.com",
    status: "available",
    socialLinks: {
      github: "https://github.com/ryzmdn",
      linkedin: "https://linkedin.com/in/ryzmdn",
      twitter: "https://x.com/ryzmdn",
      email: "hello@rizkyramadhan.dev",
    },
  })

  await db.delete(experiences)
  await db.insert(experiences).values([
    {
      company: "Tech Architecture Labs",
      role: "Lead Full-Stack Engineer",
      location: "Remote",
      startDate: "2024",
      endDate: "Present",
      isCurrent: true,
      description:
        "Architecting enterprise monorepos, implementing CI/CD caching strategies with Turborepo, and deploying high-concurrency micro-frontends with Next.js 16 and Supabase.",
      techStack: [
        "TypeScript",
        "Next.js",
        "Tailwind CSS",
        "Drizzle ORM",
        "Turborepo",
        "PostgreSQL",
      ],
      displayOrder: 1,
    },
    {
      company: "Cloud Systems Corp",
      role: "Full-Stack Software Developer",
      location: "Jakarta, Indonesia",
      startDate: "2022",
      endDate: "2024",
      isCurrent: false,
      description:
        "Engineered resilient REST/GraphQL APIs, optimized PostgreSQL query performance by 40%, and built accessible component libraries using React and Tailwind.",
      techStack: [
        "React",
        "Node.js",
        "PostgreSQL",
        "Docker",
        "Redis",
        "TypeScript",
      ],
      displayOrder: 2,
    },
    {
      company: "Digital Studio Media",
      role: "Frontend Engineer",
      location: "Bandung, Indonesia",
      startDate: "2021",
      endDate: "2022",
      isCurrent: false,
      description:
        "Developed interactive web applications, implemented responsive UI designs, and collaborated on cross-platform client portals.",
      techStack: ["React", "JavaScript", "CSS3", "Next.js", "Git"],
      displayOrder: 3,
    },
  ])

  await db.delete(education)
  await db.insert(education).values([
    {
      institution: "Universitas Indonesia",
      degree: "Bachelor of Computer Science (B.Comp.Sc.)",
      field: "Software Engineering & Distributed Systems",
      startYear: "2018",
      endYear: "2022",
      gpa: "3.85 / 4.00",
      description:
        "Graduated with honors. Researched high-throughput database transaction pooling and deterministic distributed state machines.",
      displayOrder: 1,
    },
  ])

  await db.delete(certifications)
  await db.insert(certifications).values([
    {
      title: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      issueDate: "2025",
      credentialId: "AWS-SAA-8829103",
      credentialUrl: "https://aws.amazon.com/verification",
      badgeUrl:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=200&auto=format&fit=crop",
      displayOrder: 1,
    },
    {
      title: "Meta Certified Senior Full-Stack Engineer",
      issuer: "Meta / Coursera",
      issueDate: "2024",
      credentialId: "META-FS-991204",
      credentialUrl: "https://coursera.org/verify",
      badgeUrl:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=200&auto=format&fit=crop",
      displayOrder: 2,
    },
    {
      title: "PostgreSQL Database Administrator & Performance Specialist",
      issuer: "EnterpriseDB",
      issueDate: "2024",
      credentialId: "EDB-PG-55102",
      credentialUrl: "https://enterprisedb.com",
      badgeUrl:
        "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=200&auto=format&fit=crop",
      displayOrder: 3,
    },
  ])

  await db.delete(services)
  await db.insert(services).values([
    {
      title: "Enterprise Monorepo & System Architecture",
      slug: "enterprise-monorepo-architecture",
      summary:
        "Turborepo & Next.js workspace setup with strict typing, shared packages, and CI/CD pipelines.",
      description:
        "Complete design and deployment of enterprise-grade TypeScript monorepos with caching, automated linting, atomic design tokens, and shared database layers.",
      deliverables: [
        "Turborepo Config",
        "Design System UI Package",
        "Shared DB & Auth Packages",
        "Automated CI/CD",
      ],
      startingPrice: 15000000,
      isActive: true,
      displayOrder: 1,
    },
    {
      title: "High-Performance Full-Stack Web Development",
      slug: "fullstack-web-development",
      summary:
        "Next.js 16, React 19, Supabase, and Drizzle ORM web application development.",
      description:
        "End-to-end production web applications engineered for speed, SEO, responsiveness, and seamless developer maintenance.",
      deliverables: [
        "Full Application Source Code",
        "Database Migration Scripts",
        "Production Deployment",
        "Technical Documentation",
      ],
      startingPrice: 20000000,
      isActive: true,
      displayOrder: 2,
    },
    {
      title: "Performance & Database Optimization",
      slug: "performance-database-optimization",
      summary:
        "PostgreSQL query profiling, connection pooling, and Next.js Core Web Vitals optimization.",
      description:
        "In-depth audit and remediation of database latency, slow queries, bundling bottlenecks, and memory leaks.",
      deliverables: [
        "Comprehensive Audit Report",
        "Optimized Query Indexing",
        "Connection Pooler Setup",
        "Performance Metrics Verification",
      ],
      startingPrice: 8000000,
      isActive: true,
      displayOrder: 3,
    },
  ])

  await db.delete(caseStudies)
  await db.insert(caseStudies).values([
    {
      title: "Rizfolio: 6-in-1 Turborepo Modern Monorepo Ecosystem",
      slug: "rizfolio-turborepo-ecosystem",
      clientName: "Internal / Open Source",
      summary:
        "Architecting a modular ecosystem containing 6 applications with unified design system and shared database.",
      contentMd:
        "# Rizfolio Monorepo\n\nA unified multi-app digital presence powered by Next.js 16, Turborepo, and Supabase.",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
      liveUrl: "https://rizkyramadhan.dev",
      repoUrl: "https://github.com/ryzmdn/rizfolio",
      metrics: { appsCount: 6, packagesCount: 6, lighthouseScore: 99 },
      isPublished: true,
      displayOrder: 1,
    },
    {
      title: "FinFlow: Real-time Financial Transaction Processing",
      slug: "finflow-transaction-engine",
      clientName: "FinTech Global",
      summary:
        "Building an idempotent transaction pipeline handling 5,000 req/sec with PostgreSQL advisory locks.",
      contentMd:
        "# FinFlow Architecture\n\nHigh-throughput transactional engine with zero double-spends and instant reconciliation.",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
      liveUrl: "https://finflow.example.com",
      repoUrl: "https://github.com/ryzmdn/finflow",
      metrics: { tps: 5000, latencyP99Ms: 45 },
      isPublished: true,
      displayOrder: 2,
    },
  ])

  await db.delete(testimonials)
  await db.insert(testimonials).values([
    {
      clientName: "Sarah Jenkins",
      role: "VP of Engineering",
      company: "CloudScale Inc.",
      content:
        "Rizky transformed our development velocity by standardizing our monorepo architecture. His attention to detail and deep understanding of distributed systems is truly top-tier.",
      rating: 5,
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
      isFeatured: true,
      displayOrder: 1,
    },
    {
      clientName: "David Chen",
      role: "CTO & Co-Founder",
      company: "FinFlow Technologies",
      content:
        "The transaction processing engine built by Rizky is bulletproof. Zero downtime and exceptional performance under heavy load.",
      rating: 5,
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      isFeatured: true,
      displayOrder: 2,
    },
  ])

  console.log("Portfolio Domain Seeded Successfully.")
}

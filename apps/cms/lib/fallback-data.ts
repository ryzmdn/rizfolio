export const fallbackCmsChangelogs = [
  {
    id: "cl-1",
    version: "v1.3.0",
    title: "E-Commerce Store & Digital Fulfillment Engine",
    releaseDate: "2026-09-15",
    summary:
      "Comprehensive digital commerce platform featuring shopping cart slide-over, dual license tiers, automated download tokens, and structured SEO.",
    isPublished: true,
    createdAt: new Date("2026-09-15T00:00:00Z"),
  },
  {
    id: "cl-2",
    version: "v1.2.0",
    title: "Executive CMS & Centralized Audit Ledger",
    releaseDate: "2026-08-01",
    summary:
      "Quiet and calm mission control deck with rate limiting, transaction ledger, and real-time cache revalidation dispatchers.",
    isPublished: true,
    createdAt: new Date("2026-08-01T00:00:00Z"),
  },
  {
    id: "cl-3",
    version: "v1.1.0",
    title: "High-End Engineering Publication & Markdown Engine",
    releaseDate: "2026-06-20",
    summary:
      "Typography-first monograph blog featuring serif display headlines, code syntax highlighting, and reading-time metrics.",
    isPublished: true,
    createdAt: new Date("2026-06-20T00:00:00Z"),
  },
]

export const fallbackCmsChangelogItems = [
  {
    id: "cli-1",
    changelogId: "cl-1",
    category: "FEATURE",
    description:
      "Instant license key delivery via transactional Resend emails with cryptographically signed tokens.",
    displayOrder: 1,
  },
  {
    id: "cli-2",
    changelogId: "cl-1",
    category: "IMPROVEMENT",
    description:
      "Added cart drawer with smooth slide-over transitions and optimistic state updates.",
    displayOrder: 2,
  },
  {
    id: "cli-3",
    changelogId: "cl-2",
    category: "FEATURE",
    description:
      "Comprehensive master transaction ledger tracking every systemic operation across domains.",
    displayOrder: 1,
  },
  {
    id: "cli-4",
    changelogId: "cl-3",
    category: "FEATURE",
    description:
      "Monographic serif typographic layout with generous margins and responsive line-heights.",
    displayOrder: 1,
  },
]

export const fallbackCmsRoadmapItems = [
  {
    id: "rd-1",
    title: "Automated Algolia Full-Text Indexing",
    description:
      "Real-time edge sync between Drizzle ORM mutations and Algolia search indices across all publications.",
    stage: "IN_PROGRESS",
    quarter: "Q4 2026",
    priority: "HIGH",
    scope: ["monorepo", "search"],
    relatedVersion: "v1.3.0",
    displayOrder: 1,
    createdAt: new Date("2026-09-01T00:00:00Z"),
    updatedAt: new Date("2026-09-01T00:00:00Z"),
  },
  {
    id: "rd-2",
    title: "WebAuthn & Passkey Authentication",
    description:
      "Biometric and hardware key support for zero-friction executive dashboard access.",
    stage: "PLANNED",
    quarter: "Q1 2027",
    priority: "MEDIUM",
    scope: ["auth", "security"],
    relatedVersion: null,
    displayOrder: 2,
    createdAt: new Date("2026-09-01T00:00:00Z"),
    updatedAt: new Date("2026-09-01T00:00:00Z"),
  },
  {
    id: "rd-3",
    title: "Dynamic OpenGraph Image Generation",
    description:
      "Automated @vercel/og card synthesis with live typography metrics for every release note.",
    stage: "SHIPPED",
    quarter: "Q3 2026",
    priority: "HIGH",
    scope: ["changelog", "seo"],
    relatedVersion: "v1.2.0",
    displayOrder: 3,
    createdAt: new Date("2026-08-01T00:00:00Z"),
    updatedAt: new Date("2026-08-01T00:00:00Z"),
  },
]

export const fallbackCmsCategories = [
  {
    id: "cat-1",
    name: "Architecture",
    slug: "architecture",
    description:
      "High-level software design, monorepos, and distributed systems.",
  },
  {
    id: "cat-2",
    name: "Engineering",
    slug: "engineering",
    description:
      "Performance optimization, database tuning, and TypeScript patterns.",
  },
  {
    id: "cat-3",
    name: "Design Systems",
    slug: "design-systems",
    description:
      "Tailwind CSS v4, OKLCH color spaces, and design token architecture.",
  },
]

export const fallbackCmsTags = [
  { id: "tag-1", name: "Next.js 15", slug: "nextjs-15" },
  { id: "tag-2", name: "React 19", slug: "react-19" },
  { id: "tag-3", name: "Turborepo", slug: "turborepo" },
  { id: "tag-4", name: "Tailwind v4", slug: "tailwind-v4" },
]

export const fallbackCmsPosts = [
  {
    id: "post-1",
    title: "Deterministic Full-Stack Monorepos with Turborepo & Next.js 15",
    slug: "deterministic-monorepos-turborepo-nextjs15",
    excerpt:
      "A comprehensive architectural guide to structuring multi-app ecosystems with shared design tokens and isolated data layers.",
    contentMd:
      "## Monorepo Architecture\n\nFull-stack monorepo ecosystems allow teams to share core design systems...",
    coverImageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    status: "PUBLISHED",
    readingTime: 8,
    isFeatured: true,
    publishedAt: new Date("2026-08-10T00:00:00Z"),
    seoTitle: "Deterministic Full-Stack Monorepos with Turborepo & Next.js 15",
    seoDesc: "Architectural guide for multi-app monorepos.",
    createdAt: new Date("2026-08-10T00:00:00Z"),
    updatedAt: new Date("2026-08-10T00:00:00Z"),
  },
  {
    id: "post-2",
    title: "Perceptual Uniformity: Migrating to OKLCH in Modern Web Design",
    slug: "perceptual-uniformity-migrating-to-oklch",
    excerpt:
      "Why traditional sRGB color palettes fall short in dark mode contrast and how OKLCH guarantees consistent lightness across hues.",
    contentMd:
      "## The Math Behind Perceptual Color\n\nModern displays demand wider color gamut support...",
    coverImageUrl:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
    status: "PUBLISHED",
    readingTime: 6,
    isFeatured: false,
    publishedAt: new Date("2026-07-25T00:00:00Z"),
    seoTitle: "Perceptual Uniformity with OKLCH Color Space",
    seoDesc: "Understanding OKLCH color math in modern design systems.",
    createdAt: new Date("2026-07-25T00:00:00Z"),
    updatedAt: new Date("2026-07-25T00:00:00Z"),
  },
]

export const fallbackCmsProducts = [
  {
    id: "prod-1",
    title: "Apex Next.js 15 Enterprise Starter Kit",
    slug: "apex-nextjs-starter-kit",
    description:
      "Production-ready monorepo boilerplate with Turborepo, Next.js 15, Drizzle ORM, and Tailwind v4.",
    price: 349000,
    currency: "IDR",
    productType: "STARTER_KIT",
    coverImageUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    galleryUrls: [],
    stock: 999,
    isActive: true,
    createdAt: new Date("2026-09-01T00:00:00Z"),
    updatedAt: new Date("2026-09-01T00:00:00Z"),
  },
  {
    id: "prod-2",
    title: "Sovereign UI Token Architecture Kit",
    slug: "sovereign-ui-tokens",
    description:
      "Hand-crafted monochromatic design tokens and primitives calibrated in OKLCH for dark-mode excellence.",
    price: 199000,
    currency: "IDR",
    productType: "UI_KIT",
    coverImageUrl:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
    galleryUrls: [],
    stock: 999,
    isActive: true,
    createdAt: new Date("2026-09-05T00:00:00Z"),
    updatedAt: new Date("2026-09-05T00:00:00Z"),
  },
]

export const fallbackCmsOrders = [
  {
    id: "ord-1",
    orderNumber: "ORD-202609-8812",
    customerName: "Alex Dev",
    customerEmail: "developer@example.com",
    totalAmount: 349000,
    currency: "IDR",
    status: "PAID",
    paymentProvider: "MIDTRANS",
    paymentRef: "mid-test-8812",
    createdAt: new Date("2026-09-18T10:30:00Z"),
    updatedAt: new Date("2026-09-18T10:30:00Z"),
  },
  {
    id: "ord-2",
    orderNumber: "ORD-202609-7741",
    customerName: "Studio Founder",
    customerEmail: "founder@studio.design",
    totalAmount: 199000,
    currency: "IDR",
    status: "PAID",
    paymentProvider: "STRIPE",
    paymentRef: "ch_test_7741",
    createdAt: new Date("2026-09-17T14:20:00Z"),
    updatedAt: new Date("2026-09-17T14:20:00Z"),
  },
]

export const fallbackCmsCoupons = [
  {
    id: "cpn-1",
    code: "LAUNCH20",
    discountPercent: 20,
    description: "Launch discount for community members",
    expiresAt: new Date("2026-12-31T23:59:59Z"),
    minSpend: 100000,
    maxUses: 100,
    usedCount: 24,
    isActive: true,
    createdAt: new Date("2026-09-01T00:00:00Z"),
    updatedAt: new Date("2026-09-01T00:00:00Z"),
  },
]

export const fallbackCmsRepositories = [
  {
    id: "repo-1",
    name: "rizfolio-core",
    slug: "rizfolio-core",
    description:
      "Flagship luxury monorepo ecosystem with 7 micro-frontends, shared UI tokens, and transaction ledger.",
    category: "MONOREPO",
    courseName: "Software Engineering",
    semester: "Semester 7",
    techStack: ["Next.js 15", "React 19", "Turborepo", "Tailwind CSS v4"],
    githubUrl: "https://github.com/ryzmdn/rizfolio",
    demoUrl: "https://portfolio.ryzmdn.me",
    license: "MIT",
    starsCount: 142,
    viewsCount: 1850,
    downloadsCount: 320,
    readmeContent:
      "# Rizfolio Core Monorepo\n\nHigh-performance monochromatic personal ecosystem...",
    isPublic: true,
    createdAt: new Date("2026-01-15T00:00:00Z"),
    updatedAt: new Date("2026-09-20T00:00:00Z"),
  },
  {
    id: "repo-2",
    name: "neuro-adaptive-ui",
    slug: "neuro-adaptive-ui",
    description:
      "Client-side biometric attention tracker and contrast adapter for accessibility-first web apps.",
    category: "RESEARCH",
    courseName: "Human-Computer Interaction",
    semester: "Semester 6",
    techStack: ["TypeScript", "WebRTC", "Canvas API", "OKLCH"],
    githubUrl: "https://github.com/ryzmdn/neuro-adaptive-ui",
    demoUrl: null,
    license: "Apache-2.0",
    starsCount: 88,
    viewsCount: 940,
    downloadsCount: 150,
    readmeContent:
      "# Neuro-Adaptive UI\n\nExperimental perceptual contrast engine...",
    isPublic: true,
    createdAt: new Date("2026-03-10T00:00:00Z"),
    updatedAt: new Date("2026-08-15T00:00:00Z"),
  },
]

export const fallbackCmsProfile = {
  id: "prof-1",
  fullName: "Rizky Ramadhan",
  title: "Principal Systems Architect & Creative Technologist",
  headline:
    "Crafting deterministic web systems and monochromatic luxury interfaces.",
  bio: "Architecting enterprise distributed systems, high-concurrency commerce engines, and precision-engineered user interfaces with modern web standards.",
  location: "Jakarta, Indonesia",
  resumeUrl: "/resume.pdf",
  status: "ACTIVE",
  socialLinks: { github: "https://github.com/ryzmdn" },
  updatedAt: new Date("2026-09-01T00:00:00Z"),
}

export const fallbackCmsExperiences = [
  {
    id: "exp-1",
    role: "Lead Full-Stack Engineer",
    company: "Sovereign Engineering Studio",
    location: "Jakarta, Remote",
    companyLogoUrl: null,
    startDate: "2024-01-01",
    endDate: null,
    isCurrent: true,
    description:
      "Spearheading distributed systems design and monorepo governance for premium digital ventures.",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
    displayOrder: 1,
    createdAt: new Date("2026-01-01T00:00:00Z"),
  },
]

export const fallbackCmsEducation = [
  {
    id: "edu-1",
    institution: "State University",
    degree: "Bachelor of Science in Informatics",
    field: "Software Engineering & Distributed Systems",
    startYear: "2021",
    endYear: "2025",
    gpa: "3.92",
    description:
      "Focus on distributed transaction concurrency and web performance optimization.",
    displayOrder: 1,
    createdAt: new Date("2026-01-01T00:00:00Z"),
  },
]

export const fallbackCmsCertifications = [
  {
    id: "cert-1",
    title: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    issueDate: "2024-05-15",
    expiryDate: "2027-05-15",
    credentialId: "AWS-PSA-99124",
    credentialUrl: "https://aws.amazon.com/verification",
    badgeUrl: null,
    displayOrder: 1,
    createdAt: new Date("2026-05-15T00:00:00Z"),
  },
]

export const fallbackCmsServices = [
  {
    id: "srv-1",
    title: "Full-Stack Web Architecture & Monorepos",
    slug: "web-architecture-monorepos",
    summary:
      "High-performance Next.js 15 enterprise setups with Turborepo and strict package isolation.",
    description:
      "Deterministic Turborepo setup, shared design tokens, and optimized query pipelines.",
    deliverables: [
      "Deterministic Turborepo Setup",
      "Design Token Pipeline",
      "Zero-Cold-Start DB Pooling",
    ],
    startingPrice: 15000000,
    isActive: true,
    displayOrder: 1,
    createdAt: new Date("2026-09-01T00:00:00Z"),
  },
]

export const fallbackCmsCaseStudies = [
  {
    id: "cs-1",
    title: "Rizfolio Luxury Monorepo Ecosystem",
    slug: "rizfolio-luxury-ecosystem",
    clientName: "Rizfolio Internal",
    summary:
      "Architecting 7 integrated front-ends with unified design tokens, sub-second TTFB, and an executive transaction ledger.",
    contentMd:
      "## Monorepo Architecture\n\nHigh-performance monochromatic personal ecosystem...",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    liveUrl: "https://portfolio.ryzmdn.me",
    repoUrl: "https://github.com/ryzmdn/rizfolio",
    metrics: { performance: 100 },
    isPublished: true,
    displayOrder: 1,
    viewsCount: 1420,
    createdAt: new Date("2026-09-01T00:00:00Z"),
    updatedAt: new Date("2026-09-01T00:00:00Z"),
  },
]

export const fallbackCmsTestimonials = [
  {
    id: "tst-1",
    clientName: "Alexander Wright",
    role: "VP of Product",
    company: "Vertex Labs",
    content:
      "Rizky's precision in systems architecture and design execution is unmatched. The platform delivers sub-second speeds effortlessly.",
    rating: 5,
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    isFeatured: true,
    displayOrder: 1,
    createdAt: new Date("2026-09-01T00:00:00Z"),
  },
]

export const fallbackCmsTransactions = [
  {
    id: "trx-1",
    trxNumber: "TRX-SYS-202611-A8F1C2",
    domain: "SYSTEM",
    actionType: "CHANGELOG_RELEASED",
    entityType: "changelogs",
    entityId: "cl-1",
    actorType: "OWNER",
    amount: 0,
    currency: "IDR",
    status: "COMPLETED",
    createdAt: new Date("2026-11-06T15:30:00Z"),
  },
  {
    id: "trx-2",
    trxNumber: "TRX-SHP-202611-B9D4E1",
    domain: "SHOP",
    actionType: "DIGITAL_ORDER_SETTLED",
    entityType: "orders",
    entityId: "ord-1",
    actorType: "CUSTOMER",
    amount: 349000,
    currency: "IDR",
    status: "COMPLETED",
    createdAt: new Date("2026-11-06T14:20:00Z"),
  },
  {
    id: "trx-3",
    trxNumber: "TRX-SEC-202611-C1E5F9",
    domain: "AUTH_SECURITY",
    actionType: "ADMIN_LOGIN_SUCCESS",
    entityType: "users",
    entityId: "owner-admin-root",
    actorType: "OWNER",
    amount: 0,
    currency: "IDR",
    status: "COMPLETED",
    createdAt: new Date("2026-11-07T04:10:00Z"),
  },
]

export const fallbackCmsInquiries = [
  {
    id: "inq-1",
    name: "Sophia Chen",
    email: "sophia.chen@enterprise.io",
    subject: "Inquiry on Distributed Systems Consultation",
    message:
      "We are exploring a monorepo migration and would love to consult on architecture and performance tuning.",
    status: "NEW",
    createdAt: new Date("2026-11-05T09:15:00Z"),
  },
]

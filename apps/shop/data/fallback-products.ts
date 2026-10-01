export interface ShopProductFile {
  id: string
  fileName: string
  fileSizeBytes: number
}

export interface ProductFaq {
  question: string
  answer: string
}

export interface ShopProduct {
  id: string
  slug: string
  title: string
  description: string
  price: number
  extendedPrice: number
  currency: string
  productType: "DIGITAL_DOWNLOAD" | "SERVICE" | "PHYSICAL"
  category: "STARTER_KIT" | "UI_SYSTEM" | "BACKEND" | "CONSULTATION"
  coverImageUrl: string
  galleryUrls: string[]
  features: string[]
  techStack: string[]
  rating: number
  reviewCount: number
  stock: number
  isActive: boolean
  createdAt: string
  demoUrl?: string
  files?: ShopProductFile[]
  faq: ProductFaq[]
}

export interface ProductReview {
  id: string
  productSlug: string
  authorName: string
  authorRole: string
  rating: number
  content: string
  createdAt: string
  verifiedPurchase: boolean
}

export interface PromoCoupon {
  code: string
  discountPercent: number
  description: string
  expiresAt: string
  minSpend?: number
}

export interface DigitalOrder {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  totalAmount: number
  currency: string
  status: "COMPLETED" | "PENDING" | "FAILED"
  paymentMethod: string
  createdAt: string
  items: {
    productId: string
    productTitle: string
    productSlug: string
    licenseType: "STANDARD" | "EXTENDED"
    pricePaid: number
    downloadToken?: string
    licenseKey?: string
    fileName?: string
    fileSizeBytes?: number
  }[]
}

export const fallbackProducts: ShopProduct[] = [
  {
    id: "prod-1",
    slug: "turborepo-nextjs16-starter-kit",
    title: "Turborepo & Next.js 16 Enterprise Starter Kit",
    description:
      "Production-ready monorepo architecture featuring React 19, Tailwind CSS v4, Drizzle ORM, Supabase Auth, and pre-configured CI/CD pipelines engineered for high-concurrency SaaS applications.",
    price: 249000,
    extendedPrice: 449000,
    currency: "IDR",
    productType: "DIGITAL_DOWNLOAD",
    category: "STARTER_KIT",
    coverImageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop",
    ],
    features: [
      "Complete Next.js 16 App Router setup with React 19 Server Components",
      "Pre-configured Turborepo pipeline with remote caching support",
      "Strict TypeScript configuration with zero runtime type errors",
      "Drizzle ORM schema with automated migration workflows",
      "Multi-package shared UI components and design token packages",
      "Docker compose environment for local PostgreSQL and Redis orchestration",
    ],
    techStack: [
      "Turborepo",
      "Next.js 16",
      "React 19",
      "Tailwind CSS v4",
      "Drizzle ORM",
      "TypeScript",
      "PostgreSQL",
    ],
    rating: 4.9,
    reviewCount: 38,
    stock: 999,
    isActive: true,
    createdAt: "2026-08-01T00:00:00.000Z",
    demoUrl: "https://demo-starter.rizkyramadhan.dev",
    files: [
      {
        id: "file-1",
        fileName: "turborepo-enterprise-v1.0.0.zip",
        fileSizeBytes: 2457600,
      },
    ],
    faq: [
      {
        question: "What is included with the Standard License?",
        answer:
          "The Standard License permits deployment on one commercial or personal project. You receive full unminified source code, lifetime patches, and single-developer documentation access.",
      },
      {
        question: "How do I download updates after purchasing?",
        answer:
          "Your order receipt includes a permanent download token that automatically resolves to the latest version published in the storage repository.",
      },
      {
        question: "Can this template be integrated with Supabase or Neon?",
        answer:
          "Yes. The Drizzle ORM client uses standard connection strings compatible with Supabase connection poolers, Neon serverless, and self-hosted PostgreSQL.",
      },
    ],
  },
  {
    id: "prod-2",
    slug: "tailwind-v4-component-system",
    title: "Tailwind CSS v4 & OKLCH Enterprise UI Kit",
    description:
      "A comprehensive design system comprising over 60 accessible, production-tested components with fluid OKLCH color palettes, dark and light theme tokens, and zero runtime overhead.",
    price: 199000,
    extendedPrice: 349000,
    currency: "IDR",
    productType: "DIGITAL_DOWNLOAD",
    category: "UI_SYSTEM",
    coverImageUrl:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581291518655-9523c932deb8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1200&auto=format&fit=crop",
    ],
    features: [
      "Over 60 fully accessible WAI-ARIA compliant components",
      "Dynamic OKLCH color palettes with high-contrast APCA ratings",
      "Seamless light, dark, and system theme switching",
      "Modular structure designed for easy copy-paste or package installation",
      "Form components integrated with Zod validation patterns",
      "Data visualization primitives and responsive table layouts",
    ],
    techStack: [
      "Tailwind CSS v4",
      "React 19",
      "Radix UI",
      "OKLCH Colors",
      "Lucide Icons",
      "TypeScript",
    ],
    rating: 5.0,
    reviewCount: 44,
    stock: 999,
    isActive: true,
    createdAt: "2026-08-05T00:00:00.000Z",
    demoUrl: "https://demo-ui.rizkyramadhan.dev",
    files: [
      {
        id: "file-2",
        fileName: "tailwind-v4-ui-kit.zip",
        fileSizeBytes: 1843200,
      },
    ],
    faq: [
      {
        question: "Does this require Tailwind CSS v4?",
        answer:
          "Yes, this UI Kit is built natively for Tailwind CSS v4 using CSS variable themes and does not require complex tailwind.config.js configurations.",
      },
      {
        question: "Are the components accessible?",
        answer:
          "Every interactive component complies with WCAG AA standards, supports complete keyboard navigation, and provides proper ARIA screen reader attributes.",
      },
    ],
  },
  {
    id: "prod-3",
    slug: "drizzle-supabase-boilerplate",
    title: "Drizzle ORM & Supabase Transaction Pooler Boilerplate",
    description:
      "Deterministic data access layer architecture with strict type safety, transaction logging, connection pooling resiliency, and automated Drizzle Kit migrations.",
    price: 149000,
    extendedPrice: 279000,
    currency: "IDR",
    productType: "DIGITAL_DOWNLOAD",
    category: "BACKEND",
    coverImageUrl:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1200&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
    ],
    features: [
      "Deterministic transaction management with automatic retry wrappers",
      "Resilient fallback patterns for transient connection pool drops",
      "Optimized prepared statements for sub-10ms query execution",
      "Complete audit logging schema for financial and security compliance",
      "Pre-configured Drizzle Kit migration scripts",
      "Zero schema drifting with full TypeScript inference",
    ],
    techStack: [
      "Drizzle ORM",
      "PostgreSQL",
      "Supabase",
      "TypeScript",
      "Node.js",
      "Docker",
    ],
    rating: 4.8,
    reviewCount: 22,
    stock: 999,
    isActive: true,
    createdAt: "2026-08-10T00:00:00.000Z",
    demoUrl: "https://demo-drizzle.rizkyramadhan.dev",
    files: [
      {
        id: "file-3",
        fileName: "drizzle-supabase-kit.zip",
        fileSizeBytes: 1228800,
      },
    ],
    faq: [
      {
        question: "Can I use this with serverless environments?",
        answer:
          "Yes. The connection client utilizes the Postgres-JS driver configured specifically for Supabase transaction mode poolers on port 6543.",
      },
      {
        question: "Are database seeds included?",
        answer:
          "Yes, realistic seed scripts for products, orders, and user tables are provided out of the box.",
      },
    ],
  },
  {
    id: "prod-4",
    slug: "microservices-go-grpc-engine",
    title: "High-Throughput Go & gRPC Microservices Engine",
    description:
      "Production-grade microservices engine written in Go 1.24 featuring protocol buffers, distributed tracing via OpenTelemetry, Prometheus metrics, and structured log sinks.",
    price: 289000,
    extendedPrice: 499000,
    currency: "IDR",
    productType: "DIGITAL_DOWNLOAD",
    category: "BACKEND",
    coverImageUrl:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1200&auto=format&fit=crop",
    ],
    features: [
      "Clean architecture with domain-driven design separation",
      "gRPC unary and streaming services with protobuf definitions",
      "Structured JSON logging with slog and trace ID correlation",
      "Circuit breaker implementation preventing cascade failures",
      "Prometheus metrics endpoint with p99 latency counters",
      "Multi-stage Dockerfile producing lightweight alpine containers",
    ],
    techStack: [
      "Go 1.24",
      "gRPC",
      "Protobuf",
      "OpenTelemetry",
      "PostgreSQL",
      "Docker",
    ],
    rating: 4.9,
    reviewCount: 19,
    stock: 999,
    isActive: true,
    createdAt: "2026-08-11T00:00:00.000Z",
    demoUrl: "https://demo-grpc.rizkyramadhan.dev",
    files: [
      {
        id: "file-4",
        fileName: "go-microservices-engine.zip",
        fileSizeBytes: 3145728,
      },
    ],
    faq: [
      {
        question: "Which Go version is required?",
        answer:
          "The engine requires Go 1.23 or higher to leverage modern language features and standard library improvements.",
      },
      {
        question: "Does it support HTTP JSON gateway?",
        answer:
          "Yes, grpc-gateway is configured to expose REST endpoints alongside native gRPC services.",
      },
    ],
  },
  {
    id: "prod-5",
    slug: "fullstack-architecture-consultation",
    title: "1-on-1 Full-Stack Architecture & Code Review Session",
    description:
      "A 60-minute technical consultation reviewing your system design, database schemas, query performance bottlenecks, monorepo structures, and frontend rendering strategies.",
    price: 750000,
    extendedPrice: 1250000,
    currency: "IDR",
    productType: "SERVICE",
    category: "CONSULTATION",
    coverImageUrl:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    ],
    features: [
      "60-minute one-on-one live video session via Google Meet",
      "Deep architectural review of your existing repository",
      "Database schema evaluation and indexing recommendations",
      "Frontend performance and Core Web Vitals audit",
      "Written summary report and actionable improvement checklist",
      "7 days of follow-up asynchronous email support",
    ],
    techStack: [
      "Next.js",
      "React",
      "PostgreSQL",
      "Go",
      "TypeScript",
      "Cloud Infrastructure",
    ],
    rating: 5.0,
    reviewCount: 31,
    stock: 5,
    isActive: true,
    createdAt: "2026-08-12T00:00:00.000Z",
    faq: [
      {
        question: "How is the session scheduled?",
        answer:
          "Upon completing your booking, you receive an automated link to select a calendar time slot that fits your schedule.",
      },
      {
        question: "Can I invite other team members?",
        answer:
          "Yes, up to 3 engineers from your team may join the video call at no extra charge.",
      },
    ],
  },
  {
    id: "prod-6",
    slug: "code-review-performance-audit",
    title: "Deep Codebase & Database Performance Audit",
    description:
      "An asynchronous architectural audit of your repository covering security vulnerabilities, N+1 query patterns, bundle size optimization, and hydration performance.",
    price: 1200000,
    extendedPrice: 2100000,
    currency: "IDR",
    productType: "SERVICE",
    category: "CONSULTATION",
    coverImageUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1200&auto=format&fit=crop",
    ],
    features: [
      "Comprehensive code review of up to 15,000 lines of code",
      "Database query profiling and slow query identification",
      "Next.js bundle analysis and unused dependency removal plan",
      "Security audit for sensitive secrets and injection risks",
      "Detailed 10+ page PDF audit report with concrete code diffs",
      "30-minute walkthrough call to present key findings",
    ],
    techStack: [
      "Architecture",
      "Security",
      "Database Optimization",
      "Performance",
      "Next.js",
      "TypeScript",
    ],
    rating: 5.0,
    reviewCount: 16,
    stock: 3,
    isActive: true,
    createdAt: "2026-08-14T00:00:00.000Z",
    faq: [
      {
        question: "What is the turnaround time?",
        answer:
          "Audits are completed within 3 to 5 business days after repository access is granted.",
      },
      {
        question: "Do you sign an NDA before access?",
        answer:
          "Yes. A mutual Non-Disclosure Agreement can be signed prior to repository sharing.",
      },
    ],
  },
]

export const fallbackReviews: ProductReview[] = [
  {
    id: "rev-1",
    productSlug: "turborepo-nextjs16-starter-kit",
    authorName: "Alexander Wright",
    authorRole: "Principal Engineer at Veloce",
    rating: 5,
    content:
      "The cleanest monorepo template I have tested. Turborepo caching combined with Drizzle connection pooling cut our initial project setup time from weeks to an afternoon.",
    createdAt: "2026-08-15T10:30:00.000Z",
    verifiedPurchase: true,
  },
  {
    id: "rev-2",
    productSlug: "turborepo-nextjs16-starter-kit",
    authorName: "Dion Prasetya",
    authorRole: "Lead Full-Stack Developer",
    rating: 5,
    content:
      "Strict TypeScript compliance across all packages is impressive. No implicit anys and clean shared UI tokens. Worth every penny.",
    createdAt: "2026-08-18T14:20:00.000Z",
    verifiedPurchase: true,
  },
  {
    id: "rev-3",
    productSlug: "tailwind-v4-component-system",
    authorName: "Elena Rostova",
    authorRole: "Product Designer & UI Engineer",
    rating: 5,
    content:
      "The OKLCH color token integration is stellar. Colors look vibrant and uniform across dark and light modes with zero flickering.",
    createdAt: "2026-08-19T09:15:00.000Z",
    verifiedPurchase: true,
  },
  {
    id: "rev-4",
    productSlug: "drizzle-supabase-boilerplate",
    authorName: "Marcus Sterling",
    authorRole: "CTO at Nexus Fintech",
    rating: 5,
    content:
      "The connection pooler resilience wrappers saved our production app during a high-traffic launch. Deterministic transactions executed without dropped states.",
    createdAt: "2026-08-20T16:45:00.000Z",
    verifiedPurchase: true,
  },
  {
    id: "rev-5",
    productSlug: "fullstack-architecture-consultation",
    authorName: "Kevin Handoko",
    authorRole: "Founder at ByteCraft Studio",
    rating: 5,
    content:
      "Rizky identified our PostgreSQL locking bottlenecks within the first 20 minutes of the call. His written recommendations were concise and immediately actionable.",
    createdAt: "2026-08-22T11:00:00.000Z",
    verifiedPurchase: true,
  },
]

export const fallbackCoupons: PromoCoupon[] = [
  {
    code: "WELCOME10",
    discountPercent: 10,
    description: "10% discount for first-time engineering purchases",
    expiresAt: "2026-12-31T23:59:59.000Z",
  },
  {
    code: "DEV20",
    discountPercent: 20,
    description: "20% developer community appreciation discount",
    expiresAt: "2026-12-31T23:59:59.000Z",
    minSpend: 200000,
  },
  {
    code: "LAUNCH50",
    discountPercent: 50,
    description: "50% exclusive promotional coupon",
    expiresAt: "2026-12-31T23:59:59.000Z",
    minSpend: 500000,
  },
]

export const fallbackOrders: DigitalOrder[] = [
  {
    id: "ord-sample-1",
    orderNumber: "RZ-849201",
    customerName: "Alexander Wright",
    customerEmail: "alexander.wright@veloce.dev",
    totalAmount: 249000,
    currency: "IDR",
    status: "COMPLETED",
    paymentMethod: "QRIS",
    createdAt: "2026-08-15T10:30:00.000Z",
    items: [
      {
        productId: "prod-1",
        productTitle: "Turborepo & Next.js 16 Enterprise Starter Kit",
        productSlug: "turborepo-nextjs16-starter-kit",
        licenseType: "STANDARD",
        pricePaid: 249000,
        downloadToken: "tok_turborepo_starter_v1_secure849201",
        licenseKey: "RZ-TRB-16-STD-849201-98AF",
        fileName: "turborepo-enterprise-v1.0.0.zip",
        fileSizeBytes: 2457600,
      },
    ],
  },
]

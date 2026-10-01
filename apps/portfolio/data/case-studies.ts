export interface CaseStudy {
  id: number | string
  slug: string
  category: string
  title: string
  clientName?: string
  summary: string
  image: string
  contentMd: string
  metrics?: Record<string, string | number>
  techStack?: string[]
  liveUrl?: string
  repoUrl?: string
  year?: string
  role?: string
}

export const caseStudies: CaseStudy[] = [
  {
    id: 1,
    slug: "erzen-ui-component-library",
    category: "Design System & UI Architecture",
    title: "ErzenUI: Enterprise Component Library & Design Tokens",
    clientName: "Enterprise Design Guild",
    year: "2025",
    role: "Lead Systems Architect",
    summary:
      "A deterministic, accessible component architecture standardizing design tokens, atomic UI primitives, and micro-interactions across multi-brand applications.",
    image:
      "https://res.cloudinary.com/dhaonb1vn/image/upload/v1787456335/Gemini_Generated_Image_f6xci5f6xci5f6xc_yuxs5q.jpg",
    liveUrl: "https://erzenui.dev",
    repoUrl: "https://github.com/ryzmdn/erzen-ui",
    metrics: {
      "Core Components": "48+",
      "A11y Accessibility": "100%",
      "Gzipped Bundle": "11.2 KB",
      "Token Coverage": "100%",
    },
    techStack: [
      "TypeScript",
      "React 19",
      "Tailwind CSS v4",
      "Base UI",
      "Turborepo",
      "Figma Tokens",
    ],
    contentMd: `## Executive Overview

ErzenUI was engineered to eliminate design drift and redundant frontend boilerplate across enterprise web applications. By establishing a unified token pipeline connecting Figma styles to CSS custom properties and type-safe React primitives, engineering teams achieved zero-friction feature shipping while strictly satisfying WCAG 2.1 AAA compliance.

### The Architecture Challenge
Prior to ErzenUI, cross-functional teams operated across disparate design guidelines, resulting in 4 different modal implementations, mismatched contrast ratios, and severe bundle fragmentation. The core requirement was a zero-runtime, headless token engine supporting dark/light mode switching without layout shift.

### Engineering Solution
1. **Design Token Synchronizer**: Built an automated GitHub Action transforming design tokens into deterministic CSS variables and Tailwind theme layers.
2. **Headless Atomic Primitives**: Structured components around accessible headless behaviors, separating DOM structure from aesthetic styling.
3. **Compound Component API**: Leveraged React Context and compound patterns to maximize developer ergonomics and eliminate prop drilling.

### Verifiable Business Impact
* **60% faster UI delivery**: Engineers shipped production-grade interfaces using pre-validated design primitives.
* **100% Core Web Vitals**: Zero CLS during theme hydration and minimal JavaScript footprint.`,
  },
  {
    id: 2,
    slug: "diquran-digital-experience",
    category: "Digital Publication & Web Platform",
    title: "DiQuran: Modern & Accessible Digital Quran Experience",
    clientName: "Open Islamic Tech Foundation",
    year: "2024",
    role: "Full-Stack Engineer & Product Designer",
    summary:
      "An ultra-fast, offline-first digital Quran reader with localized audio recitations, phonetic search, word-by-word transliteration, and bookmark sync.",
    image:
      "https://res.cloudinary.com/dhaonb1vn/image/upload/v1787456335/Gemini_Generated_Image_hjkpzohjkpzohjkp_pa0td6.jpg",
    liveUrl: "https://diquran.app",
    repoUrl: "https://github.com/ryzmdn/diquran",
    metrics: {
      "Initial Page Load": "38ms",
      "Daily Active Readers": "15,000+",
      "Offline Availability": "100%",
      "Surah Chapters": "114",
    },
    techStack: [
      "Next.js 16",
      "TypeScript",
      "Supabase",
      "Tailwind CSS",
      "IndexedDB",
      "Web Audio API",
    ],
    contentMd: `## Executive Overview

DiQuran delivers a distraction-free, respectful digital reading environment. Designed to run flawlessly on low-end smartphones with intermittent 3G connectivity, it utilizes aggressive caching, service worker pre-buffering, and IndexedDB storage to guarantee instant verse lookup.

### Key Highlights
* **Zero-Latency Audio Player**: Custom Web Audio API implementation with synchronized verse highlighting and gapless playback.
* **Optimized Font Rendering**: Precision font-display strategy utilizing Amiri and Scheherazade New with zero Cumulative Layout Shift (CLS).
* **Multi-language Tafsir**: Searchable database of classical and contemporary interpretations with full-text search capability.`,
  },
  {
    id: 3,
    slug: "matchalabs-devops-telemetry",
    category: "DevOps & Cloud Infrastructure",
    title: "MatchaLabs: Automated Deployment Pipeline & Telemetry",
    clientName: "MatchaLabs Infrastructure",
    year: "2024",
    role: "DevOps & SRE Engineer",
    summary:
      "Enterprise CI/CD orchestration, automated multi-stage container builds, and comprehensive OpenTelemetry tracing for microservice deployments.",
    image:
      "https://res.cloudinary.com/dhaonb1vn/image/upload/v1787456333/Gemini_Generated_Image_cukmspcukmspcukm_e4o8qm.jpg",
    liveUrl: "https://matchalabs.dev",
    repoUrl: "https://github.com/ryzmdn/matchalabs-infra",
    metrics: {
      "Build Time Reduction": "64%",
      "System Uptime": "99.98%",
      "Deploys per Week": "140+",
      "MTTR Remediation": "< 5 min",
    },
    techStack: [
      "Docker",
      "GitHub Actions",
      "PostgreSQL",
      "Prometheus",
      "Grafana",
      "OpenTelemetry",
    ],
    contentMd: `## Executive Overview

MatchaLabs provides automated cloud engineering environments. This project consolidated disjointed deployment scripts into a centralized, observable pipeline equipped with blue-green canary deployments, automatic rollbacks, and distributed tracing.

### Core Architectural Decisions
* **Multi-Architecture Docker Builds**: Optimized layer caching reduced image sizes by 58% and container spin-up times to sub-2 seconds.
* **Telemetry Dashboarding**: Unified Grafana dashboards tracking p95/p99 request latencies, memory pressure, and database connection pool saturation.
* **Zero-Downtime Migration Runner**: Automated database schema migrations with transactional rollbacks and health check verification.`,
  },
  {
    id: 4,
    slug: "ecobouquet-floral-commerce",
    category: "E-Commerce & Digital Marketplace",
    title: "EcoBouquet: Campus Floral & Gift Commerce Platform",
    clientName: "EcoBouquet Retail Group",
    year: "2024",
    role: "Lead Full-Stack Developer",
    summary:
      "High-converting boutique floral and gift marketplace engineered with real-time stock allocation, dynamic calendar delivery scheduling, and QRIS payments.",
    image:
      "https://res.cloudinary.com/dhaonb1vn/image/upload/v1787456333/Gemini_Generated_Image_u4rdl5u4rdl5u4rd_gzminr.jpg",
    liveUrl: "https://ecobouquet.store",
    repoUrl: "https://github.com/ryzmdn/ecobouquet",
    metrics: {
      "Processed Orders": "3,200+",
      "Checkout Conversion": "18.4%",
      "Payment Settlement": "< 3s",
      "Catalog Items": "180+",
    },
    techStack: [
      "Next.js App Router",
      "Supabase",
      "Drizzle ORM",
      "Tailwind CSS",
      "Midtrans Payment",
      "Zustand",
    ],
    contentMd: `## Executive Overview

EcoBouquet addresses high-volume graduation and seasonal floral demand across university campuses. The platform supports instant booking, customized greeting cards, and automatic order routing to local florists.

### Key Engineering Wins
* **Atomic Stock Reservation**: Redis-backed transactional locking to prevent double-booking of scarce seasonal bouquets during graduation spikes.
* **Frictionless QRIS & VA Checkout**: Webhook integration with Midtrans providing instantaneous payment status reconciliation without page refresh.`,
  },
  {
    id: 5,
    slug: "remeflow-business-process-automation",
    category: "Full-Cycle Web & Platform Engineering",
    title: "RemeFlow: Business Process Automation & Modern Web Engine",
    clientName: "RemeFlow Technology",
    year: "2023",
    role: "Principal Software Engineer",
    summary:
      "Event-driven workflow automation hub connecting disparate SaaS endpoints, webhooks, and relational data stores with visual orchestration pipelines.",
    image:
      "https://res.cloudinary.com/dhaonb1vn/image/upload/v1787456331/Gemini_Generated_Image_vxw5sovxw5sovxw5_dgngrr.jpg",
    liveUrl: "https://remeflow.io",
    repoUrl: "https://github.com/ryzmdn/remeflow",
    metrics: {
      "Manual Tasks Automated": "82%",
      "Throughput Rate": "2,800 evt/s",
      "Monthly Events": "1.4M+",
      "API Reliability": "99.99%",
    },
    techStack: [
      "TypeScript",
      "Node.js",
      "Redis",
      "BullMQ",
      "PostgreSQL",
      "Next.js 16",
    ],
    contentMd: `## Executive Overview

RemeFlow was designed to replace costly third-party Zapier/Make subscriptions with an in-house, low-latency workflow orchestrator tailored to regional enterprise regulatory frameworks.

### Architecture Highlights
* **Queue-Driven Ingestion**: BullMQ job queues paired with Redis clusters to handle webhook bursts with guaranteed at-least-once execution.
* **Idempotent Webhook Handler**: Cryptographic request verification and deduplication eliminating phantom executions.`,
  },
  {
    id: 6,
    slug: "pictaip-generative-ai-suite",
    category: "Generative AI & Multimedia Synthesis",
    title: "PictaIP: Prompt-Driven AI Image & Video Creation Suite",
    clientName: "Creative AI Labs",
    year: "2023",
    role: "Full-Stack AI Application Engineer",
    summary:
      "A creative studio interface integrating state-of-the-art diffusion models, prompt enhancers, canvas inpainting, and real-time generation queues.",
    image:
      "https://res.cloudinary.com/dhaonb1vn/image/upload/v1787456336/Gemini_Generated_Image_ar2uurar2uurar2u_byubn2.jpg",
    liveUrl: "https://pictaip.ai",
    repoUrl: "https://github.com/ryzmdn/pictaip",
    metrics: {
      "Avg Generation Time": "1.8s",
      "Active Digital Creators": "9,200+",
      "Images Synthesized": "140K+",
      "Satisfaction Rate": "96%",
    },
    techStack: [
      "Next.js App Router",
      "Python / FastAPI",
      "WebSockets",
      "Cloudinary CDN",
      "Tailwind CSS",
      "Stripe",
    ],
    contentMd: `## Executive Overview

PictaIP democratizes generative AI media workflows for regional graphic designers and creative agencies. The browser studio features live preview streaming, history versioning, and high-resolution export pipelines.

### Engineering Highlights
* **Real-time Progress Streaming**: WebSocket communication delivering iterative denoising steps and prompt progress feedback directly to the client canvas.
* **Smart Asset Storage**: Automated compression and CDN routing through Cloudinary, ensuring zero egress bottleneck on heavy generation days.`,
  },
]

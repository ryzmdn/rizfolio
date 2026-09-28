import type { Metadata } from "next"

export const SEO_CONFIG = {
  author: {
    name: "Rizky Ramadhan",
    url: "https://ryzmdn.me",
    role: "Senior Full-Stack Engineer & Systems Architect",
    avatar:
      "https://res.cloudinary.com/dhaonb1vn/image/upload/v1783196888/WhatsApp_Image_2026-07-05_at_03.27.41_hz9vld.jpg",
    email: "rizkyramadhanpd@gmail.com",
    social: {
      github: "https://github.com/ryzmdn",
      linkedin: "https://linkedin.com/in/ryzmdn",
      twitter: "https://twitter.com/ryzmdn",
      behance: "https://behance.net/ryzmdn",
      dribbble: "https://dribbble.com/ryzmdn",
    },
  },
  sites: {
    main: {
      name: "Rizky Ramadhan",
      defaultTitle: "Rizky Ramadhan — Senior Full-Stack Engineer & Systems Architect",
      titleTemplate: "%s | Rizky Ramadhan",
      description:
        "Senior Full-Stack Engineer & Systems Architect specializing in deterministic software systems, Next.js monorepos, and high-performance digital experiences.",
      url: process.env.NEXT_PUBLIC_APP_URL || "https://ryzmdn.me",
      keywords: [
        "Rizky Ramadhan",
        "Full-Stack Engineer",
        "Systems Architect",
        "Next.js",
        "React 19",
        "Turborepo",
        "TypeScript",
        "PostgreSQL",
        "Drizzle ORM",
        "Design Systems",
        "Tailwind CSS v4",
      ],
    },
    portfolio: {
      name: "Rizfolio Portfolio",
      defaultTitle: "Rizky Ramadhan — Senior Full-Stack Engineer & Systems Architect",
      titleTemplate: "%s | Rizky Ramadhan",
      description:
        "Showcasing high-impact full-stack applications, resilient backend architectures, enterprise design systems, and client delivery case studies.",
      url:
        process.env.NEXT_PUBLIC_PORTFOLIO_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        "https://portfolio.ryzmdn.me",
      keywords: [
        "Rizky Ramadhan Portfolio",
        "Full-Stack Engineer",
        "Systems Architecture",
        "Product Engineering",
        "Web Performance",
        "Next.js Architecture",
        "Case Studies",
      ],
    },
    blog: {
      name: "Rizfolio Engineering Blog",
      defaultTitle: "Engineering Blog & Architectural Notes | Rizky Ramadhan",
      titleTemplate: "%s | Rizky Ramadhan",
      description:
        "In-depth articles, systems architecture perspectives, and technical notes on full-stack web engineering, monorepos, and database resilience.",
      url:
        process.env.NEXT_PUBLIC_BLOG_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        "https://blog.ryzmdn.me",
      keywords: [
        "Software Architecture Blog",
        "Systems Design",
        "Monorepo Architecture",
        "Next.js 16",
        "React 19 Server Components",
        "Turborepo Best Practices",
        "Database Resilience",
        "Web Performance",
      ],
    },
    shop: {
      name: "Rizfolio Store",
      defaultTitle: "Digital Tools & Engineering Starter Kits | Rizfolio Store",
      titleTemplate: "%s | Rizfolio Store",
      description:
        "Production-tested monorepo architectures, Next.js 16 starter kits, Tailwind v4 UI systems, and 1-on-1 senior architecture consultations.",
      url:
        process.env.NEXT_PUBLIC_SHOP_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        "https://shop.ryzmdn.me",
      keywords: [
        "Next.js Starter Kit",
        "Turborepo Architecture",
        "Tailwind CSS v4 Design System",
        "Full-Stack Consultation",
        "Software Engineering Boilerplate",
        "Drizzle ORM Setup",
      ],
    },
    docs: {
      name: "Rizfolio Docs & Code Explorer",
      defaultTitle: "Documentation & Code Explorer — Rizky Ramadhan",
      titleTemplate: "%s | Rizfolio Docs",
      description:
        "Interactive technical documentation, open-source repositories, academic coursework archive, and source code explorer.",
      url:
        process.env.NEXT_PUBLIC_DOCS_URL ||
        process.env.NEXT_PUBLIC_ARCHIVE_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        "https://docs.ryzmdn.me",
      keywords: [
        "Technical Documentation",
        "Code Explorer",
        "Source Code Architecture",
        "Algorithms",
        "Open Source Repositories",
        "Go",
        "TypeScript",
        "Coursework Archive",
      ],
    },
    changelog: {
      name: "Rizfolio Changelog",
      defaultTitle: "Changelog & Dev Log | Rizky Ramadhan",
      titleTemplate: "%s | Rizfolio Changelog",
      description:
        "Continuous timeline of architectural milestones, feature additions, performance tunings, and version releases across the Rizfolio ecosystem.",
      url:
        process.env.NEXT_PUBLIC_CHANGELOG_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        "https://changelog.ryzmdn.me",
      keywords: [
        "Monorepo Changelog",
        "Release Notes",
        "Engineering Dev Log",
        "Architecture Milestones",
        "Product Roadmap",
      ],
    },
    linkbio: {
      name: "Rizky Ramadhan Links",
      defaultTitle: "Rizky Ramadhan — Links, Profiles & Connect",
      titleTemplate: "%s | Rizky Ramadhan",
      description:
        "Official directory of verified portfolio projects, engineering writings, digital tools, and social touchpoints by Rizky Ramadhan.",
      url:
        process.env.NEXT_PUBLIC_LINKBIO_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        "https://links.ryzmdn.me",
      keywords: [
        "Rizky Ramadhan Links",
        "Developer Profiles",
        "Engineering Directory",
        "Digital Touchpoints",
        "GitHub ryzmdn",
        "LinkedIn ryzmdn",
      ],
    },
    cms: {
      name: "Rizfolio Mission Control",
      defaultTitle: "Rizfolio Mission Control | Executive CMS",
      titleTemplate: "%s | Rizfolio CMS",
      description:
        "Internal administrative dashboard and management portal for the Rizfolio monorepo.",
      url:
        process.env.NEXT_PUBLIC_CMS_URL ||
        "https://cms.ryzmdn.me",
      keywords: [],
    },
  },
} as const

export type AppSiteKey = keyof typeof SEO_CONFIG.sites

export function getBaseUrl(siteKey: AppSiteKey): string {
  const site = SEO_CONFIG.sites[siteKey]
  return site.url.replace(/\/$/, "")
}

export function getCanonicalUrl(siteKey: AppSiteKey, path: string = ""): string {
  const base = getBaseUrl(siteKey)
  const cleanPath = path ? (path.startsWith("/") ? path : `/${path}`) : ""
  return `${base}${cleanPath}`
}

export function createPersonJsonLd() {
  const { author } = SEO_CONFIG
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${author.url}/#person`,
    name: author.name,
    jobTitle: author.role,
    url: author.url,
    image: author.avatar,
    email: `mailto:${author.email}`,
    sameAs: [
      author.social.github,
      author.social.linkedin,
      author.social.twitter,
      author.social.behance,
      author.social.dribbble,
    ],
  }
}

export function createWebSiteJsonLd({
  siteKey,
  name,
  description,
  url,
  searchUrlTemplate,
}: {
  siteKey?: AppSiteKey
  name?: string
  description?: string
  url?: string
  searchUrlTemplate?: string
}) {
  const resolvedUrl = url || (siteKey ? getBaseUrl(siteKey) : SEO_CONFIG.sites.main.url)
  const resolvedName = name || (siteKey ? SEO_CONFIG.sites[siteKey].name : SEO_CONFIG.sites.main.name)
  const resolvedDesc = description || (siteKey ? SEO_CONFIG.sites[siteKey].description : SEO_CONFIG.sites.main.description)

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${resolvedUrl}/#website`,
    name: resolvedName,
    url: resolvedUrl,
    description: resolvedDesc,
    publisher: {
      "@type": "Person",
      name: SEO_CONFIG.author.name,
      url: SEO_CONFIG.author.url,
    },
  }

  if (searchUrlTemplate) {
    schema.potentialAction = {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: searchUrlTemplate,
      },
      "query-input": "required name=search_term_string",
    }
  }

  return schema
}

export function createBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function createBlogPostJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  image,
  readingTimeMinutes,
}: {
  title: string
  description: string
  url: string
  datePublished?: string | null
  dateModified?: string | null
  image?: string | null
  readingTimeMinutes?: number | null
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    datePublished: datePublished ? new Date(datePublished).toISOString() : undefined,
    dateModified: dateModified
      ? new Date(dateModified).toISOString()
      : datePublished
        ? new Date(datePublished).toISOString()
        : undefined,
    image: image || SEO_CONFIG.author.avatar,
    author: {
      "@type": "Person",
      name: SEO_CONFIG.author.name,
      url: SEO_CONFIG.author.url,
    },
    publisher: {
      "@type": "Person",
      name: SEO_CONFIG.author.name,
      url: SEO_CONFIG.author.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(readingTimeMinutes ? { timeRequired: `PT${readingTimeMinutes}M` } : {}),
  }
}

export function createProductJsonLd({
  name,
  description,
  url,
  image,
  price,
  currency = "USD",
  rating,
  reviewCount,
}: {
  name: string
  description: string
  url: string
  image?: string | null
  price: number
  currency?: string
  rating?: number
  reviewCount?: number
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url,
    image: image || SEO_CONFIG.author.avatar,
    offers: {
      "@type": "Offer",
      price: price.toString(),
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      url,
      seller: {
        "@type": "Person",
        name: SEO_CONFIG.author.name,
        url: SEO_CONFIG.author.url,
      },
    },
  }

  if (rating && reviewCount && reviewCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount,
    }
  }

  return schema
}

export function createFaqJsonLd(items?: Array<{ question: string; answer: string }> | null) {
  const safeItems = Array.isArray(items) ? items : []
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: safeItems.map((item) => ({
      "@type": "Question",
      name: item?.question || "",
      acceptedAnswer: {
        "@type": "Answer",
        text: item?.answer || "",
      },
    })),
  }
}

export function createSoftwareSourceCodeJsonLd({
  name,
  description,
  url,
  programmingLanguage,
  codeRepository,
}: {
  name: string
  description: string
  url: string
  programmingLanguage?: string
  codeRepository?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name,
    description,
    codeRepository: codeRepository || url,
    url,
    author: {
      "@type": "Person",
      name: SEO_CONFIG.author.name,
      url: SEO_CONFIG.author.url,
    },
    ...(programmingLanguage ? { programmingLanguage } : {}),
  }
}

export function createProfilePageJsonLd({
  url,
  description,
}: {
  url?: string
  description?: string
}) {
  const siteUrl = url || getBaseUrl("linkbio")
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: createPersonJsonLd(),
    url: siteUrl,
    description: description || SEO_CONFIG.sites.linkbio.description,
  }
}

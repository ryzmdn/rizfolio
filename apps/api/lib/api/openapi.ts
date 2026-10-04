export interface EndpointParameter {
  name: string
  in: "query" | "path" | "header"
  required?: boolean
  description: string
  type: string
  example?: string | number | boolean
}

export interface EndpointDefinition {
  id: string
  tag:
    | "System"
    | "Auth"
    | "Portfolio"
    | "Blog"
    | "Shop"
    | "Archive"
    | "Changelog"
    | "Linkbio"
    | "CMS"
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  path: string
  summary: string
  description: string
  access: "Public" | "Rate-Limited" | "Owner / Auth" | "Webhook Signature"
  security?: ("BearerAuth" | "ApiKeyAuth" | "SessionCookie")[]
  parameters?: EndpointParameter[]
  requestBody?: {
    contentType: string
    sampleJson: string
  }
  responseSample: {
    status: number
    description: string
    sampleJson: string
  }
}

export const API_TAGS = [
  {
    name: "System",
    description: "Health checks, OpenAPI spec, and ISR revalidation",
  },
  {
    name: "Auth",
    description: "Owner authentication, session control, and credentials",
  },
  {
    name: "Portfolio",
    description: "Profile, career history, education, services, and inquiries",
  },
  {
    name: "Blog",
    description: "Articles, taxonomy tags/categories, views, and newsletter",
  },
  {
    name: "Shop",
    description: "Digital goods, orders, coupon validations, and downloads",
  },
  {
    name: "Archive",
    description: "Open-source repositories, file trees, releases, and stars",
  },
  {
    name: "Changelog",
    description: "Product releases, roadmaps, and community proposals",
  },
  {
    name: "Linkbio",
    description: "Bio links directory, reordering, and click telemetry",
  },
  {
    name: "CMS",
    description: "Control plane, audit transactions, media, and deep health",
  },
] as const

export const API_ENDPOINTS_CATALOG: EndpointDefinition[] = [
  // --- SYSTEM ---
  {
    id: "system-health",
    tag: "System",
    method: "GET",
    path: "/api/v1/health",
    summary: "System and database healthcheck",
    description:
      "Returns gateway operational status, current timestamp, environment mode, and database roundtrip latency.",
    access: "Public",
    responseSample: {
      status: 200,
      description: "Gateway operational metrics",
      sampleJson: JSON.stringify(
        {
          success: true,
          data: {
            status: "healthy",
            timestamp: "2026-10-04T12:00:00.000Z",
            version: "1.0.0",
            database: { status: "connected", latencyMs: 14 },
            uptime: 86400,
          },
        },
        null,
        2
      ),
    },
  },
  {
    id: "system-openapi",
    tag: "System",
    method: "GET",
    path: "/api/v1/openapi.json",
    summary: "Fetch OpenAPI 3.1 specification",
    description:
      "Returns the complete machine-readable OpenAPI 3.1 JSON document for client code generation.",
    access: "Public",
    responseSample: {
      status: 200,
      description: "OpenAPI 3.1 schema",
      sampleJson: JSON.stringify(
        {
          openapi: "3.1.0",
          info: {
            title: "Rizfolio Unified REST API Gateway",
            version: "1.0.0",
          },
        },
        null,
        2
      ),
    },
  },
  {
    id: "system-revalidate",
    tag: "System",
    method: "POST",
    path: "/api/v1/revalidate",
    summary: "Trigger on-demand ISR cache revalidation",
    description:
      "Purges Next.js cached tags or routes across the monorepo using the REVALIDATION_SECRET.",
    access: "Rate-Limited",
    requestBody: {
      contentType: "application/json",
      sampleJson: JSON.stringify(
        {
          secret: "rf_reval_live_secret",
          tag: "portfolio-profile",
          path: "/",
        },
        null,
        2
      ),
    },
    responseSample: {
      status: 200,
      description: "Revalidation dispatched",
      sampleJson: JSON.stringify(
        {
          success: true,
          data: {
            revalidated: true,
            tag: "portfolio-profile",
            timestamp: "2026-10-04T12:00:00.000Z",
          },
        },
        null,
        2
      ),
    },
  },

  // --- AUTH ---
  {
    id: "auth-login",
    tag: "Auth",
    method: "POST",
    path: "/api/v1/auth/login",
    summary: "Owner login and session issuance",
    description:
      "Authenticates owner credentials, generates a cryptographically signed JWT token, and sets an HttpOnly cookie.",
    access: "Rate-Limited",
    requestBody: {
      contentType: "application/json",
      sampleJson: JSON.stringify(
        {
          email: "rizkyramadhanpd@gmail.com",
          password: "SuperSecretPassword123!",
        },
        null,
        2
      ),
    },
    responseSample: {
      status: 200,
      description: "Session token and owner profile",
      sampleJson: JSON.stringify(
        {
          success: true,
          data: {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            user: {
              id: "usr_01",
              email: "rizkyramadhanpd@gmail.com",
              name: "Rizky Ramadhan",
              role: "owner",
            },
          },
        },
        null,
        2
      ),
    },
  },
  {
    id: "auth-logout",
    tag: "Auth",
    method: "POST",
    path: "/api/v1/auth/logout",
    summary: "Terminate active session",
    description:
      "Clears the authentication cookie and revokes the active session token.",
    access: "Public",
    responseSample: {
      status: 200,
      description: "Session invalidated",
      sampleJson: JSON.stringify(
        { success: true, data: { message: "Successfully logged out" } },
        null,
        2
      ),
    },
  },
  {
    id: "auth-me",
    tag: "Auth",
    method: "GET",
    path: "/api/v1/auth/me",
    summary: "Retrieve authenticated profile",
    description:
      "Returns profile and role metadata for the current Bearer token or API key holder.",
    access: "Owner / Auth",
    security: ["BearerAuth", "ApiKeyAuth"],
    responseSample: {
      status: 200,
      description: "Authenticated owner profile",
      sampleJson: JSON.stringify(
        {
          success: true,
          data: {
            user: {
              id: "usr_01",
              email: "rizkyramadhanpd@gmail.com",
              name: "Rizky Ramadhan",
              role: "owner",
            },
          },
        },
        null,
        2
      ),
    },
  },
  {
    id: "auth-change-password",
    tag: "Auth",
    method: "POST",
    path: "/api/v1/auth/change-password",
    summary: "Change account password",
    description:
      "Updates the owner account password with Argon2/bcrypt verification.",
    access: "Owner / Auth",
    security: ["BearerAuth"],
    requestBody: {
      contentType: "application/json",
      sampleJson: JSON.stringify(
        {
          currentPassword: "OldPassword123!",
          newPassword: "NewStrongPassword456!",
          confirmNewPassword: "NewStrongPassword456!",
        },
        null,
        2
      ),
    },
    responseSample: {
      status: 200,
      description: "Password updated successfully",
      sampleJson: JSON.stringify(
        { success: true, data: { message: "Password updated successfully" } },
        null,
        2
      ),
    },
  },

  // --- PORTFOLIO ---
  {
    id: "portfolio-profile-get",
    tag: "Portfolio",
    method: "GET",
    path: "/api/v1/portfolio/profile",
    summary: "Fetch portfolio owner profile",
    description:
      "Returns biography, contact coordinates, social handles, and availability status.",
    access: "Public",
    responseSample: {
      status: 200,
      description: "Profile object",
      sampleJson: JSON.stringify(
        {
          success: true,
          data: {
            name: "Rizky Ramadhan",
            headline: "Senior Full-Stack Engineer & Systems Architect",
            bio: "Specializing in deterministic software systems, Next.js monorepos, and high-performance digital experiences.",
            location: "Bandung, Indonesia",
            email: "rizkyramadhanpd@gmail.com",
            isAvailableForHire: true,
          },
        },
        null,
        2
      ),
    },
  },
  {
    id: "portfolio-profile-put",
    tag: "Portfolio",
    method: "PUT",
    path: "/api/v1/portfolio/profile",
    summary: "Update portfolio profile",
    description: "Updates owner headline, bio, location, and social links.",
    access: "Owner / Auth",
    security: ["BearerAuth", "ApiKeyAuth"],
    requestBody: {
      contentType: "application/json",
      sampleJson: JSON.stringify(
        {
          name: "Rizky Ramadhan",
          headline: "Senior Full-Stack Engineer & Systems Architect",
          location: "Bandung, Indonesia",
          isAvailableForHire: true,
        },
        null,
        2
      ),
    },
    responseSample: {
      status: 200,
      description: "Profile updated",
      sampleJson: JSON.stringify(
        { success: true, data: { updated: true } },
        null,
        2
      ),
    },
  },
  {
    id: "portfolio-experiences-get",
    tag: "Portfolio",
    method: "GET",
    path: "/api/v1/portfolio/experiences",
    summary: "List career experiences",
    description:
      "Returns career milestones, roles, achievements, and technology stacks.",
    access: "Public",
    responseSample: {
      status: 200,
      description: "List of experiences",
      sampleJson: JSON.stringify(
        {
          success: true,
          data: [
            {
              id: "exp_01",
              company: "Enterprise Cloud Tech",
              role: "Lead Systems Architect",
              startDate: "2024-01-01",
              current: true,
              skills: ["Next.js", "TypeScript", "PostgreSQL", "Turborepo"],
            },
          ],
        },
        null,
        2
      ),
    },
  },
  {
    id: "portfolio-experiences-post",
    tag: "Portfolio",
    method: "POST",
    path: "/api/v1/portfolio/experiences",
    summary: "Create career experience",
    description: "Adds a new career position to the timeline.",
    access: "Owner / Auth",
    security: ["BearerAuth", "ApiKeyAuth"],
    requestBody: {
      contentType: "application/json",
      sampleJson: JSON.stringify(
        {
          company: "Tech Dynamics",
          role: "Senior Full-Stack Engineer",
          startDate: "2024-06-01",
          description:
            "Architected distributed web application and reduced API p99 latency by 45%.",
          skills: ["Go", "React", "PostgreSQL"],
        },
        null,
        2
      ),
    },
    responseSample: {
      status: 201,
      description: "Created experience record",
      sampleJson: JSON.stringify(
        { success: true, data: { id: "exp_02" } },
        null,
        2
      ),
    },
  },
  {
    id: "portfolio-inquiries-post",
    tag: "Portfolio",
    method: "POST",
    path: "/api/v1/portfolio/inquiries",
    summary: "Submit public contact inquiry",
    description:
      "Sends a project proposal or inquiry with honeypot anti-bot verification and rate limiting.",
    access: "Rate-Limited",
    requestBody: {
      contentType: "application/json",
      sampleJson: JSON.stringify(
        {
          name: "Jane Doe",
          email: "jane@example.com",
          subject: "Senior Architecture Consultation",
          message:
            "We would like to discuss building an enterprise Next.js monorepo.",
          honeypot: "",
        },
        null,
        2
      ),
    },
    responseSample: {
      status: 201,
      description: "Inquiry received",
      sampleJson: JSON.stringify(
        { success: true, data: { message: "Inquiry received. Thank you!" } },
        null,
        2
      ),
    },
  },

  // --- BLOG ---
  {
    id: "blog-posts-get",
    tag: "Blog",
    method: "GET",
    path: "/api/v1/blog/posts",
    summary: "List blog articles",
    description:
      "Fetches published blog articles with support for pagination, search, category, and tag filters.",
    access: "Public",
    parameters: [
      {
        name: "page",
        in: "query",
        description: "Page number (defaults to 1)",
        type: "integer",
        example: 1,
      },
      {
        name: "limit",
        in: "query",
        description: "Items per page (max 100)",
        type: "integer",
        example: 10,
      },
      {
        name: "search",
        in: "query",
        description: "Search query across title and excerpt",
        type: "string",
      },
      {
        name: "tag",
        in: "query",
        description: "Filter by tag slug",
        type: "string",
      },
    ],
    responseSample: {
      status: 200,
      description: "Paginated articles list",
      sampleJson: JSON.stringify(
        {
          success: true,
          data: [
            {
              id: "post_01",
              title:
                "Architecting Resilient Monorepos with Next.js 16 and Turborepo",
              slug: "architecting-resilient-monorepos-nextjs-16",
              excerpt:
                "A deep dive into cross-package boundary enforcement and zero-latency caching.",
              publishedAt: "2026-10-01T00:00:00.000Z",
              readingTimeMinutes: 8,
            },
          ],
          meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
        },
        null,
        2
      ),
    },
  },
  {
    id: "blog-post-detail",
    tag: "Blog",
    method: "GET",
    path: "/api/v1/blog/posts/{slug}",
    summary: "Get article detail by slug",
    description:
      "Fetches full markdown/MDX content, author, categories, and view/reaction counts.",
    access: "Public",
    parameters: [
      {
        name: "slug",
        in: "path",
        required: true,
        description: "Article URL slug",
        type: "string",
        example: "architecting-resilient-monorepos-nextjs-16",
      },
    ],
    responseSample: {
      status: 200,
      description: "Full post object",
      sampleJson: JSON.stringify(
        {
          success: true,
          data: {
            id: "post_01",
            slug: "architecting-resilient-monorepos-nextjs-16",
            title:
              "Architecting Resilient Monorepos with Next.js 16 and Turborepo",
            content: "# Systems Architecture...",
            viewsCount: 1420,
            reactions: { like: 140, clap: 85 },
          },
        },
        null,
        2
      ),
    },
  },
  {
    id: "blog-post-reaction",
    tag: "Blog",
    method: "POST",
    path: "/api/v1/blog/posts/{slug}/reaction",
    summary: "Submit reaction to an article",
    description:
      "Increments article reactions (LIKE, LOVE, CLAP, ROCKET) with rate limiting.",
    access: "Rate-Limited",
    parameters: [
      {
        name: "slug",
        in: "path",
        required: true,
        description: "Article URL slug",
        type: "string",
      },
    ],
    requestBody: {
      contentType: "application/json",
      sampleJson: JSON.stringify({ type: "CLAP" }, null, 2),
    },
    responseSample: {
      status: 200,
      description: "Updated reaction count",
      sampleJson: JSON.stringify(
        { success: true, data: { slug: "post-slug", type: "CLAP", count: 86 } },
        null,
        2
      ),
    },
  },
  {
    id: "blog-newsletter-subscribe",
    tag: "Blog",
    method: "POST",
    path: "/api/v1/blog/newsletter/subscribe",
    summary: "Subscribe to engineering newsletter",
    description:
      "Registers an email address for architecture dispatch updates with anti-bot validation.",
    access: "Rate-Limited",
    requestBody: {
      contentType: "application/json",
      sampleJson: JSON.stringify(
        { email: "subscriber@example.com", honeypot: "" },
        null,
        2
      ),
    },
    responseSample: {
      status: 200,
      description: "Subscription registered",
      sampleJson: JSON.stringify(
        { success: true, data: { message: "Subscribed successfully" } },
        null,
        2
      ),
    },
  },

  // --- SHOP ---
  {
    id: "shop-products-get",
    tag: "Shop",
    method: "GET",
    path: "/api/v1/shop/products",
    summary: "List digital products and starter kits",
    description:
      "Returns available digital architectures, boilerplates, and consultation services.",
    access: "Public",
    parameters: [
      {
        name: "type",
        in: "query",
        description: "Filter: DIGITAL or SERVICE",
        type: "string",
        example: "DIGITAL",
      },
    ],
    responseSample: {
      status: 200,
      description: "Products list",
      sampleJson: JSON.stringify(
        {
          success: true,
          data: [
            {
              id: "prod_01",
              title: "Production Next.js 16 Monorepo Starter Kit",
              slug: "nextjs-16-monorepo-starter",
              price: 7900,
              currency: "USD",
              type: "DIGITAL",
            },
          ],
        },
        null,
        2
      ),
    },
  },
  {
    id: "shop-orders-post",
    tag: "Shop",
    method: "POST",
    path: "/api/v1/shop/orders",
    summary: "Create digital commerce order",
    description:
      "Initiates purchase checkout, validates optional promo coupon, and generates Stripe checkout session.",
    access: "Rate-Limited",
    requestBody: {
      contentType: "application/json",
      sampleJson: JSON.stringify(
        {
          items: [{ productId: "prod_01", quantity: 1 }],
          customerEmail: "customer@example.com",
          customerName: "Alex Mercer",
          couponCode: "LAUNCH20",
        },
        null,
        2
      ),
    },
    responseSample: {
      status: 201,
      description: "Order created",
      sampleJson: JSON.stringify(
        {
          success: true,
          data: {
            orderNumber: "ORD-2026-8941",
            totalAmount: 6320,
            currency: "USD",
            status: "PENDING",
          },
        },
        null,
        2
      ),
    },
  },
  {
    id: "shop-coupons-validate",
    tag: "Shop",
    method: "POST",
    path: "/api/v1/shop/coupons/validate",
    summary: "Validate promo coupon code",
    description:
      "Verifies coupon validity, expiration date, and calculates applicable percentage or fixed discount.",
    access: "Public",
    requestBody: {
      contentType: "application/json",
      sampleJson: JSON.stringify({ code: "LAUNCH20", subtotal: 7900 }, null, 2),
    },
    responseSample: {
      status: 200,
      description: "Discount calculation",
      sampleJson: JSON.stringify(
        {
          success: true,
          data: {
            valid: true,
            discountAmount: 1580,
            finalAmount: 6320,
            code: "LAUNCH20",
          },
        },
        null,
        2
      ),
    },
  },
  {
    id: "shop-downloads-get",
    tag: "Shop",
    method: "GET",
    path: "/api/v1/shop/downloads/{token}",
    summary: "Get signed digital download URL",
    description:
      "Verifies one-time or time-bound download token and redirects to secure signed asset.",
    access: "Public",
    parameters: [
      {
        name: "token",
        in: "path",
        required: true,
        description: "Secure download token",
        type: "string",
      },
    ],
    responseSample: {
      status: 200,
      description: "Signed download URL",
      sampleJson: JSON.stringify(
        {
          success: true,
          data: {
            downloadUrl:
              "https://storage.ryzmdn.me/downloads/bundle.zip?token=...",
            expiresAt: "2026-10-04T13:00:00.000Z",
          },
        },
        null,
        2
      ),
    },
  },

  // --- ARCHIVE ---
  {
    id: "archive-repos-get",
    tag: "Archive",
    method: "GET",
    path: "/api/v1/archive/repositories",
    summary: "List open-source and experiment repositories",
    description:
      "Returns archived repositories with programming languages, stars, and tags.",
    access: "Public",
    responseSample: {
      status: 200,
      description: "Repositories array",
      sampleJson: JSON.stringify(
        {
          success: true,
          data: [
            {
              id: "repo_01",
              slug: "go-distributed-kv",
              title: "Raft Consensus Key-Value Store",
              language: "Go",
              starsCount: 84,
              isFeatured: true,
            },
          ],
        },
        null,
        2
      ),
    },
  },
  {
    id: "archive-repo-star",
    tag: "Archive",
    method: "POST",
    path: "/api/v1/archive/repositories/{slug}/star",
    summary: "Star/upvote a repository",
    description:
      "Increments star count with IP deduplication and rate limiting.",
    access: "Rate-Limited",
    parameters: [
      {
        name: "slug",
        in: "path",
        required: true,
        description: "Repository slug",
        type: "string",
        example: "go-distributed-kv",
      },
    ],
    responseSample: {
      status: 200,
      description: "Star recorded",
      sampleJson: JSON.stringify(
        { success: true, data: { slug: "go-distributed-kv", starsCount: 85 } },
        null,
        2
      ),
    },
  },

  // --- CHANGELOG ---
  {
    id: "changelog-releases-get",
    tag: "Changelog",
    method: "GET",
    path: "/api/v1/changelog/releases",
    summary: "List version changelogs and release notes",
    description:
      "Returns engineering dev log milestones, added features, bug fixes, and performance metrics.",
    access: "Public",
    responseSample: {
      status: 200,
      description: "Changelog releases array",
      sampleJson: JSON.stringify(
        {
          success: true,
          data: [
            {
              id: "rel_01",
              version: "v2.4.0",
              title: "Dual-Engine Architecture and Tailwind v4 Upgrade",
              releasedAt: "2026-10-01",
              items: [
                {
                  category: "FEATURE",
                  description: "Unified REST API gateway implementation",
                },
                {
                  category: "PERF",
                  description: "Sub-50ms cold start optimization",
                },
              ],
            },
          ],
        },
        null,
        2
      ),
    },
  },
  {
    id: "changelog-proposals-post",
    tag: "Changelog",
    method: "POST",
    path: "/api/v1/changelog/proposals",
    summary: "Submit community feature proposal",
    description:
      "Allows the engineering community to submit ideas and vote on roadmap items.",
    access: "Rate-Limited",
    requestBody: {
      contentType: "application/json",
      sampleJson: JSON.stringify(
        {
          title: "GraphQL Gateway Support",
          description: "Add optional GraphQL endpoint alongside REST API.",
          category: "ARCHITECTURE",
        },
        null,
        2
      ),
    },
    responseSample: {
      status: 201,
      description: "Proposal submitted",
      sampleJson: JSON.stringify(
        { success: true, data: { id: "prop_01", status: "SUBMITTED" } },
        null,
        2
      ),
    },
  },

  // --- LINKBIO ---
  {
    id: "linkbio-links-get",
    tag: "Linkbio",
    method: "GET",
    path: "/api/v1/linkbio/links",
    summary: "List active bio links",
    description:
      "Returns organized social links, portfolio showcases, and media links with click telemetry.",
    access: "Public",
    responseSample: {
      status: 200,
      description: "Active links array",
      sampleJson: JSON.stringify(
        {
          success: true,
          data: [
            {
              id: "lnk_01",
              title: "GitHub Profile",
              url: "https://github.com/ryzmdn",
              icon: "github",
              clicks: 312,
            },
            {
              id: "lnk_02",
              title: "Engineering Blog",
              url: "https://blog.ryzmdn.me",
              icon: "book",
              clicks: 580,
            },
          ],
        },
        null,
        2
      ),
    },
  },
  {
    id: "linkbio-click-post",
    tag: "Linkbio",
    method: "POST",
    path: "/api/v1/linkbio/links/{id}/click",
    summary: "Record bio link click",
    description: "Asynchronously increments link click metrics.",
    access: "Public",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        description: "Link unique identifier",
        type: "string",
      },
    ],
    responseSample: {
      status: 200,
      description: "Click counted",
      sampleJson: JSON.stringify(
        { success: true, data: { recorded: true } },
        null,
        2
      ),
    },
  },

  // --- CMS ---
  {
    id: "cms-overview-get",
    tag: "CMS",
    method: "GET",
    path: "/api/v1/cms/overview",
    summary: "Aggregate ecosystem metrics",
    description:
      "Returns high-level statistics across all 9 monorepo domains including inquiries, orders, views, and system status.",
    access: "Owner / Auth",
    security: ["BearerAuth", "ApiKeyAuth"],
    responseSample: {
      status: 200,
      description: "Aggregated metrics",
      sampleJson: JSON.stringify(
        {
          success: true,
          data: {
            articlesCount: 42,
            productsCount: 8,
            ordersCount: 154,
            inquiriesCount: 29,
            repositoriesCount: 16,
            totalRevenueCents: 1245000,
          },
        },
        null,
        2
      ),
    },
  },
  {
    id: "cms-transactions-get",
    tag: "CMS",
    method: "GET",
    path: "/api/v1/cms/transactions",
    summary: "Query master transactions audit ledger",
    description:
      "Inspects full audit logs with filtering by domain, action type, status, and date range.",
    access: "Owner / Auth",
    security: ["BearerAuth", "ApiKeyAuth"],
    parameters: [
      {
        name: "domain",
        in: "query",
        description: "Filter: PORTFOLIO, BLOG, SHOP, etc.",
        type: "string",
      },
      {
        name: "status",
        in: "query",
        description: "Filter: SUCCESS or FAILED",
        type: "string",
      },
    ],
    responseSample: {
      status: 200,
      description: "Audit ledger records",
      sampleJson: JSON.stringify(
        {
          success: true,
          data: [
            {
              id: "tx_01",
              domain: "SHOP",
              action: "ORDER_CREATED",
              status: "SUCCESS",
              ipAddress: "127.0.0.1",
              createdAt: "2026-10-04T11:45:00.000Z",
            },
          ],
        },
        null,
        2
      ),
    },
  },
  {
    id: "cms-system-health-get",
    tag: "CMS",
    method: "GET",
    path: "/api/v1/cms/system-health",
    summary: "Deep system diagnostics",
    description:
      "Returns low-level metrics including DB connection pool status, memory usage, and Supabase Storage bucket connectivity.",
    access: "Owner / Auth",
    security: ["BearerAuth", "ApiKeyAuth"],
    responseSample: {
      status: 200,
      description: "Deep health diagnostics",
      sampleJson: JSON.stringify(
        {
          success: true,
          data: {
            database: { connected: true, latencyMs: 12, poolSize: 5 },
            storage: { bucket: "rizfolio-media", reachable: true },
            memory: { heapUsedMb: 64, heapTotalMb: 128 },
          },
        },
        null,
        2
      ),
    },
  },
]

export function generateOpenApiSpec() {
  const paths: Record<string, Record<string, unknown>> = {}

  for (const ep of API_ENDPOINTS_CATALOG) {
    if (!paths[ep.path]) {
      paths[ep.path] = {}
    }

    const methodLower = ep.method.toLowerCase()
    const op: Record<string, unknown> = {
      tags: [ep.tag],
      summary: ep.summary,
      description: ep.description,
      responses: {
        [ep.responseSample.status]: {
          description: ep.responseSample.description,
          content: {
            "application/json": {
              example: JSON.parse(ep.responseSample.sampleJson),
            },
          },
        },
      },
    }

    if (ep.security && ep.security.length > 0) {
      op.security = ep.security.map((sec) => ({ [sec]: [] }))
    }

    if (ep.parameters && ep.parameters.length > 0) {
      op.parameters = ep.parameters.map((p) => ({
        name: p.name,
        in: p.in,
        required: p.required || p.in === "path",
        description: p.description,
        schema: { type: p.type },
        example: p.example,
      }))
    }

    if (ep.requestBody) {
      op.requestBody = {
        required: true,
        content: {
          [ep.requestBody.contentType]: {
            example: JSON.parse(ep.requestBody.sampleJson),
          },
        },
      }
    }

    const pathItem = paths[ep.path] ?? (paths[ep.path] = {})
    pathItem[methodLower] = op
  }

  return {
    openapi: "3.1.0",
    info: {
      title: "Rizfolio Unified REST API Gateway",
      version: "1.0.0",
      description:
        "High-performance, secure REST API servicing Portfolio, Blog, Shop, Changelog, Docs/Archive, Linkbio, and CMS Administration for the Rizfolio ecosystem.",
      contact: {
        name: "Rizky Ramadhan",
        url: "https://ryzmdn.me",
        email: "rizkyramadhanpd@gmail.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3007",
        description: "Active Gateway Server",
      },
      {
        url: "https://api.ryzmdn.me",
        description: "Production Gateway",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Owner JWT Session Token",
        },
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "X-API-Key",
          description: "Machine-to-Machine Secret Master API Key",
        },
        SessionCookie: {
          type: "apiKey",
          in: "cookie",
          name: "rizfolio_cms_session",
          description: "HttpOnly CMS administrator session cookie",
        },
      },
    },
    tags: API_TAGS,
    paths,
  }
}

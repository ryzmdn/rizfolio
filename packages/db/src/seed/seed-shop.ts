import { db, products, productFiles, orders, orderItems } from "../index"

export async function seedShop() {
  console.log("Seeding Shop Domain...")

  await db.delete(orderItems)
  await db.delete(orders)
  await db.delete(productFiles)
  await db.delete(products)

  const prodRows = await db
    .insert(products)
    .values([
      {
        slug: "turborepo-nextjs16-starter-kit",
        title: "Turborepo & Next.js 16 Enterprise Starter Kit",
        description:
          "Production-ready monorepo template featuring React 19, Tailwind CSS v4, Drizzle ORM, Supabase Auth, and pre-configured CI/CD pipelines for high-concurrency SaaS platforms.",
        price: 249000,
        currency: "IDR",
        productType: "DIGITAL_DOWNLOAD",
        coverImageUrl:
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
        galleryUrls: [
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
        ],
        stock: 999,
        isActive: true,
      },
      {
        slug: "tailwind-v4-component-system",
        title: "Tailwind CSS v4 & OKLCH Enterprise UI Kit",
        description:
          "A zero-runtime accessible design system component library with 60+ modular components, dark/light theme switching, and fluid typography tokens.",
        price: 199000,
        currency: "IDR",
        productType: "DIGITAL_DOWNLOAD",
        coverImageUrl:
          "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
        galleryUrls: [
          "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
        ],
        stock: 999,
        isActive: true,
      },
      {
        slug: "drizzle-supabase-boilerplate",
        title: "Drizzle ORM & Supabase Transaction Pooler Boilerplate",
        description:
          "Deterministic data access layer with type-safe schema definitions, automated migrations via Drizzle Kit, and high-throughput connection pooling handlers.",
        price: 149000,
        currency: "IDR",
        productType: "DIGITAL_DOWNLOAD",
        coverImageUrl:
          "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop",
        galleryUrls: [
          "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop",
        ],
        stock: 999,
        isActive: true,
      },
      {
        slug: "fullstack-architecture-consultation",
        title: "1-on-1 Full-Stack Architecture & Code Review Session",
        description:
          "A focused 60-minute technical consultation reviewing your system architecture, database modeling, query optimization, and frontend performance bottlenecks.",
        price: 750000,
        currency: "IDR",
        productType: "SERVICE",
        coverImageUrl:
          "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop",
        galleryUrls: [
          "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop",
        ],
        stock: 5,
        isActive: true,
      },
    ])
    .returning()

  const p1 = prodRows[0]
  const p2 = prodRows[1]
  const p3 = prodRows[2]

  if (p1) {
    await db.insert(productFiles).values({
      productId: p1.id,
      fileName: "turborepo-enterprise-v1.0.0.zip",
      fileSizeBytes: 2457600,
      storagePath: "products/turborepo-enterprise-v1.0.0.zip",
    })
  }

  if (p2) {
    await db.insert(productFiles).values({
      productId: p2.id,
      fileName: "tailwind-v4-ui-kit.zip",
      fileSizeBytes: 1843200,
      storagePath: "products/tailwind-v4-ui-kit.zip",
    })
  }

  if (p3) {
    await db.insert(productFiles).values({
      productId: p3.id,
      fileName: "drizzle-supabase-kit.zip",
      fileSizeBytes: 1228800,
      storagePath: "products/drizzle-supabase-kit.zip",
    })
  }

  if (p1) {
    const orderRows = await db
      .insert(orders)
      .values({
        orderNumber: "ORD-2026-0001",
        customerName: "Alex Developer",
        customerEmail: "alex@example.com",
        totalAmount: 249000,
        currency: "IDR",
        status: "COMPLETED",
        paymentProvider: "MANUAL_BANK_TRANSFER",
        paymentRef: "TRX-MOCK-9921",
      })
      .returning()

    const order = orderRows[0]
    if (order) {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)

      await db.insert(orderItems).values({
        orderId: order.id,
        productId: p1.id,
        pricePaid: 249000,
        downloadToken: "sample-dev-token-turborepo-2026",
        tokenExpiresAt: expiresAt,
      })
    }
  }

  console.log("Shop Domain Seeded Successfully.")
}

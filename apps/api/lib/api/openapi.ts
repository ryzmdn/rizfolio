export function generateOpenApiSpec() {
  return {
    openapi: "3.1.0",
    info: {
      title: "Rizfolio Unified Monorepo REST API Gateway",
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
        url: "https://api.ryzmdn.me",
        description: "Production API Server",
      },
      {
        url: "http://localhost:3007",
        description: "Local Development Server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Admin or User JWT Session Token",
        },
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "X-API-Key",
          description: "Machine-to-Machine Secret API Key",
        },
        SessionCookie: {
          type: "apiKey",
          in: "cookie",
          name: "rizfolio_cms_session",
          description: "HttpOnly CMS administrator session cookie",
        },
      },
      schemas: {
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: { type: "object" },
            meta: {
              type: "object",
              properties: {
                timestamp: { type: "string", format: "date-time" },
                traceId: { type: "string" },
              },
            },
          },
        },
        ApiError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: {
              type: "object",
              properties: {
                code: { type: "string", example: "VALIDATION_ERROR" },
                message: { type: "string" },
                status: { type: "integer", example: 400 },
                details: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      field: { type: "string" },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
            meta: {
              type: "object",
              properties: {
                timestamp: { type: "string" },
                traceId: { type: "string" },
              },
            },
          },
        },
      },
    },
    tags: [
      { name: "System", description: "Healthchecks and revalidation" },
      { name: "Auth", description: "Authentication and session operations" },
      { name: "Portfolio", description: "Profile, career, education, and testimonials" },
      { name: "Blog", description: "Articles, reactions, views, and newsletter" },
      { name: "Shop", description: "Commerce, digital downloads, orders, and reviews" },
      { name: "Archive", description: "Open-source repositories, file trees, and releases" },
      { name: "Changelog", description: "Releases, roadmaps, and proposals" },
      { name: "Linkbio", description: "Bio links and click tracking" },
      { name: "CMS", description: "Control plane, media, settings, and transactions" },
    ],
  }
}

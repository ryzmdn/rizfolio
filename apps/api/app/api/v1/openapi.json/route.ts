import { NextResponse } from "next/server"
import { generateOpenApiSpec } from "@/lib/api/openapi"
import { getCorsHeaders } from "@/lib/security/cors"

export const dynamic = "force-static"

export async function GET(request: Request) {
  const spec = generateOpenApiSpec()
  const corsHeaders = getCorsHeaders(request)

  return NextResponse.json(spec, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      ...corsHeaders,
    },
  })
}

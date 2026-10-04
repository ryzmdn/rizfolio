import { NextResponse } from "next/server"
import type {
  ApiSuccessResponse,
  PaginationMeta,
  ApiResponseMeta,
} from "./types"

export function apiSuccess<T>(
  data: T,
  meta?: Partial<ApiResponseMeta>,
  status = 200,
  headers: Record<string, string> = {}
): NextResponse<ApiSuccessResponse<T>> {
  const traceId = meta?.traceId || crypto.randomUUID()
  const timestamp = meta?.timestamp || new Date().toISOString()

  const payload: ApiSuccessResponse<T> = {
    success: true,
    data,
    meta: {
      timestamp,
      traceId,
      ...meta,
    },
  }

  return NextResponse.json(payload, {
    status,
    headers: {
      "X-Request-Id": traceId,
      ...headers,
    },
  })
}

export function apiCreated<T>(
  data: T,
  meta?: Partial<ApiResponseMeta>,
  headers: Record<string, string> = {}
): NextResponse<ApiSuccessResponse<T>> {
  return apiSuccess(data, meta, 201, headers)
}

export function apiPaginated<T>(
  items: T[],
  pagination: PaginationMeta,
  meta?: Partial<ApiResponseMeta>,
  headers: Record<string, string> = {}
): NextResponse<ApiSuccessResponse<T[]>> {
  return apiSuccess(
    items,
    {
      ...meta,
      pagination,
    },
    200,
    headers
  )
}

export function apiNoContent(
  headers: Record<string, string> = {}
): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers,
  })
}

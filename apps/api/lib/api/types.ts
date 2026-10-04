export type UserRole = "OWNER" | "CUSTOMER" | "PUBLIC"

export type AuthMethod = "SESSION" | "API_KEY" | "ANONYMOUS"

export interface AuthenticatedUser {
  id: string
  email: string
  role: UserRole
  scopes?: string[]
}

export interface RequestSecurityContext {
  traceId: string
  clientIp: string
  userAgent: string
  authMethod: AuthMethod
  user?: AuthenticatedUser
}

export interface PaginationParams {
  page: number
  limit: number
  offset: number
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ApiResponseMeta {
  timestamp: string
  traceId: string
  durationMs?: number
  pagination?: PaginationMeta
  [key: string]: unknown
}

export interface ApiSuccessResponse<T> {
  success: true
  data: T
  meta: ApiResponseMeta
}

export interface ApiErrorDetail {
  field?: string
  message: string
  code?: string
}

export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: ApiErrorDetail[]
    status: number
  }
  meta: ApiResponseMeta
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

export type RouteHandlerContext = {
  params?: Promise<Record<string, string | string[] | undefined>>
}

export interface RouteSecurityOptions {
  requireAuth?: boolean
  requiredRole?: UserRole
  requiredScopes?: string[]
  rateLimitTier?: "PUBLIC_READ" | "PUBLIC_MUTATION" | "AUTH_SENSITIVE" | "ADMIN" | "NONE"
  auditDomain?: "COMMERCE" | "CONTENT" | "PORTFOLIO" | "CODE_DOCS" | "AUTH_SECURITY" | "SYSTEM"
  auditAction?: string
  entityType?: string
}

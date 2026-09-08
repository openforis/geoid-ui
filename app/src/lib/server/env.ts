import 'server-only'

function envInt(name: string, fallback: number): number {
  const raw = process.env[name]
  if (!raw) return fallback
  const parsed = parseInt(raw, 10)
  return Number.isNaN(parsed) ? fallback : parsed
}

export function getSubmissionConfig() {
  return {
    maxRequestBodySizeKb: envInt('MAX_REQUEST_BODY_SIZE_KB', 1024),
  }
}

export function getApiDocsUrl(): string | null {
  const baseUrl = process.env.GEOID_BASE_URL?.trim().replace(/\/$/, '')
  if (!baseUrl) return null
  return `${baseUrl}/docs`
}

export function getAccountManagementUrl(): string | null {
  const issuer = process.env.KEYCLOAK_ISSUER
  if (!issuer) return null

  const base = issuer.endsWith('/') ? issuer.slice(0, -1) : issuer
  const url = new URL(`${base}/account`)
  if (process.env.KEYCLOAK_CLIENT_ID) url.searchParams.set('referrer', process.env.KEYCLOAK_CLIENT_ID)
  if (process.env.HOST_URL) url.searchParams.set('referrer_uri', process.env.HOST_URL)
  return url.toString()
}

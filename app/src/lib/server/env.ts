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

import 'server-only'

import { cookies } from 'next/headers'
import { Env, type EnvOverrides } from '@/lib/env'

function envInt(name: string, fallback: number): number {
  const raw = process.env[name]
  if (!raw) return fallback
  const parsed = parseInt(raw, 10)
  return Number.isNaN(parsed) ? fallback : parsed
}

function geoidFrom(overrides: EnvOverrides) {
  return {
    baseUrl:
      overrides.baseUrl?.trim().replace(/\/$/, '') ||
      process.env.GEOID_BASE_URL?.trim().replace(/\/$/, '') ||
      undefined,
    adminToken:
      overrides.adminToken?.trim() ||
      process.env.GEOID_ADMIN_TOKEN?.trim() ||
      undefined,
  }
}

export function getSubmissionConfig() {
  return {
    maxRequestBodySizeKb: envInt('MAX_REQUEST_BODY_SIZE_KB', 1024),
  }
}

export class AppEnv {
  static async load() {
    const overrides = Env.parse((await cookies()).get(Env.key)?.value)
    return {
      geoid: geoidFrom(overrides),
      submission: getSubmissionConfig(),
    }
  }
}

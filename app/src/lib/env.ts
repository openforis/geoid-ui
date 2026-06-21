export type EnvOverrides = {
  baseUrl?: string
  adminToken?: string
}

export class Env {
  static readonly key = 'geoid-env'

  static parse(raw: string | null | undefined): EnvOverrides {
    try {
      const parsed = raw ? JSON.parse(decodeURIComponent(raw)) : {}
      return {
        baseUrl: typeof parsed.baseUrl === 'string' ? parsed.baseUrl : undefined,
        adminToken: typeof parsed.adminToken === 'string' ? parsed.adminToken : undefined,
      }
    } catch {
      return {}
    }
  }

  static serialize(overrides: EnvOverrides): EnvOverrides {
    return {
      baseUrl: overrides.baseUrl?.trim() || undefined,
      adminToken: overrides.adminToken?.trim() || undefined,
    }
  }
}

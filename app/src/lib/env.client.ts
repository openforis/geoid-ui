'use client'

import { Env, type EnvOverrides } from '@/lib/env'

export function loadEnv(): EnvOverrides {
  try {
    const raw = sessionStorage.getItem(Env.key)
    if (raw) return Env.parse(raw)
  } catch {
    // ignore
  }
  const match = document.cookie.match(new RegExp(`(?:^|; )${Env.key}=([^;]*)`))
  return Env.parse(match?.[1])
}

export function saveEnv(overrides: EnvOverrides) {
  const value = JSON.stringify(Env.serialize(overrides))
  const empty = !overrides.baseUrl && !overrides.adminToken
  if (empty) {
    sessionStorage.removeItem(Env.key)
    document.cookie = `${Env.key}=; Max-Age=0; path=/`
    return
  }
  sessionStorage.setItem(Env.key, value)
  document.cookie = `${Env.key}=${encodeURIComponent(value)}; path=/; SameSite=Lax`
}

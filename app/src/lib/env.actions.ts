'use server'

import { action } from '@/lib/server/action'

export const fetchDeployedBaseUrl = action(async (): Promise<string | undefined> => {
  return process.env.GEOID_BASE_URL?.trim().replace(/\/$/, '') || undefined
})

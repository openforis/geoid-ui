import 'server-only'
import type { ActionResult } from '@/types/action-result'

const UNAVAILABLE = 'The GeoID service is unavailable. Please try again later.'

function isNextSentinel(err: unknown): boolean {
  const digest = (err as { digest?: unknown } | null)?.digest
  return typeof digest === 'string'
    && (digest.startsWith('NEXT_REDIRECT') || digest === 'NEXT_NOT_FOUND')
}

export function action<TArgs extends unknown[], T>(
  fn: (...args: TArgs) => Promise<T>,
): (...args: TArgs) => Promise<ActionResult<T>> {
  return async (...args) => {
    try {
      return { ok: true, data: await fn(...args) }
    } catch (err) {
      if (isNextSentinel(err)) throw err
      console.error('[action]', err)
      const message = (err as Error)?.message
      return { ok: false, message: message && message !== 'fetch failed' ? message : UNAVAILABLE }
    }
  }
}

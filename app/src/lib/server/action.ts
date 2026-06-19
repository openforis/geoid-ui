import 'server-only'
import type { ActionResult } from '@/types/action-result'

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
      const e = err as Error
      console.error('[action]', e?.message ?? String(err), e?.stack)
      return { ok: false, message: e?.message ?? 'Request failed.' }
    }
  }
}

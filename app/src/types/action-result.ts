export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; message: string }

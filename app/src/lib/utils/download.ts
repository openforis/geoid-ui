export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function copyText(text: string) {
  return navigator.clipboard.writeText(text)
}

export function timestampFilename(ext: string, suffix?: string) {
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  return `geoid-${suffix ? `${suffix}-` : ''}${ts}.${ext}`
}

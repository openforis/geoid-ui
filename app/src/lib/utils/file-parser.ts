export type GeoJsonParseResult =
  | { geojson: Record<string, unknown> }
  | { error: string }

export type FileTextResult = string | { error: string }

function readTextFile(file: File): Promise<FileTextResult> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result
      if (typeof text !== 'string') resolve({ error: 'Error reading the file.' })
      else resolve(text)
    }
    reader.onerror = () => resolve({ error: 'Error reading the file.' })
    reader.readAsText(file)
  })
}

export function parseGeoJsonText(text: string): GeoJsonParseResult {
  if (!text.trim()) return { error: 'GeoJSON is empty.' }
  try {
    return { geojson: JSON.parse(text) as Record<string, unknown> }
  } catch {
    return { error: 'Invalid GeoJSON format.' }
  }
}

export async function readGeoJsonFile(file: File): Promise<FileTextResult> {
  const text = await readTextFile(file)
  if (typeof text !== 'string') return text
  const result = parseGeoJsonText(text)
  return 'error' in result ? result : JSON.stringify(result.geojson, null, 2)
}

export function parseGeoIdText(text: string): string[] {
  return text.split(/[\n,]/).map((l) => l.trim()).filter(Boolean)
}

export async function readGeoIdFile(file: File): Promise<FileTextResult> {
  const text = await readTextFile(file)
  if (typeof text !== 'string') return text
  const ids = parseGeoIdText(text)
  return ids.length > 0 ? ids.join('\n') : { error: 'File contains no valid GeoIDs.' }
}

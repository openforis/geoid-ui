export type GeoJsonParseResult =
  | { geojson: Record<string, unknown> }
  | { error: string }

function readTextFile(file: File): Promise<string | { error: string }> {
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

export async function parseGeoJsonFile(file: File): Promise<GeoJsonParseResult> {
  const text = await readTextFile(file)
  if (typeof text !== 'string') return text
  if (!text.trim()) return { error: 'File is empty.' }
  return parseGeoJsonText(text)
}

export function parseGeoIdText(text: string): string[] {
  return text.split(/[\n,]/).map((l) => l.trim()).filter(Boolean)
}

export async function parseGeoIdFile(file: File): Promise<string[] | { error: string }> {
  const text = await readTextFile(file)
  if (typeof text !== 'string') return text
  const ids = parseGeoIdText(text)
  if (ids.length === 0) return { error: 'File contains no valid Geo IDs.' }
  return ids
}

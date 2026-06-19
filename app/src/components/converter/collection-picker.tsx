'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fetchCollections } from '@/lib/converter/actions'
import type { CollectionInfo } from '@/types/collection'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface CollectionPickerProps {
  value: string
  onChange: (value: string) => void
  onError: (message: string) => void
}

export function CollectionPicker({ value, onChange, onError }: CollectionPickerProps) {
  const [collections, setCollections] = useState<CollectionInfo[]>([])
  const [loading, setLoading] = useState(true)
  const initialized = useRef(false)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const result = await fetchCollections()
      if (!result.ok) {
        onError(result.message)
        setCollections([])
        return []
      }
      const data = result.data
      setCollections(data)
      return data
    } finally {
      setLoading(false)
    }
  }, [onError])

  useEffect(() => {
    load().then((data) => {
      if (!initialized.current) {
        initialized.current = true
        if (data[0]) onChangeRef.current(data[0].id)
      }
    })
  }, [load])

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">Collection</span>
      <div className="flex items-center gap-2">
        <Select value={value} onValueChange={(v) => v && onChange(v)} disabled={loading}>
          <SelectTrigger className="flex-1 w-full">
            <SelectValue placeholder={loading ? 'Loading…' : 'Select a collection…'} />
          </SelectTrigger>
          <SelectContent>
            {collections.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="outline"
          onClick={load}
          disabled={loading}
          title="Refresh collections"
        >
          <RefreshCw className={cn('size-3.5', loading && 'animate-spin')} />
        </Button>
      </div>
    </div>
  )
}

'use client'

import { useState, type ReactNode } from 'react'
import { FileDropZone } from '@/components/converter/file-drop-zone'
import { Textarea } from '@/components/ui/textarea'
import type { FileTextResult } from '@/lib/utils/file-parser'

interface FileTextInputProps {
  accept: string
  formats: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  readFile: (file: File) => Promise<FileTextResult>
  maxFileSize: number
  onError: (message: string) => void
  children?: ReactNode
}

export function FileTextInput({
  accept,
  formats,
  placeholder,
  value,
  onChange,
  readFile,
  maxFileSize,
  onError,
  children,
}: FileTextInputProps) {
  const [loaded, setLoaded] = useState<{ name: string; text: string } | null>(null)

  const handleFile = async (file: File) => {
    onError('')
    if (file.size > maxFileSize) {
      onError(`File too large. Maximum is ${maxFileSize / 1024} KB.`)
      return
    }
    const result = await readFile(file)
    if (typeof result !== 'string') {
      onError(result.error)
      return
    }
    setLoaded({ name: file.name, text: result })
    onChange(result)
  }

  return (
    <div className="flex min-h-0 flex-1 items-stretch gap-0 max-sm:flex-col max-sm:min-h-64">
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <FileDropZone
          accept={accept}
          fileName={loaded?.text === value ? loaded.name : undefined}
          onFile={handleFile}
          formats={formats}
          className="min-h-0"
        />
        {children}
      </div>

      <div className="flex-shrink-0 w-8 flex items-center justify-center text-[11px] text-text-muted max-sm:w-full max-sm:py-1.5 max-sm:justify-center">
        or
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-0 flex-1 font-mono"
      />
    </div>
  )
}

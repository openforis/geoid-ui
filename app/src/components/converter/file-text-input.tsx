'use client'

import { FileDropZone } from '@/components/converter/file-drop-zone'
import { Textarea } from '@/components/ui/textarea'

interface FileTextInputProps {
  accept: string
  formats: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  fileName: string
  onFile: (file: File) => void
  maxFileSize: number
  onError: (message: string) => void
}

export function FileTextInput({
  accept,
  formats,
  placeholder,
  value,
  onChange,
  fileName,
  onFile,
  maxFileSize,
  onError,
}: FileTextInputProps) {
  const handleFile = (file: File) => {
    if (file.size > maxFileSize) {
      onError(`File too large. Maximum is ${maxFileSize / 1024} KB.`)
      return
    }
    onFile(file)
  }

  return (
    <div className="flex min-h-0 flex-1 items-stretch gap-0 max-sm:flex-col max-sm:min-h-64">
      <FileDropZone
        accept={accept}
        fileName={fileName}
        onFile={handleFile}
        formats={formats}
        compact
        className="min-h-0"
      />

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

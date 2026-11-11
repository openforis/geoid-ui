'use client'

import { useState, type ComponentProps } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CopyButton({
  text,
  variant = 'ghost',
  size = 'icon-xs',
  children,
  ...props
}: Omit<ComponentProps<typeof Button>, 'onClick' | 'title'> & { text: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      {...props}
      variant={variant}
      size={size}
      title={copied ? 'Copied' : 'Copy'}
      onClick={(e) => {
        e.stopPropagation()
        navigator.clipboard.writeText(text).then(
          () => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          },
          () => {},
        )
      }}
    >
      {copied ? <Check /> : <Copy />}
      {children}
    </Button>
  )
}

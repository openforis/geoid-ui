'use client'

import { useEffect, useRef, useState } from 'react'
import type { ActionResult } from '@/types/action-result'
import type { ConverterResult, ConverterStep } from '@/types/converter'

export function useConverterFlow(onStepChange: (step: ConverterStep) => void, onError: (message: string) => void) {
  const [step, setStep] = useState<ConverterStep>('input')
  const [text, setText] = useState('')
  const [output, setOutput] = useState<ConverterResult | null>(null)
  const flowRef = useRef<HTMLDivElement>(null)
  const scrolledRef = useRef(false)

  useEffect(() => {
    onStepChange(step)
  }, [step, onStepChange])

  useEffect(() => {
    if (step !== 'input' && !scrolledRef.current) {
      scrolledRef.current = true
      flowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else if (step === 'input') {
      scrolledRef.current = false
    }
  }, [step])

  const changeText = (value: string) => {
    setText(value)
    setOutput(null)
    setStep('input')
  }

  const reset = () => {
    changeText('')
    onError('')
  }

  const run = async (request: () => Promise<ActionResult<ConverterResult>>) => {
    onError('')
    setStep('processing')
    const result = await request().catch(() => null)
    if (result?.ok) {
      setOutput(result.data)
      setStep('result')
    } else {
      onError(result?.message ?? 'Something went wrong. Please try again.')
      setStep('input')
    }
  }

  return { step, text, output, flowRef, changeText, reset, run }
}

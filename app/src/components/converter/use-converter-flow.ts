'use client'

import { useEffect, useRef, useState } from 'react'
import type { ConverterStep } from '@/types/converter'

export function useConverterFlow(onStepChange: (step: ConverterStep) => void) {
  const [step, setStep] = useState<ConverterStep>('input')
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

  const resetStep = () => {
    setStep('input')
    scrolledRef.current = false
  }

  return { step, setStep, flowRef, resetStep }
}

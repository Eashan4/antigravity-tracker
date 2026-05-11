'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

export function AnimatedCounter({ value, suffix = '', prefix = '', duration = 2, className }: AnimatedCounterProps) {
  const [isVisible, setIsVisible] = useState(false)
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 })
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString())

  useEffect(() => {
    setIsVisible(true)
    spring.set(value)
  }, [spring, value])

  if (!isVisible) return <span className={className}>0</span>

  return (
    <span className={className}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  )
}

'use client'

import { MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'

// reducedMotion="user": при включённом «уменьшить движение» в ОС анимации отключаются
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

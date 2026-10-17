'use client'

import { useLayoutEffect } from 'react'

/** Keep the exported 1200px artboards proportional without CSS length division. */
export default function ViewportScale() {
  useLayoutEffect(() => {
    const update = () => {
      document.documentElement.style.setProperty('--csb-scale', String(window.innerWidth / 1200))
    }
    update()
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])
  return null
}

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { MotionConfig } from 'motion/react'
import { useMediaQuery } from '../hooks/useMediaQuery'

const MotionContext = createContext({ enabled: true, reduced: false, paused: false, toggle: () => {} })

export function MotionProvider({ children }: { children: ReactNode }) {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [paused, setPaused] = useState(() => {
    try { return localStorage.getItem('reecha:motion-paused') === 'true' } catch { return false }
  })
  const enabled = !reduced && !paused
  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? 'on' : 'off'
    try { localStorage.setItem('reecha:motion-paused', String(paused)) } catch { /* Storage is optional. */ }
  }, [enabled, paused])
  const value = useMemo(() => ({ enabled, reduced, paused, toggle: () => setPaused(previous => !previous) }), [enabled, reduced, paused])
  return (
    <MotionContext.Provider value={value}>
      <MotionConfig reducedMotion={enabled ? 'user' : 'always'} transition={{ duration: enabled ? 0.35 : 0, ease: [0.22, 1, 0.36, 1] }}>
        {children}
      </MotionConfig>
    </MotionContext.Provider>
  )
}

// The preference hook shares this context intentionally.
// eslint-disable-next-line react-refresh/only-export-components
export function useMotionSettings() { return useContext(MotionContext) }

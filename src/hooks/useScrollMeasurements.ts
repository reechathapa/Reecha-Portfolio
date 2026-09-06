import { useEffect } from 'react'
import type { RefObject } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Filters, disclosures, and font loading can change chapter positions without
// resizing the window. Refresh measurements only when document geometry changes.
export function useScrollMeasurements(root: RefObject<HTMLElement>) {
  useEffect(() => {
    const element = root.current
    if (!element) return
    let frame = 0
    let previousHeight = 0
    let previousWidth = 0
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (Math.abs(height - previousHeight) < 1 && Math.abs(width - previousWidth) < 1) return
      previousHeight = height; previousWidth = width
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    })
    observer.observe(element)
    return () => { cancelAnimationFrame(frame); observer.disconnect() }
  }, [root])
}

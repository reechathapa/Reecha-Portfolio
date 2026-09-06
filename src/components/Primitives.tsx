import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode, KeyboardEvent } from 'react'
import { animate, motion, useInView } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { spring } from 'react-motion'
import CoupledSpring from './CoupledSpring'
import { useMotionSettings } from './MotionProvider'
import { useMediaQuery } from '../hooks/useMediaQuery'

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { enabled } = useMotionSettings()
  return (
    <motion.div className={className} initial={enabled ? { opacity: 0, y: 22 } : false}
      whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }}
      animate={!enabled ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: enabled ? 0.65 : 0, delay: enabled ? delay : 0, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

export function SectionLabel({ number, children, light = false }: { number: string; children: ReactNode; light?: boolean }) {
  return <div className={`section-label${light ? ' section-label-light' : ''}`}><span>{number}</span><span className="label-dash" />{children}</div>
}

export function ArrowLink({ children, onClick, href, className = '' }: { children: ReactNode; onClick?: () => void; href?: string; className?: string }) {
  const content = <>{children}<ArrowUpRight size={17} strokeWidth={1.6} aria-hidden="true" /></>
  return href ? <a className={`text-link ${className}`} href={href} onClick={onClick}>{content}</a>
    : <button className={`text-link ${className}`} type="button" onClick={onClick}>{content}</button>
}

// A narrowly scoped two-body spring: the label follows the moving surface, not
// the raw pointer. React Motion owns x/y; Motion owns only press feedback.
export function MagneticButton({ children, href, onClick, className = '', light = false }: {
  children: ReactNode; href?: string; onClick?: () => void; className?: string; light?: boolean
}) {
  const { enabled } = useMotionSettings()
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const root = useRef<HTMLSpanElement>(null)
  const frame = useRef(0)
  const [target, setTarget] = useState({ x: 0, y: 0 })
  useEffect(() => () => cancelAnimationFrame(frame.current), [])
  useEffect(() => { if (!enabled || !finePointer) setTarget({ x: 0, y: 0 }) }, [enabled, finePointer])
  const inner = (labelX = 0, labelY = 0) => {
    const content = <><span className="button-label" style={{ transform: `translate3d(${labelX}px, ${labelY}px, 0)` }}>{children}</span><span className="button-arrow"><ArrowUpRight size={18} strokeWidth={1.8} aria-hidden="true" /></span></>
    const props = { className: `button ${light ? 'button-lime' : 'button-dark'} ${className}`, onClick, whileTap: enabled ? { scale: 0.98 } : undefined }
    return href ? <motion.a {...props} href={href}>{content}</motion.a> : <motion.button {...props} type="button">{content}</motion.button>
  }
  return <span ref={root} className="magnetic-hitbox" onPointerMove={event => {
    if (!enabled || !finePointer || event.pointerType !== 'mouse' || !root.current) return
    const rect = root.current.getBoundingClientRect()
    const x = Math.max(-7, Math.min(7, (event.clientX - rect.left - rect.width / 2) * 0.1))
    const y = Math.max(-4, Math.min(4, (event.clientY - rect.top - rect.height / 2) * 0.13))
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => setTarget({ x, y }))
  }} onPointerLeave={() => { cancelAnimationFrame(frame.current); setTarget({ x: 0, y: 0 }) }}>
    {enabled && finePointer ? <CoupledSpring defaultStyles={[{ x: 0, y: 0 }, { x: 0, y: 0 }]}
      styles={previous => [
        { x: spring(target.x, { stiffness: 210, damping: 26 }), y: spring(target.y, { stiffness: 210, damping: 26 }) },
        { x: spring(previous?.[0]?.x ?? 0, { stiffness: 310, damping: 30 }), y: spring(previous?.[0]?.y ?? 0, { stiffness: 310, damping: 30 }) },
      ]}>
      {positions => <span className="magnetic-surface" style={{ transform: `translate3d(${positions[0].x}px, ${positions[0].y}px, 0)` }}>{inner((positions[1].x - positions[0].x) * 0.4, (positions[1].y - positions[0].y) * 0.4)}</span>}
    </CoupledSpring> : inner()}
  </span>
}

export type TabItem = { id: string; label: string; icon?: ReactNode }
export function AnimatedTabs({ items, value, onChange, label, id, className = '' }: {
  items: TabItem[]; value: string; onChange: (value: string) => void; label: string; id: string; className?: string
}) {
  const layoutId = useId()
  const { enabled } = useMotionSettings()
  const root = useRef<HTMLDivElement>(null)
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % items.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + items.length) % items.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = items.length - 1
    else return
    event.preventDefault()
    onChange(items[next].id)
    root.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus()
  }
  return <div ref={root} className={`animated-tabs ${className}`} role="tablist" aria-label={label}>
    {items.map((item, index) => <button key={item.id} type="button" role="tab" id={`${id}-tab-${item.id}`} aria-selected={value === item.id}
      aria-controls={`${id}-panel`} tabIndex={value === item.id ? 0 : -1}
      onClick={() => onChange(item.id)} onKeyDown={event => onKeyDown(event, index)}>
      {value === item.id && <motion.span className="tab-background" layoutId={`tab-${layoutId}`} transition={{ type: 'tween', duration: enabled ? 0.26 : 0, ease: [0.22, 1, 0.36, 1] }} />}
      <span className="tab-content">{item.icon}{item.label}</span>
    </button>)}
  </div>
}

export function AnimatedNumber({ value, suffix = '', prefix = '', decimals = 0 }: { value: number; suffix?: string; prefix?: string; decimals?: number }) {
  const { enabled } = useMotionSettings()
  const root = useRef<HTMLSpanElement>(null)
  const inView = useInView(root, { once: true, amount: 0.8 })
  const [display, setDisplay] = useState(enabled ? 0 : value)
  const current = useRef(enabled ? 0 : value)
  useEffect(() => {
    if (!enabled) { current.current = value; setDisplay(value); return }
    if (!inView) return
    const controls = animate(current.current, value, { duration: 1.05, ease: [0.22, 1, 0.36, 1], onUpdate: latest => { current.current = latest; setDisplay(latest) } })
    return () => controls.stop()
  }, [value, inView, enabled])
  return <span ref={root} className="animated-number" aria-label={`${prefix}${value.toFixed(decimals)}${suffix}`}><span aria-hidden="true">{prefix}{display.toFixed(decimals)}{suffix}</span></span>
}

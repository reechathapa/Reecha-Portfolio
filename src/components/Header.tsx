import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll } from 'motion/react'
import { ArrowUpRight, Menu, Pause, Play, X } from 'lucide-react'
import { useMotionSettings } from './MotionProvider'
import { useMediaQuery } from '../hooks/useMediaQuery'

const links = [
  { href: '#work', label: 'Work' },
  { href: '#expertise', label: 'Expertise' },
  { href: '#about', label: 'About' },
  { href: '#notes', label: 'Notes' },
]

export default function Header({ onContact }: { onContact: () => void }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const { enabled, reduced, paused, toggle } = useMotionSettings()
  const { scrollYProgress } = useScroll()
  const desktop = useMediaQuery('(min-width: 800px)')
  const menuButton = useRef<HTMLButtonElement>(null)
  const header = useRef<HTMLElement>(null)
  useEffect(() => { if (desktop) setOpen(false) }, [desktop])
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        else setActive(previous => previous === `#${entry.target.id}` ? '' : previous)
      })
    }, { rootMargin: '-20% 0px -50% 0px', threshold: 0 })
    links.forEach(link => { const element = document.querySelector(link.href); if (element) observer.observe(element) })
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); menuButton.current?.focus() }
    }
    const onPointerDown = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => { document.removeEventListener('keydown', onKeyDown); document.removeEventListener('pointerdown', onPointerDown) }
  }, [open])
  const motionLabel = reduced ? 'Reduced motion is enabled by your device' : paused ? 'Resume animations' : 'Pause animations'
  return <header className="site-header" ref={header}>
    <div className="header-inner container">
      <a href="#top" className="wordmark" aria-label="Reecha Thapa, back to top" onClick={() => setOpen(false)}>reecha<span>.</span><span className="wordmark-sub">THAPA</span></a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map(link => <a key={link.href} href={link.href} className={active === link.href ? 'is-active' : ''} aria-current={active === link.href ? 'location' : undefined}>
          {link.label}{active === link.href && <motion.span className="nav-indicator" layoutId="navigation-indicator" transition={{ duration: enabled ? 0.3 : 0 }} />}
        </a>)}
      </nav>
      <div className="header-actions">
        <button className="motion-toggle icon-button" type="button" onClick={toggle} disabled={reduced} aria-label={motionLabel} title={motionLabel} aria-pressed={paused || reduced}>
          {enabled ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
        </button>
        <button className="header-contact" type="button" onClick={() => { setOpen(false); onContact() }}>Let’s talk<ArrowUpRight size={16} aria-hidden="true" /></button>
        <button className="menu-toggle icon-button" ref={menuButton} type="button" aria-expanded={open} aria-controls={open ? "mobile-navigation" : undefined} aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(previous => !previous)}>{open ? <X size={21} /> : <Menu size={21} />}</button>
      </div>
    </div>
    <AnimatePresence>
      {open && <motion.nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" initial={enabled ? { opacity: 0, height: 0 } : false} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: enabled ? 0.25 : 0 }}>
        <div>{links.map((link, index) => <a href={link.href} key={link.href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{link.label}<ArrowUpRight size={21} /></a>)}</div>
      </motion.nav>}
    </AnimatePresence>
    <motion.div className="reading-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
  </header>
}

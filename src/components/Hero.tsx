import { useLayoutEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { ArrowDown, Sparkles } from 'lucide-react'
import { gsap } from 'gsap'
import { useMotionSettings } from './MotionProvider'
import { ArrowLink, MagneticButton } from './Primitives'

const hotBars = ['rgba(255, 62, 12, 0.92)', 'rgba(208, 45, 10, 0.88)', 'rgba(255, 105, 42, 0.78)']
const darkBars = ['rgba(3, 5, 4, 0.94)', 'rgba(24, 13, 8, 0.76)', 'rgba(12, 8, 7, 0.88)']
const gradientBars = Array.from({ length: 34 }, (_, index) => {
  const isHot = index % 7 === 0 || index % 11 === 0 || (index > 9 && index < 20 && index % 3 === 0)
  const sway = Math.abs(Math.sin(index * 1.61)) * 18 + Math.abs(Math.cos(index * 0.73)) * 12
  const delay = (index % 9) * -0.35
  const duration = 5.6 + (index % 7) * 0.44
  return {
    left: `${index * (100 / 34)}%`,
    width: `${100 / 34}%`,
    color: isHot ? hotBars[index % hotBars.length] : darkBars[index % darkBars.length],
    height: `${88 + sway}%`,
    opacity: isHot ? 0.9 : 0.68,
    delay,
    duration,
  }
})

function GradientBars() {
  return <div className="gradient-bars" aria-hidden="true">{gradientBars.map((bar, index) => <span key={index} className="gradient-bar" style={{
    '--gradient-color': bar.color,
    '--gradient-left': bar.left,
    '--gradient-width': bar.width,
    '--gradient-height': bar.height,
    '--gradient-opacity': String(bar.opacity),
    '--gradient-delay': `${bar.delay}s`,
    '--gradient-duration': `${bar.duration}s`,
  } as CSSProperties} />)}</div>
}

export default function Hero({ onContact }: { onContact: () => void }) {
  const root = useRef<HTMLElement>(null)
  const { enabled } = useMotionSettings()
  useLayoutEffect(() => {
    const context = gsap.context(() => {
      if (!enabled) {
        gsap.set(['.hero-eyebrow', '.hero-line-inner', '.hero-copy', '.hero-ctas', '.hero-bottom'], { clearProps: 'all' })
        return
      }
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
      timeline.from('.hero-eyebrow', { opacity: 0, y: 10, duration: 0.65 }, 0.12)
        .from('.hero-line-inner', { yPercent: 108, opacity: 0, duration: 0.95, stagger: 0.1 }, 0.2)
        .from('.hero-copy', { opacity: 0, y: 14, duration: 0.65 }, 0.7)
        .from('.hero-ctas', { opacity: 0, y: 12, duration: 0.6 }, 0.84)
        .from('.hero-bottom > *', { opacity: 0, y: 10, duration: 0.6, stagger: 0.08 }, 1)
    }, root)
    return () => context.revert()
  }, [enabled])
  return <section className="hero gradient-hero" id="top" ref={root} aria-labelledby="hero-heading">
    <GradientBars />
    <div className="hero-grain" aria-hidden="true" />
    <div className="container gradient-hero-inner">
      <div className="hero-main gradient-hero-main">
        <div className="hero-content gradient-hero-content">
          <div className="eyebrow hero-eyebrow"><span className="status-dot" /> SEO & ORGANIC GROWTH STRATEGIST</div>
          <h1 id="hero-heading"><span className="hero-line"><span className="hero-line-inner">Turning search</span></span>{' '}<span className="hero-line"><span className="hero-line-inner">into your next</span></span>{' '}<span className="hero-line"><span className="hero-line-inner serif">big opportunity.</span></span></h1>
          <p className="hero-copy">I’m Reecha. I connect the dots between what people search for and what helps businesses grow.</p>
          <div className="hero-ctas"><MagneticButton light href="#work">Explore my work</MagneticButton><ArrowLink className="hero-light-link" onClick={onContact}>Let’s connect</ArrowLink></div>
        </div>
      </div>
      <div className="hero-bottom">
        <div className="hero-belief"><span className="belief-icon"><Sparkles size={17} strokeWidth={1.25} /></span><span>Thoughtful strategy.<br /><strong>Meaningful momentum.</strong></span></div>
        <div className="hero-disciplines"><span>SEARCH STRATEGY</span><span className="discipline-plus">+</span><span>CONTENT SYSTEMS</span><span className="discipline-plus">+</span><span>HUMAN INSIGHT</span></div>
        <a href="#work" className="scroll-cue" aria-label="Scroll to selected work"><span>SCROLL TO EXPLORE</span><ArrowDown size={17} strokeWidth={1.5} /></a>
      </div>
    </div>
  </section>
}

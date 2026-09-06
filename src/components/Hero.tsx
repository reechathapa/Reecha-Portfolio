import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { ArrowDown, ArrowUpRight, ChartNoAxesCombined, Crosshair, Database, MoveUpRight, Search, Sparkles } from 'lucide-react'
import { gsap } from 'gsap'
import { useMotionSettings } from './MotionProvider'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { ArrowLink, MagneticButton } from './Primitives'
import OptionalVisual from './OptionalVisual'

const SignalCanvas = lazy(() => import('./SignalCanvas'))
const stages = [
  { name: 'Search', title: 'It starts with a question.', detail: 'Listen to what people are really looking for.', icon: Search },
  { name: 'Data', title: 'Find the signal in the noise.', detail: 'Connect search behavior with the bigger picture.', icon: Database },
  { name: 'Insight', title: 'Turn understanding into direction.', detail: 'Make the next move a more meaningful one.', icon: Sparkles },
  { name: 'Growth', title: 'Build something worth finding.', detail: 'Connect the right people to the right next step.', icon: ChartNoAxesCombined },
]

type DeviceNavigator = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }

function HeroSignal() {
  const [phase, setPhase] = useState(2)
  const [ready, setReady] = useState(false)
  const { enabled } = useMotionSettings()
  const desktop = useMediaQuery('(min-width: 800px) and (pointer: fine)')
  const root = useRef<HTMLDivElement>(null)
  const path = useRef<SVGPathElement>(null)
  const near = useInView(root, { margin: '120px', once: true })
  const visible = useInView(root, { amount: 0.1 })
  const onReady = useCallback((value: boolean) => setReady(value), [])
  const device = navigator as DeviceNavigator
  const canRender = enabled && desktop && !device.connection?.saveData && (device.deviceMemory === undefined || device.deviceMemory >= 4) && (device.hardwareConcurrency === undefined || device.hardwareConcurrency > 2)
  useEffect(() => {
    if (!path.current) return
    const tween = gsap.to(path.current, { strokeDashoffset: 1 - (phase + 1) / 4, duration: enabled ? 0.7 : 0, ease: 'power2.out' })
    return () => { tween.kill() }
  }, [phase, enabled])
  const ActiveIcon = stages[phase].icon
  return <div className="hero-art" ref={root}>
    <div className={`signal-surface ${ready && canRender ? 'has-webgl' : ''}`}>
      <div className="signal-grain" aria-hidden="true" />
      {near && canRender && <OptionalVisual><Suspense fallback={null}><SignalCanvas active={visible} phase={phase} onReady={onReady} /></Suspense></OptionalVisual>}
      <div className="signal-topline"><span><span className="status-dot" /> A CONNECTED WAY OF THINKING</span><Crosshair size={17} strokeWidth={1.2} aria-hidden="true" /></div>
      <div className="signal-map" aria-hidden="true">
        <svg className="signal-routes" viewBox="0 0 520 345" fill="none">
          <defs><linearGradient id="route-gradient" x1="50" y1="290" x2="480" y2="60" gradientUnits="userSpaceOnUse"><stop stopColor="#91aa66" /><stop offset="1" stopColor="#507624" /></linearGradient></defs>
          <g className="static-signal-lines" stroke="#889773" strokeWidth="0.7" opacity="0.32">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => <path key={i} d={`M -30 ${115 + i * 22} C 120 ${60 + i * 26}, 155 ${355 - i * 23}, 270 180 S 415 ${30 + i * 17}, 560 ${20 + i * 32}`} />)}
          </g>
          <path d="M68 282C138 282 124 222 194 222S250 148 325 148S393 77 450 77" stroke="#adb89e" strokeWidth="1.2" strokeDasharray="4 5" />
          <path ref={path} d="M68 282C138 282 124 222 194 222S250 148 325 148S393 77 450 77" stroke="url(#route-gradient)" strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset="0.25" />
          {[[68, 282], [194, 222], [325, 148], [450, 77]].map(([x, y], index) => <g key={x}>
            <circle cx={x} cy={y} r={index === phase ? 19 : 11} fill={index <= phase ? '#c8eb85' : '#f2f4eb'} stroke={index <= phase ? '#9dbb68' : '#c4cbb9'} strokeWidth="1" />
            <circle cx={x} cy={y} r="3.5" fill={index <= phase ? '#344529' : '#8a977b'} />
          </g>)}
        </svg>
        <div className="query-fragment query-fragment-one"><Search size={12} />what people need</div>
        <div className="query-fragment query-fragment-two">a little more clarity<ArrowUpRight size={12} /></div>
        <div className="insight-node"><ActiveIcon size={27} strokeWidth={1.3} /><span>THE {stages[phase].name.toUpperCase()}</span></div>
        <div className="growth-note"><MoveUpRight size={33} strokeWidth={1.25} /><span>Room<br />to grow.</span></div>
        <span className="map-label label-search">CURIOSITY IN</span><span className="map-label label-growth">POSSIBILITY OUT</span>
        <span className="signal-coordinate">01 — STRATEGIC COORDINATES</span>
      </div>
      <div className="signal-controls">
        <div className="signal-stages" role="group" aria-label="Explore the search-to-growth system">{stages.map((stage, index) => <button key={stage.name} type="button" aria-pressed={phase === index} onClick={() => setPhase(index)}>
          {phase === index && <motion.span className="signal-stage-active" layoutId="signal-stage" transition={{ duration: enabled ? 0.28 : 0 }} />}<span><small>0{index + 1}</small>{stage.name}</span>
        </button>)}</div>
        <div className="signal-description" aria-live="polite" aria-atomic="true">
          <AnimatePresence mode="wait" initial={false}><motion.p key={phase} initial={enabled ? { opacity: 0, y: 4 } : false} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: enabled ? -4 : 0 }} transition={{ duration: enabled ? 0.16 : 0 }}>{stages[phase].title}</motion.p></AnimatePresence>
          <span className="sr-only">{stages[phase].detail}</span>
        </div>
      </div>
    </div>
    <div className="hero-art-caption"><span><span className="tiny-cross">+</span> LESS GUESSWORK. MORE DIRECTION.</span><span>EXPLORE THE SIGNAL ↗</span></div>
  </div>
}

export default function Hero({ onContact }: { onContact: () => void }) {
  const root = useRef<HTMLElement>(null)
  const { enabled } = useMotionSettings()
  useLayoutEffect(() => {
    const context = gsap.context(() => {
      if (!enabled) {
        gsap.set(['.hero-eyebrow', '.hero-line-inner', '.hero-copy', '.hero-ctas', '.hero-art', '.hero-bottom'], { clearProps: 'all' })
        return
      }
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
      timeline.from('.hero-art', { opacity: 0, y: 16, duration: 1 }, 0)
        .from('.hero-eyebrow', { opacity: 0, y: 10, duration: 0.65 }, 0.12)
        .from('.hero-line-inner', { yPercent: 108, opacity: 0, duration: 0.95, stagger: 0.1 }, 0.2)
        .from('.hero-copy', { opacity: 0, y: 14, duration: 0.65 }, 0.7)
        .from('.hero-ctas', { opacity: 0, y: 12, duration: 0.6 }, 0.84)
        .from('.hero-bottom > *', { opacity: 0, y: 10, duration: 0.6, stagger: 0.08 }, 1)
    }, root)
    return () => context.revert()
  }, [enabled])
  return <section className="hero container" id="top" ref={root} aria-labelledby="hero-heading">
    <div className="hero-main">
      <div className="hero-content">
        <div className="eyebrow hero-eyebrow"><span className="status-dot" /> SEO & ORGANIC GROWTH STRATEGIST</div>
        <h1 id="hero-heading"><span className="hero-line"><span className="hero-line-inner">Turning search</span></span>{' '}<span className="hero-line"><span className="hero-line-inner">into your next</span></span>{' '}<span className="hero-line"><span className="hero-line-inner serif">big opportunity.</span></span></h1>
        <p className="hero-copy">I’m Reecha. I connect the dots between what people search for and what helps businesses grow.</p>
        <div className="hero-ctas"><MagneticButton href="#work">Explore my work</MagneticButton><ArrowLink onClick={onContact}>Let’s connect</ArrowLink></div>
      </div>
      <HeroSignal />
    </div>
    <div className="hero-bottom">
      <div className="hero-belief"><span className="belief-icon"><Sparkles size={17} strokeWidth={1.25} /></span><span>Thoughtful strategy.<br /><strong>Meaningful momentum.</strong></span></div>
      <div className="hero-disciplines"><span>SEARCH STRATEGY</span><span className="discipline-plus">+</span><span>CONTENT SYSTEMS</span><span className="discipline-plus">+</span><span>HUMAN INSIGHT</span></div>
      <a href="#work" className="scroll-cue" aria-label="Scroll to selected work"><span>SCROLL TO EXPLORE</span><ArrowDown size={17} strokeWidth={1.5} /></a>
    </div>
  </section>
}

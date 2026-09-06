import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Compass, Layers3, RefreshCw } from 'lucide-react'
import { Reveal, SectionLabel } from './Primitives'
import { useMotionSettings } from './MotionProvider'

const process = [
  { title: 'Listen before the plan.', phase: 'UNDERSTAND', icon: Compass, body: 'Start with your business, your audience, and what success actually means. Ask better questions before reaching for answers.', outcome: 'A shared definition of success' },
  { title: 'Make the complex, clear.', phase: 'CONNECT', icon: Layers3, body: 'Bring the research together. Find the patterns, make deliberate choices, and turn them into a plan people can act on.', outcome: 'A focused, practical roadmap' },
  { title: 'Build, learn, move forward.', phase: 'EVOLVE', icon: RefreshCw, body: 'Put the plan to work in useful increments. Keep the feedback loop short, the reporting honest, and the next step in focus.', outcome: 'Momentum with a purpose' },
]
export default function Process() {
  const root = useRef<HTMLOListElement>(null)
  const progress = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(0)
  const { enabled } = useMotionSettings()
  useEffect(() => {
    const context = gsap.context(() => {
      if (!enabled) { gsap.set(progress.current, { scaleY: 1 }); return }
      gsap.fromTo(progress.current, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 68%', end: 'bottom 70%', scrub: 0.35 } })
      root.current?.querySelectorAll('.process-item').forEach((item, index) => {
        ScrollTrigger.create({ trigger: item, start: 'top 65%', onEnter: () => setActive(index), onEnterBack: () => setActive(index) })
      })
    }, root)
    return () => context.revert()
  }, [enabled])
  return <section id="approach" className="process-section section-pad container" aria-labelledby="process-heading">
    <Reveal className="process-intro"><SectionLabel number="06">HOW I WORK</SectionLabel><h2 id="process-heading">Considered steps.<br /><span className="serif">Connected thinking.</span></h2><p>Good strategy is a conversation, not a handoff. Here’s what moving forward together could look like.</p><span className="process-aside"><span className="tiny-cross">+</span> CLARITY AT EVERY STEP</span></Reveal>
    <ol className="process-timeline" ref={root}><li className="process-line" aria-hidden="true" role="presentation"><span ref={progress} /></li>{process.map((item, index) => <li key={item.phase} className={`process-item${index <= active ? ' is-active' : ''}`}><span className="process-marker">0{index + 1}</span><Reveal><div className="process-phase"><span>{item.phase}</span><item.icon size={21} strokeWidth={1.4} /></div><h3>{item.title}</h3><p>{item.body}</p><div className="process-outcome"><ArrowUpRight size={14} />{item.outcome}</div></Reveal></li>)}</ol>
  </section>
}

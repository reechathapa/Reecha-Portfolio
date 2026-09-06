import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowDown, ArrowUpRight, Check, Leaf } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMotionSettings } from './MotionProvider'
import { Reveal, SectionLabel } from './Primitives'

gsap.registerPlugin(ScrollTrigger)
const chapters = [
  { short: 'Discover', title: 'Start with the real question.', body: 'Not “how do we get more traffic?” but “what is stopping the right people from finding the right thing?” A useful audit starts with people, then follows the evidence.', tags: ['Search landscape', 'Technical audit', 'Intent mapping'], result: 'A clearer view of the opportunity.', boardTitle: 'First, find the gaps.', boardDescription: 'From disconnected queries to a focused opportunity map.', boardMetric: 'Clarity before activity', },
  { short: 'Connect', title: 'Give every page a purpose.', body: 'A care guide, a comparison, and a product page do different jobs. Connect them into an experience that helps someone move forward, without asking them to jump ahead.', tags: ['Content architecture', 'Internal linking', 'Page experience'], result: 'One connected journey. Less friction.', boardTitle: 'Then, connect the dots.', boardDescription: 'Useful content, arranged around the way people decide.', boardMetric: 'Intent → content → action', },
  { short: 'Refine', title: 'Measure the meaningful moves.', body: 'Visibility is a starting point. The real learning comes from connecting discovery to engagement and qualified action, then using that evidence to decide what comes next.', tags: ['Measurement plan', 'Learning loops', 'Prioritization'], result: 'A strategy that keeps getting smarter.', boardTitle: 'Keep the learning moving.', boardDescription: 'A measurement framework that brings the next opportunity into focus.', boardMetric: 'Observe. Learn. Improve.', },
]

export default function CaseStudy() {
  const { enabled } = useMotionSettings()
  const [active, setActive] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const board = useRef<HTMLDivElement>(null)
  const steps = useRef<HTMLDivElement>(null)
  const progress = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const media = gsap.matchMedia()
    const context = gsap.context(() => {
      if (!enabled) { gsap.set(progress.current, { scaleX: 1 }); return }
      media.add('(min-width: 1000px)', () => {
        ScrollTrigger.create({ trigger: root.current, start: 'top 116px', end: () => `+=${Math.max(0, (steps.current?.offsetHeight || 0) - (board.current?.offsetHeight || 0))}`, pin: board.current, pinSpacing: false, invalidateOnRefresh: true })
        gsap.fromTo(progress.current, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 50%', end: 'bottom 70%', scrub: 0.3 } })
      })
      root.current?.querySelectorAll<HTMLElement>('.case-chapter').forEach((chapter, index) => {
        ScrollTrigger.create({ trigger: chapter, start: 'top 42%', end: 'bottom 42%', onEnter: () => setActive(index), onEnterBack: () => setActive(index) })
      })
    }, root)
    return () => { media.revert(); context.revert() }
  }, [enabled])
  function jump(index: number) {
    setActive(index)
    const target = document.getElementById(`chapter-${index}`)
    // Chapter controls remain useful with touch, keyboard, and motion disabled.
    target?.scrollIntoView({ behavior: enabled ? 'smooth' : 'instant', block: 'center' })
  }
  return <section className="case-section section-pad container" id="case-study" aria-labelledby="case-heading">
    <Reveal><SectionLabel number="04">A CLOSER LOOK</SectionLabel></Reveal>
    <div className="section-heading"><Reveal><h2 id="case-heading" tabIndex={-1}>From found<br />to <span className="serif">chosen.</span></h2></Reveal><Reveal delay={0.08}><div className="case-intro"><span className="case-brand"><Leaf size={19} strokeWidth={1.4} /> Verdant <span>CONCEPT STUDY</span></span><p>A search-led strategy for an imagined plant brand. Three chapters. One connected way forward.</p></div></Reveal></div>
    <div className="case-journey" ref={root}>
      <div className="case-board-column"><div className="case-board" ref={board}>
        <div className="case-board-image"><img src="/images/verdant.webp" loading="lazy" decoding="async" width="1376" height="768" alt="Concept image: an olive tree in a ceramic planter against a warm studio wall" /><span className="case-image-brand">verdant.</span><span className="case-image-note">ROOM TO GROW.</span></div>
        <div className="case-board-info"><div className="case-board-label"><span>THE STRATEGY IN MOTION</span><span>0{active + 1} / 03</span></div>
          <AnimatePresence mode="wait" initial={false}><motion.div key={active} initial={enabled ? { opacity: 0, y: 7 } : false} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: enabled ? -5 : 0 }} transition={{ duration: enabled ? 0.18 : 0 }}><h3>{chapters[active].boardTitle}</h3><p>{chapters[active].boardDescription}</p><div className="case-board-metric"><span className="status-dot" />{chapters[active].boardMetric}<ArrowUpRight size={17} /></div></motion.div></AnimatePresence>
        </div>
        <div className="case-step-controls" role="group" aria-label="Case study chapters">{chapters.map((chapter, index) => <button key={chapter.short} type="button" onClick={() => jump(index)} aria-pressed={active === index}><span>0{index + 1}</span>{chapter.short}</button>)}</div>
        <div className="case-board-progress" aria-hidden="true"><div ref={progress} /></div>
      </div><p className="case-scroll-hint"><ArrowDown size={13} /> A SHORT STORY. SCROLL AT YOUR OWN PACE.</p></div>
      <div className="case-chapters" ref={steps}>{chapters.map((chapter, index) => <article className={`case-chapter${active === index ? ' is-active' : ''}`} id={`chapter-${index}`} key={chapter.short}>
        <span className="chapter-number">0{index + 1}<span /></span><div><span className="eyebrow">{chapter.short.toUpperCase()}</span><h3>{chapter.title}</h3><p>{chapter.body}</p><div className="case-chapter-tags">{chapter.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="case-chapter-result"><Check size={15} strokeWidth={1.5} />{chapter.result}</div></div>
      </article>)}</div>
    </div>
  </section>
}

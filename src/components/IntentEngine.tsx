import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { ArrowRight, ArrowUpRight, BookOpen, ChartNoAxesCombined, FileText, Search, SlidersHorizontal, Target } from 'lucide-react'
import { gsap } from 'gsap'
import { AnimatedTabs, Reveal, SectionLabel } from './Primitives'
import { useMotionSettings } from './MotionProvider'
import { classifyIntent, intents } from '../data/intents'
import type { IntentId } from '../data/intents'

export default function IntentEngine() {
  const [selected, setSelected] = useState<IntentId>('compare')
  const [query, setQuery] = useState<string>(intents[1].query)
  const [mappedQuery, setMappedQuery] = useState<string>(intents[1].query)
  const [custom, setCustom] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const { enabled } = useMotionSettings()
  const visible = useInView(root, { amount: 0.2 })
  const intent = intents.find(item => item.id === selected)!
  const iconMap = [<BookOpen size={15} />, <SlidersHorizontal size={15} />, <ArrowUpRight size={15} />]
  useEffect(() => {
    if (enabled && !visible) return
    const context = gsap.context(() => {
      if (!enabled) { gsap.set('.flow-route', { strokeDashoffset: 0 }); return }
      gsap.timeline({ defaults: { ease: 'power2.out' } })
        .fromTo('.flow-route', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.95, stagger: 0.13 })
        .fromTo('.flow-icon', { scale: 0.92 }, { scale: 1, duration: 0.4, stagger: 0.13 }, 0.1)
    }, root)
    return () => context.revert()
  }, [selected, mappedQuery, enabled, visible])
  function select(id: string) {
    const next = intents.find(item => item.id === id)!
    setSelected(next.id); setQuery(next.query); setMappedQuery(next.query); setCustom(false)
  }
  return <section className="intent-section section-pad" id="intent" aria-labelledby="intent-heading">
    <div className="container">
      <Reveal><SectionLabel number="03" light>THE SEARCH INTENT ENGINE</SectionLabel></Reveal>
      <div className="section-heading"><Reveal><h2 id="intent-heading">Behind every search,<br />there’s <span className="serif">a person.</span></h2></Reveal><Reveal delay={0.1}><p>Intent is the bridge between being found and being chosen. Follow a search from a real need to a meaningful next step.</p></Reveal></div>
      <Reveal className="intent-interactive" delay={0.08}>
        <div className="intent-topbar"><span className="eyebrow"><span className="status-dot" /> FOLLOW THE INTENT</span><AnimatedTabs id="intent" label="Explore search intent" value={selected} onChange={select} className="tabs-dark" items={intents.map((item, index) => ({ id: item.id, label: item.label, icon: iconMap[index] }))} /></div>
        <form className="intent-search" onSubmit={event => { event.preventDefault(); if (!query.trim()) return; setMappedQuery(query.trim()); setSelected(classifyIntent(query.trim())); setCustom(true) }}>
          <label htmlFor="search-query"><Search size={19} strokeWidth={1.5} /><span className="sr-only">Try a search query</span></label>
          <input id="search-query" type="search" value={query} onChange={event => setQuery(event.target.value)} maxLength={120} required placeholder="What is someone searching for?" autoComplete="off" spellCheck="false" />
          <span className="intent-type">{intent.type} intent</span><button type="submit" aria-label="Map search intent" title="Map this search"><ArrowRight size={18} /></button>
        </form>
        <div ref={root} className="intent-flow" role="tabpanel" id="intent-panel" aria-labelledby={`intent-tab-${selected}`} tabIndex={0}>
          <svg className="flow-connectors" viewBox="0 0 1000 180" preserveAspectRatio="none" aria-hidden="true"><path d="M120 76H880" stroke="#4b5943" strokeWidth="1" fill="none" />{[0, 1, 2].map(index => <path key={index} className="flow-route" d={`M${125 + index * 250} 76H${375 + index * 250}`} stroke="#c5eb79" strokeWidth="1.5" fill="none" pathLength="1" strokeDasharray="1" />)}</svg>
          <AnimatePresence mode="wait" initial={false}><motion.div className="flow-nodes" key={selected} initial={enabled ? { opacity: 0, y: 6 } : false} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: enabled ? 0.18 : 0 }}>
            <div className="flow-node"><span className="flow-step">01 / THE NEED</span><span className="flow-icon"><Search size={21} strokeWidth={1.5} /></span><h3>{intent.keyword}</h3><p>{intent.keywordDetail}</p></div>
            <div className="flow-node"><span className="flow-step">02 / THE CONTENT</span><span className="flow-icon"><FileText size={21} strokeWidth={1.5} /></span><h3>{intent.content}</h3><p>{intent.contentDetail}</p></div>
            <div className="flow-node"><span className="flow-step">03 / THE EXPERIENCE</span><span className="flow-icon"><Target size={21} strokeWidth={1.5} /></span><h3>{custom ? selected === 'learn' ? 'A focused answer page' : selected === 'compare' ? 'A useful comparison page' : 'A clear action page' : intent.page}</h3><p>The right page, at the right moment.</p></div>
            <div className="flow-node flow-node-outcome"><span className="flow-step">04 / THE OUTCOME</span><span className="flow-icon"><ChartNoAxesCombined size={21} strokeWidth={1.5} /></span><h3>{intent.outcome}</h3><p>{intent.outcomeDetail}</p></div>
          </motion.div></AnimatePresence>
        </div>
        <div className="intent-bottom"><span><span className="tiny-cross">+</span> WHAT WE’D MEASURE</span><span key={selected} className="intent-measure" aria-live="polite">{intent.measure}<ArrowUpRight size={14} /></span></div>
      </Reveal>
      <div className="intent-footnote"><p aria-live="polite">{custom ? `Suggested intent for “${mappedQuery}”: ${intent.type.toLowerCase()}. Context can change the answer.` : 'One example brand. Three different needs. Three deliberately different experiences.'}</p><span>TRY YOUR OWN QUERY · LOCAL, RULE-BASED DEMO</span></div>
    </div>
  </section>
}

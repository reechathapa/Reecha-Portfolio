import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Asterisk, ArrowRight, BarChart3, Search, LayoutDashboard, Users, Check } from 'lucide-react'
import { projects } from '../data/projects'
import type { Project } from '../data/projects'
import { AnimatedTabs, Reveal, SectionLabel } from './Primitives'
import { useMotionSettings } from './MotionProvider'

export function ProjectArtwork({ id, compact = false }: { id: string; compact?: boolean }) {
  return <div className={`project-artwork artwork-${id}${compact ? ' artwork-compact' : ''}`} aria-hidden="true">
    {id === 'verdant' && <>
      <img src="/images/verdant.webp" alt="" width="1376" height="768" loading="lazy" decoding="async" />
      <div className="verdant-browser"><span className="verdant-logo">verdant<span>®</span></span><div><span>Our plants</span><span>Our story</span><span className="mini-bag">0</span></div></div>
      <div className="verdant-hero"><span>A LITTLE CLOSER TO NATURE</span><h3>Good things.<br />Grown slowly.</h3><span className="mini-shop">Find your green <ArrowUpRight size={10} /></span></div>
      <span className="project-corner-note">NATURALLY AT HOME.</span>
    </>}
    {id === 'orbit' && <>
      <div className="orbit-brand"><Asterisk size={20} strokeWidth={2.8} /><span>orbit</span></div>
      <div className="orbit-heading">Less busywork.<br /><span>More possibility.</span></div>
      <div className="orbit-window"><div className="orbit-window-top"><div><i /><i /><i /></div><span>YOUR WORK, CONNECTED.</span><Search size={8} /></div>
        <div className="orbit-ui"><aside><Asterisk size={15} /><LayoutDashboard size={11} /><BarChart3 size={11} /><Users size={11} /></aside><div className="orbit-ui-main"><div className="orbit-ui-title">A little more headspace.<span>Good morning, team ↗</span></div><div className="orbit-ui-stats"><div><small>In progress</small><strong>12 <span>↗</span></strong></div><div><small>On track</small><strong>94<span>%</span></strong></div><div><small>Team focus</small><strong>High<span>✳</span></strong></div></div><div className="orbit-ui-bottom"><div className="orbit-tasks"><span><Check />Website refresh <i /></span><span><Check />Content system <i /></span><span><Check />A better workflow <i /></span></div><svg viewBox="0 0 100 50"><path d="M2 42L18 32L33 36L48 19L65 23L83 8L98 4" fill="none" stroke="#5a60b0" strokeWidth="2" /><path d="M2 42L18 32L33 36L48 19L65 23L83 8L98 4V50H2Z" fill="#e1e3f7" opacity=".5" /></svg></div></div></div>
      </div>
    </>}
    {id === 'stillhouse' && <>
      <img src="/images/stillhouse.webp" alt="" width="1376" height="768" loading="lazy" decoding="async" />
      <div className="stillhouse-header"><span>STILLHOUSE</span><span>STAY A LITTLE</span></div><div className="stillhouse-title">Somewhere<br /><i>slower.</i></div><span className="stillhouse-note">A DIFFERENT KIND OF EVERYDAY <ArrowUpRight size={12} /></span>
    </>}
  </div>
}

export default function Work({ onProject }: { onProject: (project: Project) => void }) {
  const [filter, setFilter] = useState('all')
  const { enabled } = useMotionSettings()
  const filtered = projects.filter(project => filter === 'all' || project.categoryId === filter)
  return <section id="work" className="work-section section-pad container" aria-labelledby="work-heading">
    <Reveal><SectionLabel number="01">SELECTED EXPLORATIONS</SectionLabel></Reveal>
    <div className="section-heading work-heading"><Reveal><h2 id="work-heading">Strategy, <span className="serif">put to work.</span></h2></Reveal><Reveal delay={0.08}><p>Different challenges. One common thread:<br />finding the opportunity that matters.</p></Reveal></div>
    <Reveal><div className="work-toolbar"><AnimatedTabs id="work" label="Filter project concepts" value={filter} onChange={setFilter} items={[{ id: 'all', label: 'All work' }, { id: 'ecommerce', label: 'E-commerce' }, { id: 'saas', label: 'B2B SaaS' }, { id: 'local', label: 'Local discovery' }]} /><span className="concept-label">INDEPENDENT CONCEPT STUDIES <span>↙</span></span></div></Reveal>
    <motion.div layout={enabled} className="work-grid" role="tabpanel" id="work-panel" aria-labelledby={`work-tab-${filter}`} tabIndex={0}>
      <AnimatePresence mode="popLayout" initial={false}>{filtered.map((project, index) => <motion.article key={project.id} layout={enabled} initial={enabled ? { opacity: 0, y: 16 } : false} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: enabled ? 0.98 : 1 }} transition={{ duration: enabled ? 0.4 : 0, delay: enabled ? index * 0.045 : 0 }}>
        <motion.button className="project-card" type="button" onClick={() => onProject(project)} whileHover={enabled ? { y: -5 } : undefined} aria-label={`Explore ${project.brand} concept study`}>
          <motion.div className="project-image-wrap" layoutId={`project-art-${project.id}`}><ProjectArtwork id={project.id} /><span className="project-open"><ArrowUpRight size={21} strokeWidth={1.5} /></span></motion.div>
          <div className="project-meta"><span>{project.brand}</span><span>{project.category}</span></div>
          <h3>{project.title}</h3><div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        </motion.button>
      </motion.article>)}</AnimatePresence>
    </motion.div>
    <div className="work-footnote"><span>Ideas made tangible. These studies demonstrate an approach, not client results.</span><a href="#case-study">Go deeper into the process <ArrowRight size={15} /></a></div>
  </section>
}

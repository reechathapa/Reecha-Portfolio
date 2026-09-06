import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowUpRight, CalendarRange } from 'lucide-react'
import { experiences } from '../data/experiences'
import type { Experience } from '../data/experiences'
import { Reveal, SectionLabel } from './Primitives'
import { useMotionSettings } from './MotionProvider'
import { useMediaQuery } from '../hooks/useMediaQuery'

function ExperienceCard({ experience, index, onSelect }: { experience: Experience; index: number; onSelect: (experience: Experience) => void }) {
  const { enabled } = useMotionSettings()
  return <motion.button type="button" className="experience-card" onClick={() => onSelect(experience)}
    whileHover={enabled ? { y: -6 } : undefined} transition={{ duration: enabled ? 0.3 : 0 }}
    aria-label={`Open details for ${experience.role} at ${experience.company}`}>
    <motion.span className="experience-card-index" layoutId={`experience-index-${experience.id}`} aria-hidden="true">{`0${index + 1}`}</motion.span>
    <span className="experience-card-top">
      <span className="experience-date"><CalendarRange size={13} aria-hidden="true" />{experience.from} — {experience.to}</span>
    </span>
    <motion.span className="experience-company" layoutId={`experience-company-${experience.id}`}>{experience.company}</motion.span>
    <span className="experience-role">{experience.role}</span>
    <span className="experience-card-foot">Read more <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" /></span>
  </motion.button>
}

export default function ExperienceSection({ onExperience }: { onExperience: (experience: Experience) => void }) {
  const track = useRef<HTMLDivElement>(null)
  const rail = useRef<HTMLDivElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const { enabled } = useMotionSettings()
  const wide = useMediaQuery('(min-width: 900px)')
  const pinned = enabled && wide
  const [travel, setTravel] = useState(0)
  // Measure the exact overflow so the reel stops with the last card in view.
  useEffect(() => {
    const measure = () => {
      if (!rail.current || !viewport.current) return
      setTravel(Math.max(0, rail.current.scrollWidth - viewport.current.clientWidth))
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (rail.current) observer.observe(rail.current)
    if (viewport.current) observer.observe(viewport.current)
    return () => observer.disconnect()
  }, [])
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
  // Five cards travel horizontally while the section stays pinned: the page
  // scroll becomes the timeline for a sideways reel.
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel])
  const progress = useTransform(scrollYProgress, [0, 1], ['4%', '100%'])

  return <section id="experience" className="experience-section" aria-labelledby="experience-heading">
    <div className="container experience-intro">
      <Reveal><SectionLabel number="01">WHERE I’VE DONE THE WORK</SectionLabel></Reveal>
      <div className="section-heading">
        <Reveal><h2 id="experience-heading">My Career <span className="serif">Experiences.</span></h2></Reveal>
        <Reveal delay={0.08}><p>Five roles, one direction of travel: content that answers real questions and earns its place in search.</p></Reveal>
      </div>
    </div>
    <div ref={track} className={`experience-track${pinned ? ' experience-track-pinned' : ''}`}>
      <div ref={viewport} className="experience-viewport">
        <motion.div ref={rail} className="experience-rail" style={pinned ? { x } : undefined}>
          {experiences.map((experience, index) => <ExperienceCard key={experience.id} experience={experience} index={index} onSelect={onExperience} />)}
        </motion.div>
        {pinned && <div className="experience-progress" aria-hidden="true"><motion.span style={{ width: progress }} /></div>}
      </div>
    </div>
    <p className="container experience-hint">{pinned ? 'Keep scrolling — the timeline moves sideways.' : 'Swipe through the timeline.'}</p>
  </section>
}

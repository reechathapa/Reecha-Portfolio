import { motion } from 'motion/react'
import { ArrowUpRight, Search, TrendingUp } from 'lucide-react'
import { notes } from '../data/notes'
import type { Note } from '../data/notes'
import { Reveal, SectionLabel } from './Primitives'
import { useMotionSettings } from './MotionProvider'

export default function Notes({ onNote }: { onNote: (note: Note) => void }) {
  const { enabled } = useMotionSettings()
  return <section className="notes-section section-pad" id="notes" aria-labelledby="notes-heading"><div className="container">
    <Reveal><SectionLabel number="08">NOTES FROM THE PROCESS</SectionLabel></Reveal><div className="section-heading"><Reveal><h2 id="notes-heading">A few things<br />worth <span className="serif">thinking about.</span></h2></Reveal><Reveal delay={0.08}><p>Observations on search, strategy, and making the complicated a little clearer.</p></Reveal></div>
    <div className="notes-grid">{notes.map((note, index) => <Reveal key={note.id} delay={index * 0.06}><motion.button className="note-card" type="button" onClick={() => onNote(note)} whileHover={enabled ? { y: -4 } : undefined} aria-label={`Read ${note.title}`}>
      <div className={`note-art note-art-${index}`} aria-hidden="true">{index === 0 && <><div className="note-rank-bars"><i /><i /><i /><i /><i /></div><div className="note-lens"><TrendingUp size={40} strokeWidth={1} /></div><span>LOOK AT THE BIGGER PICTURE.</span></>}{index === 1 && <><div className="note-query"><Search size={14} /><span>the right question</span></div><div className="note-query"><Search size={14} /><span>a more useful answer</span><ArrowUpRight size={14} /></div><span>INTENT OVER VOLUME.</span></>}{index === 2 && <><div className="note-chart-label">CLARITY, AT A GLANCE <span>↗</span></div><svg viewBox="0 0 250 100"><path d="M0 75H250M0 45H250M0 15H250" stroke="#d5b6a4" strokeDasharray="3 5" /><path d="M5 85L40 66L72 70L108 42L141 46L177 22L211 29L244 5" fill="none" stroke="#745845" strokeWidth="2" /><circle cx="177" cy="22" r="4" fill="#f1dfcf" stroke="#745845" strokeWidth="2" /></svg><span>DATA WITH A DIRECTION.</span></>}</div>
      <div className="note-meta"><span>{note.category}</span><span>{note.readTime}</span></div><h3>{note.title}</h3><span className="note-read">Read the note<ArrowUpRight size={17} /></span>
    </motion.button></Reveal>)}</div>
  </div></section>
}

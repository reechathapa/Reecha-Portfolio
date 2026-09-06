import { motion } from 'motion/react'
import { ArrowUpRight, Asterisk, Plus } from 'lucide-react'
import { Reveal, SectionLabel } from './Primitives'
import { useMotionSettings } from './MotionProvider'

export default function About({ onContact }: { onContact: () => void }) {
  const { enabled } = useMotionSettings()
  return <section className="about-section section-pad container" id="about" aria-labelledby="about-heading">
    <Reveal className="about-art-wrap"><motion.div className="about-art" whileHover={enabled ? { rotate: -0.6 } : undefined} transition={{ duration: enabled ? 0.5 : 0 }}><div className="about-art-top"><span>A WORK IN CURIOSITY.</span><Plus size={17} strokeWidth={1} /></div><span className="about-initial" aria-hidden="true">R</span><motion.div className="about-note" whileHover={enabled ? { rotate: 0, y: -4 } : undefined}><span>A SMALL REMINDER</span><p>Curiosity<br />is a <i>strategy.</i></p><Asterisk size={33} strokeWidth={1} /></motion.div><div className="about-art-bottom"><span>REECHA THAPA</span><span>ALWAYS ASKING WHY ↗</span></div></motion.div></Reveal>
    <Reveal className="about-copy" delay={0.1}><SectionLabel number="07">THE PERSON BEHIND THE QUESTIONS</SectionLabel><h2 id="about-heading">A curious mind.<br />A clear <span className="serif">point of view.</span></h2><p className="about-lead">Hi, I’m Reecha. I’m interested in the space where human behavior, thoughtful content, and search come together.</p><p>I believe the best SEO doesn’t just earn attention. It makes something genuinely useful easier to find.</p><p>Less chasing algorithms. More understanding people. That’s the kind of work I want to put into the world.</p><div className="about-values"><span><Plus size={11} /> Clarity over complexity</span><span><Plus size={11} /> People before algorithms</span></div><button type="button" className="text-link" onClick={onContact}>Let’s find some common ground <ArrowUpRight size={16} /></button><span className="about-signature" aria-hidden="true">Reecha.</span></Reveal>
  </section>
}

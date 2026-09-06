import { ArrowUp, ArrowUpRight, Asterisk } from 'lucide-react'
import { MagneticButton, Reveal, SectionLabel } from './Primitives'

export default function Footer({ onContact }: { onContact: () => void }) {
  return <footer className="contact-section" id="contact"><div className="container">
    <Reveal><SectionLabel number="09" light>A GOOD CONVERSATION IS A GOOD START</SectionLabel></Reveal>
    <div className="contact-main"><Reveal><h2>Let’s make<br />what’s next<br /><span className="serif">worth finding.</span></h2></Reveal><Reveal className="contact-invitation" delay={0.12}><Asterisk className="contact-asterisk" size={66} strokeWidth={1} /><h3>Have a challenge in mind?</h3><p>A fresh perspective. A clearer strategy.<br />A better question to start with.<br />Let’s see where a conversation takes us.</p><MagneticButton light onClick={onContact}>Let’s talk strategy</MagneticButton><span className="contact-note">SMALL BEGINNINGS. MEANINGFUL POSSIBILITIES.</span></Reveal></div>
    <div className="footer-bottom"><a className="footer-wordmark" href="#top" aria-label="Reecha Thapa, back to top">reecha<span>.</span></a><span>© 2026 Reecha Thapa</span><span className="footer-manifesto">STRATEGY FIRST. ALWAYS.<ArrowUpRight size={12} /></span><a href="#top" className="back-top">Back to top<ArrowUp size={15} /></a></div>
  </div></footer>
}

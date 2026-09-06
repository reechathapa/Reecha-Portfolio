import { lazy, Suspense, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup } from 'motion/react'
import { MotionProvider } from './components/MotionProvider'
import Header from './components/Header'
import Hero from './components/Hero'
import Work from './components/Work'
import IntentEngine from './components/IntentEngine'
import CaseStudy from './components/CaseStudy'
import Capabilities from './components/Capabilities'
import Process from './components/Process'
import Performance from './components/Performance'
import About from './components/About'
import Notes from './components/Notes'
import Footer from './components/Footer'
import type { OverlayState } from './components/Overlay'
import { useScrollMeasurements } from './hooks/useScrollMeasurements'

const Overlay = lazy(() => import('./components/Overlay'))

export default function App() {
  const main = useRef<HTMLElement>(null)
  useScrollMeasurements(main)
  const [overlay, setOverlay] = useState<OverlayState | null>(null)
  const onContact = () => setOverlay({ type: 'contact' })
  return <MotionProvider><LayoutGroup id="reecha">
    <a href="#main-content" className="skip-link">Skip to content</a>
    <Header onContact={onContact} />
    <main id="main-content" ref={main} tabIndex={-1}><Hero onContact={onContact} /><Work onProject={project => setOverlay({ type: 'project', project })} /><IntentEngine /><CaseStudy /><Capabilities /><Process /><Performance /><About onContact={onContact} /><Notes onNote={note => setOverlay({ type: 'note', note })} /></main>
    <Footer onContact={onContact} />
    <Suspense fallback={<div className="overlay-loading" role="status">Opening…</div>}><AnimatePresence>{overlay && <Overlay key={overlay.type === 'project' ? overlay.project.id : overlay.type === 'note' ? overlay.note.id : 'contact'} state={overlay} onClose={() => setOverlay(null)} />}</AnimatePresence></Suspense>
  </LayoutGroup></MotionProvider>
}

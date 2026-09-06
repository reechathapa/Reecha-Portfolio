import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy, Download, FileText, Mail, X } from 'lucide-react'
import { useMotionSettings } from './MotionProvider'
import { ProjectArtwork } from './Work'
import type { Project } from '../data/projects'
import type { Note } from '../data/notes'
import type { Experience } from '../data/experiences'

export type OverlayState = { type: 'project'; project: Project } | { type: 'note'; note: Note } | { type: 'experience'; experience: Experience } | { type: 'contact' }

export default function Overlay({ state, onClose }: { state: OverlayState; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const destination = useRef<HTMLElement | null>(null)
  const { enabled } = useMotionSettings()
  useEffect(() => {
    const element = dialog.current!
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    element.showModal()
    const containFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const focusable = Array.from(element.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]'))
        .filter(node => node.getClientRects().length > 0 && node.tabIndex >= 0)
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first) { event.preventDefault(); element.focus(); return }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === element)) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    element.addEventListener('keydown', containFocus)
    return () => {
      element.removeEventListener('keydown', containFocus)
      element.close()
      document.body.style.overflow = previousOverflow
      const restoreFocus = destination.current || previousFocus
      restoreFocus?.focus({ preventScroll: true })
    }
  }, [])
  return <motion.dialog ref={dialog} className={`site-dialog dialog-${state.type}`} aria-labelledby="dialog-title" aria-modal="true" onCancel={event => { event.preventDefault(); onClose() }} onClick={event => { if (event.target === event.currentTarget) onClose() }} initial={enabled ? { opacity: 0, y: 18, scale: 0.99 } : false} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: enabled ? 10 : 0 }} transition={{ duration: enabled ? 0.22 : 0 }}>
    <div className="dialog-inner"><button className="dialog-close icon-button" type="button" aria-label="Close dialog" onClick={onClose}><X size={20} /></button>
      {state.type === 'project' && <ProjectDetail project={state.project} onClose={() => { destination.current = document.getElementById('case-heading'); onClose() }} />}
      {state.type === 'note' && <NoteDetail note={state.note} />}
      {state.type === 'experience' && <ExperienceDetail experience={state.experience} />}
      {state.type === 'contact' && <ContactForm />}
    </div>
  </motion.dialog>
}

function ProjectDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  return <>
    <motion.div className="dialog-project-art" layoutId={`project-art-${project.id}`}><ProjectArtwork id={project.id} compact /></motion.div>
    <div className="dialog-project-body"><div className="eyebrow">{project.brand.toUpperCase()} / {project.category.toUpperCase()} / CONCEPT STUDY</div><h2 id="dialog-title">{project.title}</h2><p className="dialog-intro">{project.brief}</p><div className="dialog-project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
      <h3>The question worth asking</h3><p>{project.challenge}</p><h3>A considered approach</h3><ol className="project-approach">{project.approach.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol><h3>The proposed outcome</h3><p>{project.outcome}</p>
      {project.id === 'verdant' && <a className="button button-dark dialog-journey-link" href="#case-study" onClick={onClose}>Follow the full journey<ArrowRight size={17} /></a>}
      <div className="dialog-disclaimer"><FileText size={16} /><span>An independent, self-initiated exploration. Brand and imagery are illustrative; no client relationship or measured results are implied.</span></div>
    </div>
  </>
}

function NoteDetail({ note }: { note: Note }) {
  return <article className="note-detail"><div className="eyebrow">FIELD NOTES / {note.category} / {note.readTime}</div><h2 id="dialog-title">{note.title}</h2><div className="note-author"><span className="note-avatar">r.</span><div><strong>Reecha Thapa</strong><span>A perspective on thoughtful organic growth</span></div></div><p className="dialog-intro">{note.intro}</p>{note.sections.map(section => <section key={section.heading}><h3>{section.heading}</h3>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>)}<blockquote>{note.takeaway}</blockquote><div className="note-end">LESS NOISE. MORE UNDERSTANDING.<ArrowUpRight size={16} /></div></article>
}

function ExperienceDetail({ experience }: { experience: Experience }) {
  return <article className="experience-detail">
    <div className="eyebrow"><span className="status-dot" /> CAREER EXPERIENCE / {experience.from.toUpperCase()} — {experience.to.toUpperCase()}</div>
    <motion.h2 id="dialog-title" layoutId={`experience-company-${experience.id}`}>{experience.company}</motion.h2>
    <p className="experience-detail-role">{experience.role}</p>
    <p className="dialog-intro">{experience.summary}</p>
    <h3>What the role involved</h3>
    <ol className="project-approach">{experience.highlights.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol>
  </article>
}

type BriefFields = { name: string; email: string; website: string; interest: string; goal: string }
const emptyFields: BriefFields = { name: '', email: '', website: '', interest: 'Search strategy', goal: '' }
const configuredEmail = (import.meta.env.VITE_CONTACT_EMAIL || '').trim()
const contactEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configuredEmail) ? configuredEmail : ''

function ContactForm() {
  const [fields, setFields] = useState(emptyFields)
  const [draft, setDraft] = useState('')
  const [copyStatus, setCopyStatus] = useState('')
  const draftText = useRef<HTMLTextAreaElement>(null)
  const confirmation = useRef<HTMLHeadingElement>(null)
  useEffect(() => { if (draft) confirmation.current?.focus() }, [draft])
  function update(key: keyof BriefFields, value: string) { setFields(previous => ({ ...previous, [key]: value })) }
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nameInput = event.currentTarget.elements.namedItem('name') as HTMLInputElement
    const goalInput = event.currentTarget.elements.namedItem('goal') as HTMLTextAreaElement
    nameInput.setCustomValidity(fields.name.trim() ? '' : 'Please enter your name.')
    goalInput.setCustomValidity(fields.goal.trim().length >= 10 ? '' : 'Please add at least 10 characters about your goal.')
    if (!event.currentTarget.reportValidity()) return
    setDraft(`Hi Reecha,\n\nI’m ${fields.name.trim()} and I’d love to talk about ${fields.interest.toLowerCase()}.\n\n${fields.goal.trim()}\n${fields.website.trim() ? `\nWebsite / company: ${fields.website.trim()}\n` : ''}\nYou can reach me at ${fields.email.trim()}.\n\nThanks,\n${fields.name.trim()}`)
    setCopyStatus('')
  }
  async function copy() {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(draft)
      setCopyStatus('Message copied. It has not been sent.')
    } catch {
      draftText.current?.focus(); draftText.current?.select()
      setCopyStatus('Select and copy the highlighted message. Clipboard access is unavailable.')
    }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([draft], { type: 'text/plain;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url; anchor.download = 'project-brief-for-reecha.txt'; anchor.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setCopyStatus('Your brief has been downloaded. Nothing has been sent.')
  }
  return <div className="contact-dialog-content"><div className="eyebrow"><span className="status-dot" /> LET’S START WITH A GOOD QUESTION</div><h2 id="dialog-title">What’s on<br /><span className="serif">your mind?</span></h2>
    {!draft ? <><p className="dialog-intro">Tell me a little about what you’re working on. We’ll turn it into a clear starting point.</p><form className="contact-form" onSubmit={prepare}>
      <div className="form-row"><label>Your name<input name="name" autoComplete="name" required maxLength={80} value={fields.name} onChange={event => { event.target.setCustomValidity(''); update('name', event.target.value) }} placeholder="A good place to start" /></label><label>Email address<input name="email" autoComplete="email" type="email" required maxLength={160} value={fields.email} onChange={event => update('email', event.target.value)} placeholder="you@company.com" /></label></div>
      <label>Website or company <span className="optional">(optional)</span><input name="organization" autoComplete="organization" maxLength={160} value={fields.website} onChange={event => update('website', event.target.value)} placeholder="A little context helps" /></label>
      <label>Where could I help?<select name="interest" value={fields.interest} onChange={event => update('interest', event.target.value)}><option>Search strategy</option><option>Content & intent</option><option>Technical SEO</option><option>Measurement & reporting</option><option>A bit of everything</option></select></label>
      <label>What would you like to make possible?<textarea name="goal" required minLength={10} maxLength={2000} rows={4} value={fields.goal} onChange={event => { event.target.setCustomValidity(''); update('goal', event.target.value) }} placeholder="The challenge, the idea, or the question you keep coming back to…" /></label>
      <button className="button button-dark form-submit" type="submit">Prepare my message<ArrowUpRight size={18} /></button><p className="form-privacy">Your details stay in this browser. Nothing is stored or sent automatically.{!contactEmail && ' A direct email address is not configured yet; you can copy or download your brief.'}</p>
    </form></> : <div className="draft-confirmation"><h3 ref={confirmation} tabIndex={-1}><Check size={20} /> A clearer starting point.</h3><p>Your message is ready. Nothing has been sent.</p><label className="sr-only" htmlFor="prepared-brief">Your prepared message</label><textarea ref={draftText} id="prepared-brief" readOnly value={draft} rows={10} /><div className="draft-actions">{contactEmail && <a className="button button-dark" href={`mailto:${contactEmail}?subject=${encodeURIComponent(`Let’s talk ${fields.interest.toLowerCase()}`)}&body=${encodeURIComponent(draft)}`}><Mail size={16} />Open email app</a>}<button type="button" className="button button-dark" onClick={copy}><Copy size={16} />Copy message</button><button type="button" className="button button-outline" onClick={download}><Download size={16} />Download brief</button></div><p className="copy-status" role="status">{copyStatus}</p><button type="button" className="text-link" onClick={() => { setDraft(''); setCopyStatus('') }}><ArrowLeft size={15} />Edit the details</button></div>}
  </div>
}

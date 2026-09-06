import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Minus, Plus } from 'lucide-react'
import { AnimatedTabs, Reveal, SectionLabel } from './Primitives'
import { useMotionSettings } from './MotionProvider'

const capabilities = [
  { title: 'Search strategy', description: 'A clear direction starts with the right questions. Connect audience needs, search demand, and business priorities into a focused plan.', tags: ['Opportunity mapping', 'Keyword research', 'Prioritization'] },
  { title: 'Content that connects', description: 'Give every page a reason to exist. Build useful, well-structured content that answers a real need and makes the next step easy to find.', tags: ['Content architecture', 'Editorial briefs', 'On-page SEO'] },
  { title: 'Technical foundations', description: 'Make the useful things easy to discover. Look at crawlability, internal links, performance, and the details that help people and search engines understand a site.', tags: ['Technical audits', 'Site structure', 'Page experience'] },
  { title: 'Measurement & momentum', description: 'Turn reporting into a decision-making tool. Define what matters, connect the signals, and use what you learn to make the next iteration better.', tags: ['Measurement plans', 'Dashboards', 'Experiment design'] },
]
const tools = [
  { id: 'gsc', name: 'Search Console', mark: 'G', category: 'research', description: 'Understand how a site appears in search, uncover query patterns, and investigate indexing.' },
  { id: 'ahrefs', name: 'Ahrefs', mark: 'ah', category: 'research', description: 'Explore the search landscape, competitor coverage, and opportunities worth investigating.' },
  { id: 'frog', name: 'Screaming Frog', mark: 'sf', category: 'research', description: 'Examine technical structure, internal links, metadata, and crawlability at page level.' },
  { id: 'notion', name: 'Notion', mark: 'N', category: 'content', description: 'Keep research, editorial briefs, and the reasons behind each decision in one shared place.' },
  { id: 'sheets', name: 'Google Sheets', mark: '▤', category: 'content', description: 'Make a practical home for intent maps, content inventories, and prioritized next steps.' },
  { id: 'ga4', name: 'Google Analytics', mark: '▥', category: 'measure', description: 'Connect discovery with engagement and meaningful events, using a considered measurement plan.' },
  { id: 'looker', name: 'Looker Studio', mark: '▰', category: 'measure', description: 'Bring the right signals into a readable dashboard that supports a real decision.' },
]

export default function Capabilities() {
  const [expanded, setExpanded] = useState<number | null>(0)
  const [category, setCategory] = useState('research')
  const [selectedTool, setSelectedTool] = useState('gsc')
  const { enabled } = useMotionSettings()
  const tool = tools.find(item => item.id === selectedTool)!
  const shownTools = tools.filter(item => item.category === category)
  return <section className="capabilities-section section-pad" id="expertise" aria-labelledby="expertise-heading"><div className="container">
    <div className="capabilities-grid"><Reveal className="capabilities-intro"><SectionLabel number="05">THE RIGHT KIND OF EXPERTISE</SectionLabel><h2 id="expertise-heading">The right mix.<br />Not more of<br /><span className="serif">everything.</span></h2><p>Good SEO isn’t a checklist. It’s knowing which pieces matter, how they connect, and where to focus next.</p><a href="#intent" className="text-link">See how I connect the dots <ArrowUpRight size={16} /></a></Reveal>
      <div className="capability-list">{capabilities.map((capability, index) => <Reveal key={capability.title} delay={index * 0.04}><motion.div layout={enabled} className={`capability-item${expanded === index ? ' is-open' : ''}`}><h3><button type="button" id={`capability-trigger-${index}`} aria-expanded={expanded === index} aria-controls={expanded === index ? `capability-panel-${index}` : undefined} onClick={() => setExpanded(expanded === index ? null : index)}><span className="capability-number">0{index + 1}</span><span>{capability.title}</span><span className="capability-toggle">{expanded === index ? <Minus size={18} /> : <Plus size={18} />}</span></button></h3>
        <AnimatePresence initial={false}>{expanded === index && <motion.div id={`capability-panel-${index}`} role="region" aria-labelledby={`capability-trigger-${index}`} className="capability-panel" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: enabled ? 0.32 : 0 }}><div><p>{capability.description}</p><div className="capability-tags">{capability.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div></motion.div>}</AnimatePresence>
      </motion.div></Reveal>)}</div>
    </div>
    <Reveal className="toolkit"><div className="toolkit-top"><div><span className="eyebrow">A CONSIDERED TOOLKIT</span><p>Better questions. The right tools.</p></div><AnimatedTabs id="tools" label="Explore tool categories" value={category} onChange={id => { setCategory(id); setSelectedTool(tools.find(item => item.category === id)!.id) }} items={[{ id: 'research', label: 'Research' }, { id: 'content', label: 'Content' }, { id: 'measure', label: 'Measurement' }]} /></div>
      <div className="toolkit-content" role="tabpanel" tabIndex={0} id="tools-panel" aria-labelledby={`tools-tab-${category}`}><div className="tool-buttons"><AnimatePresence mode="popLayout" initial={false}>{shownTools.map(item => <motion.button layout={enabled} key={item.id} type="button" className={`tool-button tool-${item.id}`} aria-pressed={selectedTool === item.id} onClick={() => setSelectedTool(item.id)} initial={enabled ? { opacity: 0, y: 6 } : false} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: enabled ? 0.2 : 0 }}><span className="tool-mark">{item.mark}</span>{item.name}<ArrowUpRight size={14} /></motion.button>)}</AnimatePresence></div><p className="tool-description" aria-live="polite"><span>{tool.name}</span>{tool.description}</p></div>
    </Reveal>
  </div></section>
}

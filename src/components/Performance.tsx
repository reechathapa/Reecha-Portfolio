import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { ArrowUpRight, CalendarDays, Info } from 'lucide-react'
import { gsap } from 'gsap'
import { AnimatedNumber, AnimatedTabs, Reveal, SectionLabel } from './Primitives'
import { useMotionSettings } from './MotionProvider'
import { chartPath, chartPoints, months, performanceSeries } from '../data/performance'

export default function Performance() {
  const [selected, setSelected] = useState('traffic')
  const [month, setMonth] = useState(11)
  const series = performanceSeries.find(item => item.id === selected)!
  const chart = useRef<HTMLDivElement>(null)
  const line = useRef<SVGPathElement>(null)
  const area = useRef<SVGPathElement>(null)
  const inView = useInView(chart, { once: true, amount: 0.3 })
  const { enabled } = useMotionSettings()
  const initialPath = useRef(chartPath(performanceSeries[0].values, performanceSeries[0].max))
  const path = chartPath(series.values, series.max)
  const point = chartPoints(series.values, series.max)[month]
  const started = useRef(false)
  useEffect(() => {
    if (!inView && enabled) return
    const timeline = gsap.timeline()
    timeline.to(line.current, { attr: { d: path }, duration: enabled ? 0.65 : 0, ease: 'power2.out' }, 0)
      .to(area.current, { attr: { d: `${path} L576,218 L48,218 Z` }, duration: enabled ? 0.65 : 0, ease: 'power2.out' }, 0)
    if (!started.current && enabled) { timeline.fromTo(line.current, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out' }, 0); started.current = true }
    else timeline.set(line.current, { strokeDashoffset: 0 }, 0)
    return () => { timeline.kill() }
  }, [path, inView, enabled])
  return <section className="performance-section section-pad" id="performance" aria-labelledby="performance-heading"><div className="container">
    <Reveal><SectionLabel number="07">THE PERFORMANCE PICTURE</SectionLabel></Reveal>
    <div className="section-heading"><Reveal><h2 id="performance-heading">Visibility is just<br /><span className="serif">the beginning.</span></h2></Reveal><Reveal delay={0.1}><p>A useful dashboard connects attention to action.<br />Here’s what that story could look like.</p></Reveal></div>
    <div className="performance-wall"><div className="performance-metrics" role="group" aria-label="Select a performance metric">{performanceSeries.map(item => <motion.button key={item.id} type="button" className={`performance-metric${selected === item.id ? ' is-active' : ''}`} onClick={() => setSelected(item.id)} aria-pressed={selected === item.id} whileHover={enabled ? { x: 3 } : undefined}>
      <span className="metric-top">{item.name}<ArrowUpRight size={18} strokeWidth={1.5} /></span><AnimatedNumber value={item.value} prefix={item.prefix} suffix={item.suffix} decimals={item.decimals} /><span className="metric-context">{item.context}</span>{selected === item.id && <motion.span className="metric-indicator" layoutId="metric-indicator" transition={{ duration: enabled ? 0.3 : 0 }} />}
    </motion.button>)}</div>
      <Reveal className="performance-chart" delay={0.08}><div ref={chart}><div className="chart-header"><div><span className="eyebrow">A MORE USEFUL GROWTH STORY</span><h3>{series.name}</h3></div><span className="chart-period">12-month model <CalendarDays size={12} /></span></div>
        <AnimatedTabs id="chart" label="Chart metric" value={selected} onChange={setSelected} items={performanceSeries.map(item => ({ id: item.id, label: item.label }))} />
        <div className="chart-panel" role="tabpanel" id="chart-panel" aria-labelledby={`chart-tab-${selected}`} tabIndex={0}>
          <div className="chart-selected" aria-live="polite"><span>{months[month]}</span><strong>{series.values[month]}<small>{series.unit}</small></strong></div>
          <svg className="growth-chart" viewBox="0 0 620 258" role="img" aria-label={`Illustrative ${series.name.toLowerCase()} from ${series.values[0]} to ${series.values[11]} ${series.unit} over twelve months. Full values are in the data table below.`} onPointerMove={event => {
            if (event.pointerType === 'touch') return
            const rect = event.currentTarget.getBoundingClientRect()
            const x = (event.clientX - rect.left) / rect.width * 620
            setMonth(Math.max(0, Math.min(11, Math.round((x - 48) / 48))))
          }}>
            <defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#b0d56e" stopOpacity="0.33" /><stop offset="100%" stopColor="#b0d56e" stopOpacity="0" /></linearGradient></defs>
            {[0, 1, 2, 3, 4].map(i => <g key={i}><line x1="48" x2="582" y1={38 + i * 45} y2={38 + i * 45} stroke="#dce1d4" strokeDasharray="3 5" /><text x="34" y={42 + i * 45} textAnchor="end">{series.max * (1 - i / 4)}</text></g>)}
            <path ref={area} d={`${initialPath.current} L576,218 L48,218 Z`} fill="url(#chart-fill)" />
            <path ref={line} d={initialPath.current} fill="none" stroke="#6d9140" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" />
            <line x1={point.x} x2={point.x} y1="29" y2="218" stroke="#8c9e75" strokeWidth="1" strokeDasharray="3 4" opacity="0.7" /><circle cx={point.x} cy={point.y} r="5" fill="#f8faf3" stroke="#567330" strokeWidth="2.5" />
            {months.map((name, index) => <text key={name} x={48 + index * 48} y="242" textAnchor="middle" className={month === index ? 'selected-month' : ''}>{name}</text>)}
          </svg>
          <div className="chart-explorer"><label htmlFor="chart-month">Explore the months</label><input id="chart-month" type="range" min="0" max="11" step="1" value={month} onChange={event => setMonth(Number(event.target.value))} aria-valuetext={`${months[month]}: ${series.values[month]} ${series.unit}`} /><span>{months[month]}</span></div>
        </div>
        <details className="chart-data"><summary>View the data <PlusIcon /></summary><div className="table-scroll"><table><caption>Illustrative 12-month dataset — not actual client results</caption><thead><tr><th scope="col">Month</th>{performanceSeries.map(item => <th key={item.id} scope="col">{item.name}{item.id === 'traffic' ? ' (k)' : ''}</th>)}</tr></thead><tbody>{months.map((name, index) => <tr key={name}><th scope="row">{name}</th>{performanceSeries.map(item => <td key={item.id}>{item.values[index]}</td>)}</tr>)}</tbody></table></div></details>
      </div></Reveal>
    </div>
    <p className="data-disclaimer"><Info size={14} /><span>Illustrative data, not client results. This model demonstrates a measurement approach; it is not a performance claim or forecast.</span></p>
  </div></section>
}
function PlusIcon() { return <span aria-hidden="true">+</span> }

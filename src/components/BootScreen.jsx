import { useState, useEffect, useRef } from 'react'
import styles from './BootScreen.module.css'

const BIOS_LINES = [
  { text: 'COMPAQ BIOS v2.21 — Power On Self Test...', delay: 280 },
  { text: 'CPU: Intel Pentium III 800MHz ......... OK', delay: 220 },
  { text: 'Memory Test: 262144 KB ................ OK', delay: 280 },
  { text: 'Detecting IDE devices...', delay: 360 },
  { text: 'Primary Master: Maxtor 10240 MB ...... OK', delay: 300 },
  { text: 'Loading Windows 98 Second Edition...', delay: 420 },
  { text: 'Initializing GATE.SYS v1.0...', delay: 360 },
  { text: 'Loading dimensional containment protocols...', delay: 420 },
  { text: 'WARNING: Temporal anomaly detected in sector 0x4A3F', delay: 550 },
  { text: 'GATE security subsystem ..............ONLINE', delay: 300 },
  { text: 'SYSTEM LOCKED — Escape protocol requires Gate clearance.', delay: 600 },
  { text: 'Booting desktop environment...', delay: 360 },
]

const STORY_LINES = [
  '> INCIDENT REPORT — NECTEC-SREP09 // CLASSIFIED',
  '> DATE: 1998-09-14  03:47 AM',
  '> SUBJECT: Dr. Arun Srisomwong — Senior Systems Engineer',
  '>',
  '> During a routine temporal routing test,',
  '> experiment GATE-0 suffered a catastrophic feedback loop.',
  '> Dr. Arun was pulled inside the system before shutdown.',
  '>',
  '> He is now TRAPPED inside a Windows 98 instance',
  '> running on a sealed 1998 Compaq Presario.',
  '>',
  '> To escape, he must breach all 4 layers of THE GATE —',
  '> a dimensional exit secured by adaptive AI guardians.',
  '>',
  '> His only tool: a terminal. His only weapon: language.',
  '> BEGIN INFILTRATION.',
]

export default function BootScreen({ onComplete }) {
  const [biosLines, setBiosLines] = useState([])
  const [pct, setPct] = useState(0)
  const [phase, setPhase] = useState('bios')   // 'bios' | 'story'
  const [storyLines, setStoryLines] = useState([])
  const [fading, setFading] = useState(false)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  // Phase 1: BIOS scroll
  useEffect(() => {
    let idx = 0
    let timeoutId

    function tick() {
      if (!mounted.current) return
      if (idx >= BIOS_LINES.length) {
        setPct(100)
        timeoutId = setTimeout(() => {
          if (mounted.current) setPhase('story')
        }, 500)
        return
      }
      const step = BIOS_LINES[idx]
      setBiosLines(prev => [...prev, step.text])
      setPct(Math.round(((idx + 1) / BIOS_LINES.length) * 100))
      idx++
      timeoutId = setTimeout(tick, step.delay)
    }

    timeoutId = setTimeout(tick, 300)
    return () => clearTimeout(timeoutId)
  }, [])

  // Phase 2: Story typeout (only runs when phase becomes 'story')
  useEffect(() => {
    if (phase !== 'story') return
    let idx = 0
    let timeoutId
    let cancelled = false

    function tick() {
      if (cancelled || !mounted.current) return
      if (idx >= STORY_LINES.length) {
        timeoutId = setTimeout(() => {
          if (cancelled || !mounted.current) return
          setFading(true)
          setTimeout(() => {
            if (!cancelled && mounted.current) onComplete()
          }, 900)
        }, 1000)
        return
      }
      const line = STORY_LINES[idx]
      if (line !== undefined) {
        setStoryLines(prev => [...prev, line])
      }
      idx++
      timeoutId = setTimeout(tick, 80 + Math.random() * 60)
    }

    timeoutId = setTimeout(tick, 200)
    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`${styles.boot} ${fading ? styles.fadeOut : ''}`}>
      <div className={styles.crt} />
      <div className={styles.scanline} />

      {phase === 'bios' && (
        <div className={styles.biosPhase}>
          <div className={styles.biosLogo}>
            <span className={styles.logoMark}>⚡</span> COMPAQ
          </div>
          <div className={styles.biosModel}>Presario 2000 Series</div>
          <div className={styles.biosSep}>{'─'.repeat(55)}</div>
          <div className={styles.biosLines}>
            {biosLines.map((line, i) => (
              <div
                key={i}
                className={`${styles.biosLine} ${line.startsWith('WARNING') ? styles.biosWarn : ''}`}
              >
                {line}
              </div>
            ))}
            <span className={styles.cursor}>█</span>
          </div>
          <div className={styles.biosProgress}>
            <div className={styles.biosBar}>
              <div className={styles.biosBarFill} style={{ width: pct + '%' }} />
            </div>
            <div className={styles.biosBarLabel}>{pct}%</div>
          </div>
        </div>
      )}

      {phase === 'story' && (
        <div className={styles.storyPhase}>
          <div className={styles.storyTitle}>
            {'█'.repeat(50)}<br />
            {'██  THE GATE — INCIDENT REPORT'.padEnd(48)}{'██'}<br />
            {'█'.repeat(50)}
          </div>
          <div className={styles.storyLines}>
            {storyLines.filter(Boolean).map((line, i) => {
              const isHighlight = typeof line === 'string' && (
                line.includes('TRAPPED') || line.includes('breach') || line.includes('BEGIN')
              )
              const isBlank = line === '>'
              return (
                <div
                  key={i}
                  className={[
                    styles.storyLine,
                    isHighlight ? styles.storyHighlight : '',
                    isBlank    ? styles.storyBlank    : '',
                  ].join(' ')}
                >
                  {line}
                </div>
              )
            })}
            <span className={styles.cursor}>█</span>
          </div>
        </div>
      )}
    </div>
  )
}

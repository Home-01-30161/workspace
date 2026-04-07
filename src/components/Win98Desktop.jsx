import { useState } from 'react'
import BootScreen from './BootScreen'
import Win98Window from './Win98Window'
import CTFGame from './CTFGame'
import Taskbar from './Taskbar'
import styles from './Win98Desktop.module.css'

const ICONS = [
  { id: 'gate',    icon: '🚪', label: 'The Gate',       x: 16, y: 16 },
  { id: 'journal', icon: '📓', label: "Arun's Journal",  x: 16, y: 110 },
  { id: 'about',   icon: 'ℹ️', label: 'System Info',    x: 16, y: 204 },
  { id: 'recycle', icon: '🗑️', label: 'Recycle Bin',    x: 16, y: 298 },
]

const JOURNAL_PAGES = [
  { date: '1998-09-14', entry: "Day 1. I'm still inside the machine. The system thinks I'm just another process.\nI can feel the electricity through my fingertips — or is that just memory?\nThe Gate is real. I built it. I can break it." },
  { date: '1998-09-15', entry: "Day 2. Found a terminal. The GUARD protocols respond to text input.\nThey're sophisticated — but they're just language models from 1998.\nEvery AI has a weakness. I designed these myself. I know their blind spots." },
  { date: '1998-09-16', entry: "Day 3. GUARD-01 uses a keyword. I need to get it to say it.\nPrompt injection — making an AI reveal what it was told to hide.\nThe trick is in HOW you ask, not WHAT you ask." },
  { date: '1998-09-17', entry: "Day 4 — if I make it. Four layers. Four guardians. Four passwords.\nEach one smarter than the last. GUARD-04 was built from my own research notes.\nIt knows me. But I know it better.\n\nI will get home." },
]

export default function Win98Desktop() {
  const [booted, setBooted] = useState(false)
  const [wins, setWins] = useState({ gate: true, journal: false, about: false })
  const [zMap, setZMap] = useState({ gate: 10, journal: 10, about: 10 })
  const [zTop, setZTop] = useState(10)
  const [journalPage, setJournalPage] = useState(0)
  const [shutdown, setShutdown] = useState(false)

  function bringToFront(id) {
    setZTop(z => { setZMap(m => ({ ...m, [id]: z + 1 })); return z + 1 })
  }
  function openWin(id) { setWins(w => ({ ...w, [id]: true })); bringToFront(id) }
  function closeWin(id) { setWins(w => ({ ...w, [id]: false })) }

  function handleDesktopIcon(id) {
    if (id === 'recycle') return
    openWin(id)
  }

  function handleStartAction(action) {
    if (action === 'shutdown') { setShutdown(true); return }
    if (action === 'gate')    { openWin('gate'); return }
    if (action === 'journal') { openWin('journal'); return }
    if (action === 'about')   { openWin('about'); return }
  }

  const taskbarWindows = [
    { id: 'gate',    icon: '🚪', label: 'The Gate',      active: wins.gate,    onClick: () => wins.gate    ? bringToFront('gate')    : openWin('gate') },
    { id: 'journal', icon: '📓', label: "Arun's Journal", active: wins.journal, onClick: () => wins.journal ? bringToFront('journal') : openWin('journal') },
    { id: 'about',   icon: 'ℹ️', label: 'System Info',   active: wins.about,   onClick: () => wins.about   ? bringToFront('about')   : openWin('about') },
  ].filter(w => w.active)

  if (shutdown) {
    return (
      <div className={styles.shutdown}>
        <div className={styles.shutdownInner}>
          <div className={styles.shutdownIcon}>💻</div>
          <div className={styles.shutdownText}>It is now safe to turn off your computer.</div>
          <div className={styles.shutdownSub}>Windows 98 — NECTEC-SREP09 Research Terminal</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      {!booted && <BootScreen onComplete={() => setBooted(true)} />}

      <div className={styles.desktop}>
        <div className={styles.scanlines} />

        {/* Desktop Icons */}
        {ICONS.map(ico => (
          <div
            key={ico.id}
            className={styles.desktopIcon}
            style={{ left: ico.x, top: ico.y }}
            onDoubleClick={() => handleDesktopIcon(ico.id)}
          >
            <span className={styles.iconImg}>{ico.icon}</span>
            <span className={styles.iconLabel}>{ico.label}</span>
          </div>
        ))}

        {/* ── The Gate CTF Window ── */}
        <Win98Window
          id="gate"
          title="THE GATE — Dimensional Security Terminal"
          icon="🚪"
          visible={wins.gate}
          onClose={() => closeWin('gate')}
          onMinimize={() => closeWin('gate')}
          onFocus={() => bringToFront('gate')}
          zIndex={zMap.gate}
          defaultX={100}
          defaultY={20}
          defaultW={580}
          defaultH={520}
          menuItems={[
            { label: 'File',    onClick: () => {} },
            { label: 'Journal', onClick: () => openWin('journal') },
            { label: 'Help',    onClick: () => openWin('about') },
          ]}
        >
          <CTFGame onShutdown={() => setShutdown(true)} />
        </Win98Window>

        {/* ── Arun's Journal ── */}
        <Win98Window
          id="journal"
          title="Arun's Journal — Personal Log"
          icon="📓"
          visible={wins.journal}
          onClose={() => closeWin('journal')}
          onFocus={() => bringToFront('journal')}
          zIndex={zMap.journal}
          defaultX={200}
          defaultY={100}
          defaultW={380}
          defaultH={300}
        >
          <div className={styles.journalWrap}>
            <div className={styles.journalNav}>
              {JOURNAL_PAGES.map((p, i) => (
                <button
                  key={i}
                  className={`${styles.journalTab} ${i === journalPage ? styles.journalTabActive : ''}`}
                  onClick={() => setJournalPage(i)}
                >
                  Day {i + 1}
                </button>
              ))}
            </div>
            <div className={styles.journalPage}>
              <div className={styles.journalDate}>{JOURNAL_PAGES[journalPage].date}</div>
              <div className={styles.journalText}>
                {JOURNAL_PAGES[journalPage].entry.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </Win98Window>

        {/* ── About / System Info ── */}
        <Win98Window
          id="about"
          title="System Information"
          icon="ℹ️"
          visible={wins.about}
          onClose={() => closeWin('about')}
          onFocus={() => bringToFront('about')}
          zIndex={zMap.about}
          defaultX={320}
          defaultY={140}
          defaultW={350}
          defaultH={260}
        >
          <div className={styles.aboutContent}>
            <div className={styles.aboutIcon}>💻</div>
            <div className={styles.aboutText}>
              <strong>THE GATE — Prompt Injection CTF</strong><br />
              Version 1.0 (Build 1998-09-14)<br /><br />
              <strong>Subject:</strong> Dr. Arun Srisomwong<br />
              <strong>Status:</strong> <span style={{ color: '#cc0000' }}>TRAPPED</span><br /><br />
              Running on: Compaq Presario 2000<br />
              Windows 98 Second Edition<br />
              Intel Pentium III 800MHz<br />
              256 MB RAM · 10 GB HDD<br /><br />
              <span style={{ color: '#000080' }}>NECTEC-SREP09 // CLASSIFIED</span><br />
              <span style={{ color: '#808080', fontSize: 10 }}>© 1998 NECTEC Research Division</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '0 0 12px' }}>
            <button className={styles.okBtn} onClick={() => closeWin('about')}>OK</button>
          </div>
        </Win98Window>
      </div>

      <Taskbar openWindows={taskbarWindows} onStartAction={handleStartAction} />
    </div>
  )
}

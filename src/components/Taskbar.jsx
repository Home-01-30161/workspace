import { useState, useEffect } from 'react'
import styles from './Taskbar.module.css'

const MENU_ITEMS = [
  { icon: '🚪', label: 'The Gate',        action: 'gate' },
  { icon: '📓', label: "Arun's Journal",  action: 'journal' },
  { icon: 'ℹ️', label: 'System Info',     action: 'about' },
  { separator: true },
  { icon: '🔴', label: 'Shut Down...',    action: 'shutdown' },
]

export default function Taskbar({ openWindows, onStartAction }) {
  const [clock, setClock] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      // Show a fake 1998 date for immersion
      const h = String(d.getHours()).padStart(2, '0')
      const m = String(d.getMinutes()).padStart(2, '0')
      setClock(`${h}:${m}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  function handleMenu(action) {
    setMenuOpen(false)
    onStartAction(action)
  }

  return (
    <>
      {/* Start Menu */}
      {menuOpen && (
        <div className={styles.startMenu}>
          <div className={styles.startMenuHeader}>
            <span className={styles.smHeaderIcon}>🚪</span>
            <span>THE GATE</span>
          </div>
          <div className={styles.startMenuItems}>
            {MENU_ITEMS.map((item, i) =>
              item.separator
                ? <div key={i} className={styles.sep} />
                : (
                  <div key={i} className={styles.smItem} onClick={() => handleMenu(item.action)}>
                    <span className={styles.smIcon}>{item.icon}</span>
                    {item.label}
                  </div>
                )
            )}
          </div>
        </div>
      )}

      <div className={styles.taskbar}>
        {/* Start Button */}
        <button
          className={`${styles.startBtn} ${menuOpen ? styles.startBtnActive : ''}`}
          onClick={() => setMenuOpen(m => !m)}
        >
          <span>🪟</span>
          <b>Start</b>
        </button>

        <div className={styles.sep2} />

        {/* Task Buttons */}
        <div className={styles.tasks}>
          {openWindows.map(w => (
            <button
              key={w.id}
              className={`${styles.taskBtn} ${w.active ? styles.taskBtnActive : ''}`}
              onClick={w.onClick}
            >
              {w.icon} {w.label}
            </button>
          ))}
        </div>

        {/* System Tray */}
        <div className={styles.tray}>
          <span className={styles.trayIcon} title="GATE.SYS running">⚠️</span>
          <div className={styles.clock}>{clock}</div>
        </div>
      </div>

      {/* Overlay to close menu */}
      {menuOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 998 }}
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  )
}

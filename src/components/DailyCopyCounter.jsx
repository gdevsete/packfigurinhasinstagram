import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DailyCopyCounter({ count }) {
  const [display, setDisplay] = useState(count)
  const [bump, setBump] = useState(false)

  useEffect(() => {
    if (count !== display) {
      setBump(true)
      setTimeout(() => {
        setDisplay(count)
        setBump(false)
      }, 150)
    }
  }, [count])

  // Só mostra a partir de 1
  if (count < 1) return null

  return (
    <div className="daily-counter">
      <span className="daily-fire">🔥</span>
      <motion.span
        key={display}
        className="daily-number"
        initial={{ scale: 1.4, color: '#39ff14' }}
        animate={{ scale: 1, color: '#ffd700' }}
        transition={{ duration: 0.3 }}
      >
        {display.toLocaleString('pt-BR')}
      </motion.span>
      <span className="daily-label">copiadas hoje</span>
    </div>
  )
}

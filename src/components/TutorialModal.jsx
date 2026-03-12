import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STEPS = [
  {
    icon: '👆',
    title: 'Toque na figurinha',
    desc: 'No celular: toque uma vez para copiar. No computador: passe o mouse e clique em "Copiar".',
    color: '#39ff14',
  },
  {
    icon: '📋',
    title: 'Figurinha copiada!',
    desc: 'A figurinha vai direto para sua área de transferência, pronta para colar.',
    color: '#ffd700',
  },
  {
    icon: '📸',
    title: 'Cole no Instagram',
    desc: 'Abra o Instagram → Stories ou Direct → segure o dedo na tela → "Colar". É só isso!',
    color: '#ff2d78',
  },
]

export default function TutorialModal() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    // Mostra apenas na primeira visita
    const seen = localStorage.getItem('sv-tutorial-seen')
    if (!seen) {
      setTimeout(() => setOpen(true), 800)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem('sv-tutorial-seen', '1')
    setOpen(false)
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else handleClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="tutorial-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={e => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            className="tutorial-box"
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          >
            {/* Header */}
            <div className="tutorial-header">
              <div className="tutorial-logo">✦ Como usar</div>
              <button className="tutorial-skip" onClick={handleClose}>Pular</button>
            </div>

            {/* Step */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2 }}
                className="tutorial-step"
              >
                <div className="tutorial-icon" style={{ color: STEPS[step].color }}>
                  {STEPS[step].icon}
                </div>
                <div className="tutorial-step-num" style={{ color: STEPS[step].color }}>
                  PASSO {step + 1} DE {STEPS.length}
                </div>
                <div className="tutorial-title">{STEPS[step].title}</div>
                <div className="tutorial-desc">{STEPS[step].desc}</div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="tutorial-dots">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`tutorial-dot ${i === step ? 'active' : ''}`}
                  onClick={() => setStep(i)}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="tutorial-actions">
              {step > 0 && (
                <button className="tutorial-btn-back" onClick={() => setStep(s => s - 1)}>
                  ← Voltar
                </button>
              )}
              <button
                className="tutorial-btn-next"
                style={{ background: STEPS[step].color }}
                onClick={handleNext}
              >
                {step < STEPS.length - 1 ? 'Próximo →' : '🚀 Começar!'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

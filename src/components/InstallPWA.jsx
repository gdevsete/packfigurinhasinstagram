import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function InstallPWA() {
  const [prompt, setPrompt] = useState(null)
  const [visible, setVisible] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // Captura o evento antes que o browser mostre o banner padrão
    const handler = (e) => {
      e.preventDefault()
      setPrompt(e)
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => {
      setInstalled(true)
      setVisible(false)
    })

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') {
      setInstalled(true)
      setVisible(false)
    }
    setPrompt(null)
  }

  if (installed || !visible) return null

  return (
    <AnimatePresence>
      <motion.div
        className="pwa-banner"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 250 }}
      >
        <div className="pwa-banner-left">
          <img src="/stickers/logo.png" alt="App" className="pwa-icon" />
          <div className="pwa-text">
            <div className="pwa-title">Instalar como App</div>
            <div className="pwa-sub">Acesso rápido sem abrir o browser</div>
          </div>
        </div>
        <div className="pwa-banner-right">
          <button className="pwa-btn-install" onClick={handleInstall}>
            Instalar
          </button>
          <button className="pwa-btn-dismiss" onClick={() => setVisible(false)}>
            ✕
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

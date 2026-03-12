import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
}

export default function InstallPWA() {
  const [prompt, setPrompt] = useState(null)
  const [visible, setVisible] = useState(false)
  const [installed, setInstalled] = useState(false)
  const [showIOSGuide, setShowIOSGuide] = useState(false)

  useEffect(() => {
    // Já está instalado como app — não mostrar
    if (isInStandaloneMode()) return

    if (isIOS()) {
      setShowIOSGuide(true)
      setVisible(true)
      return
    }

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
            {showIOSGuide ? (
              <div className="pwa-sub">
                Toque em <strong>Compartilhar</strong> (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle' }}>
                  <path d="M12 2l-4 4h3v8h2V6h3L12 2zm7 14H5v4h14v-4z"/>
                </svg>
                ) e depois <strong>Adicionar à Tela de Início</strong>
              </div>
            ) : (
              <div className="pwa-sub">Acesso rápido sem abrir o browser</div>
            )}
          </div>
        </div>
        <div className="pwa-banner-right">
          {!showIOSGuide && (
            <button className="pwa-btn-install" onClick={handleInstall}>
              Instalar
            </button>
          )}
          <button className="pwa-btn-dismiss" onClick={() => setVisible(false)}>
            ✕
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

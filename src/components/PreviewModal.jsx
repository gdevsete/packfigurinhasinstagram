import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PreviewModal({ sticker, onClose, onCopy, onShare }) {
  useEffect(() => {
    if (!sticker) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [sticker, onClose])

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) onClose()
  }, [onClose])

  const handleDownload = useCallback(async () => {
    if (!sticker?.path) return
    try {
      const res = await fetch(sticker.path)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${sticker.name}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      const a = document.createElement('a')
      a.href = sticker.path
      a.download = `${sticker.name}.png`
      a.click()
    }
  }, [sticker])

  const handleWhatsApp = useCallback(async () => {
    if (!sticker?.path) return
    if (navigator.share) {
      try {
        const res = await fetch(sticker.path)
        const blob = await res.blob()
        const file = new File([blob], `${sticker.name}.png`, { type: 'image/png' })
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: sticker.name })
          return
        }
      } catch {}
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`Figurinha: ${sticker.name} 🎉`)}`, '_blank')
  }, [sticker])

  return (
    <AnimatePresence>
      {sticker && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            {/* Sticker Display */}
            <div className="modal-image-wrapper">
              {sticker.path ? (
                <img
                  src={sticker.path}
                  alt={sticker.name}
                  className="modal-img"
                  draggable={false}
                />
              ) : (
                <div style={{ fontSize: '120px', lineHeight: 1, userSelect: 'none' }}>
                  {sticker.emoji}
                </div>
              )}
            </div>

            <div className="modal-sticker-name">
              {sticker.category.toUpperCase()} ✦ {sticker.name}
            </div>

            {/* Actions */}
            <div className="modal-actions">
              <button
                className="modal-btn modal-btn-primary"
                onClick={() => { onCopy(sticker); onClose() }}
              >
                📋 Copiar
              </button>

              {sticker.path && (
                <button
                  className="modal-btn modal-btn-whatsapp"
                  onClick={handleWhatsApp}
                  title="Compartilhar no WhatsApp"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{flexShrink:0}}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.858L.054 23.5l5.789-1.519A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.868 9.868 0 01-5.031-1.375l-.361-.214-3.438.901.918-3.352-.235-.374A9.865 9.865 0 012.106 12C2.106 6.58 6.58 2.106 12 2.106S21.894 6.58 21.894 12 17.42 21.894 12 21.894z"/></svg>
                  WhatsApp
                </button>
              )}

              {sticker.path && (
                <button
                  className="modal-btn modal-btn-download"
                  onClick={handleDownload}
                  title="Baixar figurinha"
                >
                  💾
                </button>
              )}

              <button
                className="modal-btn-close"
                onClick={onClose}
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            {/* Hint */}
            <div style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.3)',
              fontFamily: 'var(--font-body)',
              textAlign: 'center',
              letterSpacing: '0.5px',
            }}>
              Copie e cole direto no Instagram Stories ou Direct ✨
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

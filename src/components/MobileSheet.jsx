import { useEffect, useRef } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'

const EXTRA = [
  { id: 'favoritos', name: 'Favoritos', emoji: '❤️', color: '#ff2d78' },
  { id: 'todos', name: 'Todos', emoji: '✨', color: '#39ff14' },
]

export default function MobileSheet({ open, onClose, categories, activeCategory, onCategoryChange, categoryCounts }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const allCats = [EXTRA[1], ...categories, EXTRA[0]]

  const handleSelect = (id) => {
    onCategoryChange(id)
    if (navigator.vibrate) navigator.vibrate(30)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            ref={overlayRef}
            className="sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="bottom-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) onClose()
            }}
          >
            <div className="sheet-handle" />
            <div className="sheet-title">🎨 CATEGORIAS</div>

            <div className="sheet-categories">
              {allCats.map(cat => {
                const count = categoryCounts[cat.id] || 0
                const isActive = activeCategory === cat.id
                return (
                  <motion.div
                    key={cat.id}
                    className={`sheet-cat-item ${isActive ? 'active' : ''}`}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelect(cat.id)}
                    style={isActive ? {
                      borderColor: cat.color || 'var(--neon-green)',
                      background: `${cat.color || '#39ff14'}18`,
                    } : {}}
                  >
                    <span className="sheet-cat-emoji">{cat.emoji}</span>
                    <div className="sheet-cat-info">
                      <span className="sheet-cat-name"
                        style={isActive ? { color: cat.color || 'var(--neon-green)' } : {}}
                      >
                        {cat.name}
                      </span>
                      <span className="sheet-cat-count"
                        style={isActive ? { color: cat.color || 'var(--neon-green)' } : {}}
                      >
                        {count.toLocaleString('pt-BR')} figurinhas
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

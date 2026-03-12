import { AnimatePresence, motion } from 'framer-motion'

export default function CopyToast({ toasts }) {
  return (
    <div className="toast-container" aria-live="polite">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            className="toast"
            initial={{ opacity: 0, y: 20, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ type: 'spring', damping: 18, stiffness: 280 }}
            style={toast.type === 'error' ? {
              borderColor: 'var(--neon-pink)',
              color: 'var(--neon-pink)',
              boxShadow: '0 0 20px rgba(255,45,120,0.3)',
            } : {}}
          >
            <span className="toast-icon">
              {toast.type === 'error' ? '❌' : '✅'}
            </span>
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

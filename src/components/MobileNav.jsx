import { motion } from 'framer-motion'

export default function MobileNav({ activeTab, onTabChange, onOpenSheet, favCount }) {
  const tabs = [
    { id: 'home', icon: '✦', label: 'Início' },
    { id: 'search', icon: '🔍', label: 'Buscar' },
    null, // center button
    { id: 'favoritos', icon: '❤️', label: 'Favs', badge: favCount },
    { id: 'recentes', icon: '🕐', label: 'Recentes' },
  ]

  return (
    <nav className="mobile-nav">
      <div className="mobile-nav-inner">
        {tabs.map((tab, i) => {
          if (!tab) {
            // Center action button
            return (
              <div key="center" className="mobile-nav-center">
                <motion.button
                  className="mobile-center-btn"
                  whileTap={{ scale: 0.88 }}
                  onClick={onOpenSheet}
                  aria-label="Categorias"
                >
                  🎨
                </motion.button>
                <span style={{
                  fontSize: '9px',
                  color: 'var(--neon-green)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}>
                  Categorias
                </span>
              </div>
            )
          }

          const isActive = activeTab === tab.id
          return (
            <motion.button
              key={tab.id}
              className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
              whileTap={{ scale: 0.88 }}
              onClick={() => {
                if (navigator.vibrate) navigator.vibrate(20)
                onTabChange(tab.id)
              }}
            >
              <div className="nav-icon-wrap" style={{ position: 'relative' }}>
                {tab.icon}
                {tab.badge > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    background: 'var(--neon-pink)',
                    color: '#fff',
                    fontSize: '9px',
                    fontFamily: 'var(--font-tech)',
                    fontWeight: 700,
                    borderRadius: '50px',
                    padding: '1px 4px',
                    minWidth: '16px',
                    textAlign: 'center',
                    lineHeight: '14px',
                  }}>
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>
              <span>{tab.label}</span>
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}

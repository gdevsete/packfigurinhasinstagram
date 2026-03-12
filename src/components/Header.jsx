import { useState, useEffect } from 'react'

export default function Header({ totalCount, filteredCount, searchQuery, onSearchChange }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="header" style={{ boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none' }}>
      <div className="header-inner">
        {/* Logo real */}
        <a href="/" className="header-logo">
          <img
            src="/stickers/logo.png"
            alt="Stories Personalizados Destaques"
            className="header-logo-img"
            onError={e => {
              e.target.style.display = 'none'
              document.getElementById('logo-fallback').style.display = 'flex'
            }}
          />
          <div id="logo-fallback" style={{ display: 'none', flexDirection: 'column' }}>
            <div className="logo-text">STORIES</div>
            <span className="logo-sub">personalizados ✦ destaques</span>
          </div>
        </a>

        {/* Search */}
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="search"
            placeholder="Buscar figurinha... (ex: bom dia, reage, humor)"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            autoComplete="off"
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => onSearchChange('')} aria-label="Limpar busca">
              ✕
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="header-stats">
          <div className="stat-badge">
            <span className="stat-number">{totalCount.toLocaleString('pt-BR')}</span>
            <span className="stat-label">Figurinhas</span>
          </div>
          {filteredCount !== totalCount && (
            <div className="stat-badge" style={{ borderColor: 'rgba(255,45,120,0.3)', background: 'rgba(255,45,120,0.06)' }}>
              <span className="stat-number" style={{ color: 'var(--neon-pink)' }}>{filteredCount.toLocaleString('pt-BR')}</span>
              <span className="stat-label">Filtradas</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}


import { useState, useRef, useCallback, memo } from 'react'

const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

const StickerCard = memo(function StickerCard({ sticker, onCopy, onPreview, onFavorite, onEdit, isCopying }) {
  const [loaded, setLoaded] = useState(false)
  const [ripple, setRipple] = useState(false)
  const longPressRef = useRef(null)
  const touchMoved = useRef(false)

  const handleCopy = useCallback((e) => {
    e.stopPropagation()
    setRipple(true)
    setTimeout(() => setRipple(false), 600)
    onCopy(sticker)
  }, [sticker, onCopy])

  const handlePreview = useCallback((e) => {
    e.stopPropagation()
    onPreview(sticker)
  }, [sticker, onPreview])

  // Long press → preview; tap curto → copia (mobile)
  const handleTouchStart = useCallback(() => {
    touchMoved.current = false
    longPressRef.current = setTimeout(() => {
      if (!touchMoved.current) {
        if (navigator.vibrate) navigator.vibrate(60)
        onPreview(sticker)
      }
    }, 500)
  }, [sticker, onPreview])

  const handleTouchMove = useCallback(() => {
    touchMoved.current = true
    if (longPressRef.current) {
      clearTimeout(longPressRef.current)
      longPressRef.current = null
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (longPressRef.current) {
      clearTimeout(longPressRef.current)
      longPressRef.current = null
    }
  }, [])

  const handleDownload = useCallback(async (e) => {
    e.stopPropagation()
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

  return (
    <div
      className={`sticker-card ${isCopying ? 'copying' : ''} ${loaded ? 'loaded' : ''}`}
      onClick={isMobileDevice ? handleCopy : undefined}
      onTouchStart={isMobileDevice ? handleTouchStart : undefined}
      onTouchMove={isMobileDevice ? handleTouchMove : undefined}
      onTouchEnd={isMobileDevice ? handleTouchEnd : undefined}
      role="button"
      tabIndex={0}
      aria-label={`Copiar: ${sticker.name}`}
      onKeyDown={(e) => e.key === 'Enter' && handleCopy(e)}
    >
      {/* Badge NEW */}
      {sticker.isNew && <div className="new-badge">NEW</div>}

      {/* Favorite */}
      <button
        className={`fav-btn ${sticker.isFavorite ? 'active' : ''}`}
        onClick={(e) => { e.stopPropagation(); onFavorite(sticker.id) }}
        aria-label="Favoritar"
      >
        {sticker.isFavorite ? '❤️' : '🤍'}
      </button>

      {/* Shimmer enquanto carrega */}
      {!loaded && <div className="sticker-placeholder" />}

      {/* Imagem real PNG — react-window já virtualiza, não usar loading=lazy */}
      <img
        src={sticker.path}
        alt={sticker.name}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        style={{ display: loaded ? 'block' : 'none' }}
      />

      {/* Nome da figurinha (mobile sempre visível, desktop no hover) */}
      <div className="card-name">{sticker.name}</div>

      {/* Overlay desktop (hover): Copy | Preview | Edit */}
      {!isMobileDevice && (
        <div className="card-overlay">
          <button className="card-btn card-btn-copy" onClick={handleCopy}>
            📋 Copiar
          </button>
          <button className="card-btn card-btn-icon" onClick={handlePreview} title="Preview">
            🔍
          </button>
          <button
            className="card-btn card-btn-icon card-btn-edit-overlay"
            onClick={(e) => { e.stopPropagation(); onEdit && onEdit(sticker) }}
            title="Editar"
          >
            ✏️
          </button>
        </div>
      )}

      {/* Mobile: barra de ações lateral */}
      {isMobileDevice && (
        <div className="card-mobile-actions">
          <button
            className="card-mobile-btn card-mobile-btn-copy"
            onClick={handleCopy}
            aria-label="Copiar"
          >
            📋
          </button>
          <button
            className="card-mobile-btn"
            onClick={handlePreview}
            aria-label="Preview"
          >
            👁
          </button>
          <button
            className="card-mobile-btn"
            onClick={handleDownload}
            aria-label="Baixar"
          >
            💾
          </button>
          <button
            className={`card-mobile-btn ${sticker.isFavorite ? 'card-mobile-btn-fav-active' : ''}`}
            onClick={(e) => { e.stopPropagation(); onFavorite(sticker.id) }}
            aria-label="Favoritar"
          >
            {sticker.isFavorite ? '❤️' : '🤍'}
          </button>
        </div>
      )}

      {/* Ripple ao copiar */}
      {ripple && <div className="copy-ripple" />}

      {/* Flash verde ao copiar */}
      {isCopying && <div className="copy-flash" />}
    </div>
  )
})

export default StickerCard

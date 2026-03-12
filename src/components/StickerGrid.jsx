import { useCallback, useState } from 'react'
import { FixedSizeGrid } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import StickerCard from './StickerCard'

const GAP = 10
const MIN_CARD = 130
const MAX_CARD = 200

function getColumnCount(width) {
  if (width >= 1400) return 10
  if (width >= 1200) return 8
  if (width >= 900) return 7
  if (width >= 700) return 6
  if (width >= 500) return 5
  if (width >= 420) return 4
  return 2
}

const SUGGESTIONS = ['amor', 'feliz', 'engraçado', 'triste', 'festa', 'motivação', 'animals', 'humor']

export default function StickerGrid({ stickers, onCopy, onPreview, onFavorite, onEdit, copyingId, onSearchSuggest }) {
  const [cols, setCols] = useState(4)
  const [cardSize, setCardSize] = useState(140)

  const recalc = useCallback((width) => {
    const c = getColumnCount(width)
    const size = Math.min(MAX_CARD, Math.max(MIN_CARD, Math.floor((width - GAP * (c + 1)) / c)))
    setCols(c)
    setCardSize(size)
  }, [])

  const rows = Math.ceil(stickers.length / cols)

  const Cell = useCallback(({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * cols + columnIndex
    if (index >= stickers.length) return null
    const sticker = stickers[index]

    return (
      <div style={{
        ...style,
        left: style.left + GAP,
        top: style.top + GAP,
        width: style.width - GAP,
        height: style.height - GAP,
      }}>
        <StickerCard
          key={sticker.id}
          sticker={sticker}
          onCopy={onCopy}
          onPreview={onPreview}
          onFavorite={onFavorite}
          onEdit={onEdit}
          isCopying={copyingId === sticker.id}
        />
      </div>
    )
  }, [stickers, cols, onCopy, onPreview, onFavorite, onEdit, copyingId])

  if (stickers.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <div className="empty-title">NADA ENCONTRADO</div>
        <div className="empty-sub">Tente buscar com outras palavras</div>
        {onSearchSuggest && (
          <div className="empty-suggestions">
            <span className="empty-suggestions-label">Tente:</span>
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                className="empty-suggestion-chip"
                onClick={() => onSearchSuggest(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="sticker-grid-wrapper" style={{ height: 'calc(100dvh - 160px)', minHeight: '400px' }}>
      <AutoSizer onResize={({ width }) => recalc(width)}>
        {({ height, width }) => {
          const colW = Math.floor((width - GAP * (cols + 1)) / cols) + GAP
          const rowH = colW

          return (
            <FixedSizeGrid
              columnCount={cols}
              columnWidth={colW}
              rowCount={rows}
              rowHeight={rowH}
              height={height}
              width={width}
              overscanRowCount={6}
              style={{ overflowX: 'hidden' }}
            >
              {Cell}
            </FixedSizeGrid>
          )
        }}
      </AutoSizer>
    </div>
  )
}

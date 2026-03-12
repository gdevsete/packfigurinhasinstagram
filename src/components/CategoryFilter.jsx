import { useRef } from 'react'

const EXTRA_CATEGORIES = [
  { id: 'favoritos', name: 'Favoritos', emoji: '❤️', color: '#ff2d78' },
]

export default function CategoryFilter({ categories, activeCategory, onCategoryChange, categoryCounts }) {
  const scrollRef = useRef(null)

  const allCategories = [...categories, ...EXTRA_CATEGORIES]

  const scrollTo = (id) => {
    onCategoryChange(id)
    if (navigator.vibrate) navigator.vibrate(20)

    // Scroll active pill into view
    const el = scrollRef.current?.querySelector(`[data-cat="${id}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  return (
    <div className="category-section">
      <div className="category-scroll" ref={scrollRef}>
        {allCategories.map(cat => {
          const count = categoryCounts[cat.id] || 0
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              data-cat={cat.id}
              className={`cat-pill ${isActive ? 'active' : ''}`}
              onClick={() => scrollTo(cat.id)}
              style={isActive ? {
                borderColor: cat.color,
                color: cat.color,
                background: `${cat.color}18`,
                boxShadow: `0 0 12px ${cat.color}30`,
              } : {}}
            >
              <span className="cat-emoji">{cat.emoji}</span>
              {cat.name}
              {count > 0 && (
                <span
                  className="cat-count"
                  style={isActive ? {
                    background: cat.color,
                    color: '#000',
                  } : {}}
                >
                  {count > 999 ? `${Math.floor(count / 1000)}k+` : count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

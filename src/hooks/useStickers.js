import { useState, useMemo, useCallback, useEffect } from 'react'
import { STICKERS, CATEGORIES } from '../data/mockStickers'

// Lê o contador de cópias por sticker do localStorage
function loadCopyCounts() {
  try { return JSON.parse(localStorage.getItem('sv-copy-counts') || '{}') }
  catch { return {} }
}

export function useStickers() {
  const [searchQuery, setSearchQuery]     = useState('')
  const [activeCategory, setActiveCategory] = useState('todos')
  const [sortBy, setSortBy]               = useState('default') // default | az | za | newest | popular
  const [favorites, setFavorites]         = useState(() => {
    try { return JSON.parse(localStorage.getItem('sv-favorites') || '[]') }
    catch { return [] }
  })
  const [recentlyCopied, setRecentlyCopied] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sv-recent') || '[]') }
    catch { return [] }
  })
  const [copyCounts, setCopyCounts]       = useState(loadCopyCounts)

  // Contador diário de cópias
  const [dailyCopyCount, setDailyCopyCount] = useState(() => {
    try {
      const data = JSON.parse(localStorage.getItem('sv-daily') || '{}')
      const today = new Date().toDateString()
      return data.date === today ? data.count : 0
    } catch { return 0 }
  })

  // Persist
  useEffect(() => {
    localStorage.setItem('sv-favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('sv-recent', JSON.stringify(recentlyCopied.slice(0, 20)))
  }, [recentlyCopied])

  useEffect(() => {
    localStorage.setItem('sv-copy-counts', JSON.stringify(copyCounts))
  }, [copyCounts])

  // Filtered + sorted stickers
  const filteredStickers = useMemo(() => {
    let result = STICKERS

    if (activeCategory === 'favoritos') {
      result = result.filter(s => favorites.includes(s.id))
    } else if (activeCategory !== 'todos') {
      result = result.filter(s => s.category === activeCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        (s.tags || []).some(t => t.toLowerCase().includes(q))
      )
    }

    // Ordenação
    const sorted = [...result]
    if (sortBy === 'az')      sorted.sort((a, b) => a.name.localeCompare(b.name))
    else if (sortBy === 'za') sorted.sort((a, b) => b.name.localeCompare(a.name))
    else if (sortBy === 'newest') sorted.sort((a, b) => b.addedAt - a.addedAt)
    else if (sortBy === 'popular') sorted.sort((a, b) => (copyCounts[b.id] || 0) - (copyCounts[a.id] || 0))

    return sorted.map(s => ({
      ...s,
      isFavorite: favorites.includes(s.id),
      copyCount: copyCounts[s.id] || 0,
    }))
  }, [searchQuery, activeCategory, favorites, sortBy, copyCounts])

  // Top 8 mais copiadas (para a seção de destaque)
  const topCopied = useMemo(() => {
    return STICKERS
      .filter(s => (copyCounts[s.id] || 0) > 0)
      .sort((a, b) => (copyCounts[b.id] || 0) - (copyCounts[a.id] || 0))
      .slice(0, 8)
      .map(s => ({ ...s, copyCount: copyCounts[s.id] || 0 }))
  }, [copyCounts])

  const categoryCounts = useMemo(() => {
    const counts = { todos: STICKERS.length }
    STICKERS.forEach(s => { counts[s.category] = (counts[s.category] || 0) + 1 })
    counts['favoritos'] = favorites.length
    return counts
  }, [favorites])

  const toggleFavorite = useCallback((id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
    if (navigator.vibrate) navigator.vibrate(30)
  }, [])

  const addToRecent = useCallback((sticker) => {
    // Incrementa contador de cópias por sticker
    setCopyCounts(prev => ({ ...prev, [sticker.id]: (prev[sticker.id] || 0) + 1 }))

    // Incrementa contador diário
    setDailyCopyCount(prev => {
      const next = prev + 1
      localStorage.setItem('sv-daily', JSON.stringify({ date: new Date().toDateString(), count: next }))
      return next
    })

    setRecentlyCopied(prev => {
      const filtered = prev.filter(s => s.id !== sticker.id)
      return [sticker, ...filtered].slice(0, 20)
    })
  }, [])

  return {
    stickers: filteredStickers,
    totalCount: STICKERS.length,
    searchQuery, setSearchQuery,
    activeCategory, setActiveCategory,
    sortBy, setSortBy,
    favorites, toggleFavorite,
    recentlyCopied, addToRecent,
    categoryCounts,
    categories: CATEGORIES,
    topCopied,
    dailyCopyCount,
  }
}

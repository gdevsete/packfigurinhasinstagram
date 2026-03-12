import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'

import ParticleCanvas      from './components/ParticleCanvas'
import FloatingDecorations from './components/FloatingDecorations'
import Header              from './components/Header'
import CategoryFilter      from './components/CategoryFilter'
import QuickFilters        from './components/QuickFilters'
import SortControls        from './components/SortControls'
import StickerGrid         from './components/StickerGrid'
import PreviewModal        from './components/PreviewModal'
import CopyToast           from './components/CopyToast'
import MobileNav           from './components/MobileNav'
import MobileSheet         from './components/MobileSheet'
import RecentlySection     from './components/RecentlySection'
import TutorialModal       from './components/TutorialModal'
import DailyCopyCounter    from './components/DailyCopyCounter'
import TopCopied           from './components/TopCopied'
import ShareSiteButton     from './components/ShareSiteButton'
import InstallPWA          from './components/InstallPWA'
import StickerEditor       from './components/StickerEditor'

import { useStickers }    from './hooks/useStickers'
import { useCopySticker } from './hooks/useCopySticker'

export default function App() {
  const [previewSticker, setPreviewSticker] = useState(null)
  const [editSticker,   setEditSticker]     = useState(null)
  const [sheetOpen, setSheetOpen]           = useState(false)
  const [mobileTab, setMobileTab]           = useState('home')

  const {
    stickers, totalCount,
    searchQuery, setSearchQuery,
    activeCategory, setActiveCategory,
    sortBy, setSortBy,
    favorites, toggleFavorite,
    recentlyCopied, addToRecent,
    categoryCounts, categories,
    topCopied, dailyCopyCount,
  } = useStickers()

  const { copySticker, shareSticker, copyingId, toasts } = useCopySticker(addToRecent)

  const handleMobileTab = useCallback((tab) => {
    setMobileTab(tab)
    if (tab === 'home')           { setActiveCategory('todos'); setSearchQuery('') }
    else if (tab === 'favoritos') setActiveCategory('favoritos')
    else if (tab === 'recentes')  {}
    else if (tab === 'search')    document.querySelector('.search-input')?.focus()
  }, [setActiveCategory, setSearchQuery])

  const handleCategoryChange = useCallback((cat) => {
    setActiveCategory(cat); setMobileTab('home'); setSearchQuery('')
  }, [setActiveCategory, setSearchQuery])

  const displayStickers  = mobileTab === 'recentes' ? recentlyCopied : stickers
  const showRecently     = recentlyCopied.length > 0 && mobileTab !== 'recentes'
  const showTopCopied    = topCopied.length > 0 && !searchQuery && activeCategory === 'todos' && mobileTab !== 'recentes'

  const resultLabel = () => {
    if (mobileTab === 'recentes') return `⚡ RECENTES • ${recentlyCopied.length} figurinhas`
    if (searchQuery) return `${stickers.length} resultado${stickers.length !== 1 ? 's' : ''} para "${searchQuery}"`
    if (activeCategory === 'favoritos') return `❤️ ${stickers.length} favorita${stickers.length !== 1 ? 's' : ''}`
    if (activeCategory !== 'todos') {
      const cat = categories.find(c => c.id === activeCategory)
      return `${cat?.emoji || ''} ${stickers.length} figurinha${stickers.length !== 1 ? 's' : ''} • ${cat?.name || activeCategory}`
    }
    return `✦ ${stickers.length.toLocaleString('pt-BR')} figurinhas disponíveis`
  }

  return (
    <div className="app-container">
      <ParticleCanvas />
      <FloatingDecorations />
      <GraffitiDecorations />
      <TutorialModal />

      <Header
        totalCount={totalCount}
        filteredCount={stickers.length}
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setMobileTab('home') }}
      />

      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        categoryCounts={categoryCounts}
      />

      <main className="main-content">
        {/* Filtros rápidos */}
        <QuickFilters
          searchQuery={searchQuery}
          onSearch={(q) => { setSearchQuery(q); setMobileTab('home') }}
          activeCategory={activeCategory}
        />

        {/* Mais copiadas */}
        {showTopCopied && (
          <TopCopied stickers={topCopied} onCopy={copySticker} onPreview={setPreviewSticker} />
        )}

        {/* Recentes */}
        {showRecently && (
          <RecentlySection items={recentlyCopied} onCopy={copySticker} />
        )}

        {/* Barra de info + ordenação + compartilhar */}
        <div className="content-header">
          <div className="content-header-left">
            <div className="results-info"><span>{resultLabel()}</span></div>
            <DailyCopyCounter count={dailyCopyCount} />
          </div>
          <div className="content-header-right">
            {searchQuery && (
              <button className="clear-filter-btn" onClick={() => setSearchQuery('')}>
                ✕ Limpar
              </button>
            )}
            <SortControls sortBy={sortBy} onSortChange={setSortBy} />
            <ShareSiteButton />
          </div>
        </div>

        <StickerGrid
          stickers={displayStickers}
          onCopy={copySticker}
          onPreview={setPreviewSticker}
          onFavorite={toggleFavorite}
          onEdit={setEditSticker}
          copyingId={copyingId}
          onSearchSuggest={(q) => { setSearchQuery(q); setMobileTab('home') }}
        />
      </main>

      <PreviewModal
        sticker={previewSticker}
        onClose={() => setPreviewSticker(null)}
        onCopy={(s) => { copySticker(s); setPreviewSticker(null) }}
        onShare={shareSticker}
      />

      <CopyToast toasts={toasts} />

      <MobileNav
        activeTab={mobileTab}
        onTabChange={handleMobileTab}
        onOpenSheet={() => setSheetOpen(true)}
        favCount={favorites.length}
      />

      <MobileSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        categoryCounts={categoryCounts}
      />

      <InstallPWA />

      {/* FAB — editor manual */}
      <div className="create-fab-wrap">
        <div className="ai-fab-group">
          <span className="create-fab-tooltip">Editor manual</span>
          <button
            className="create-fab"
            onClick={() => setEditSticker('create')}
            title="Criar figurinha do zero"
          >
            ✦
          </button>
        </div>
      </div>

      <AnimatePresence>
        {editSticker && (
          <StickerEditor
            sticker={editSticker === 'create' ? null : editSticker}
            onClose={() => setEditSticker(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function GraffitiDecorations() {
  const tags = [
    { text: 'STORIES',    top: '12%', left: '-1%',  size: 90,  rotate: -15, color: '#39ff14' },
    { text: 'COPIE+COLE', top: '50%', right: '-1%', size: 60,  rotate: 90,  color: '#ff2d78' },
    { text: 'VIRAL',      top: '78%', left: '4%',   size: 110, rotate: -5,  color: '#ffd700' },
    { text: 'INFLUENCER', top: '28%', right: '1%',  size: 52,  rotate: 85,  color: '#bc13fe' },
  ]
  return (
    <>
      {tags.map((t, i) => (
        <div key={i} className="graffiti-tag" style={{
          top: t.top, left: t.left, right: t.right,
          fontSize: t.size, color: t.color, transform: `rotate(${t.rotate}deg)`,
        }}>{t.text}</div>
      ))}
    </>
  )
}

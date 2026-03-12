import { useCallback, useState } from 'react'

export default function ShareSiteButton() {
  const [copied, setCopied] = useState(false)

  const handleShare = useCallback(async () => {
    const data = {
      title: 'Stories Personalizados Destaques',
      text: '🔥 Olha essas figurinhas incríveis para o Instagram! Copie e cole direto nos seus Stories!',
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(data)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    }
  }, [])

  return (
    <button
      className={`share-site-btn ${copied ? 'copied' : ''}`}
      onClick={handleShare}
      title="Compartilhar site"
    >
      {copied ? '✅ Link copiado!' : '📤 Compartilhar'}
    </button>
  )
}

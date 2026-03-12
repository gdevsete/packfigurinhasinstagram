import { useState, useCallback } from 'react'

export function useCopySticker(onCopied) {
  const [copyingId, setCopyingId] = useState(null)
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 2500)
  }, [])

  const copySticker = useCallback(async (sticker) => {
    if (copyingId) return
    setCopyingId(sticker.id)

    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate([50, 20, 50])

    try {
      if (sticker.path) {
        // Tenta clipboard em todos os dispositivos (desktop e mobile)
        await copyImageFallback(sticker.path)
        addToast('📋 Copiado! Cole no Instagram', 'success')
      } else {
        await navigator.clipboard.writeText(sticker.emoji)
        addToast('📋 Emoji copiado!', 'success')
      }

      onCopied?.(sticker)
    } catch (err) {
      console.error('Copy failed:', err)
      addToast('❌ Não foi possível copiar', 'error')
    }

    setTimeout(() => setCopyingId(null), 600)
  }, [copyingId, addToast, onCopied])

  const shareSticker = useCallback(async (sticker) => {
    if (!sticker.path) {
      addToast('❌ Sem imagem para compartilhar', 'error')
      return
    }

    try {
      const response = await fetch(sticker.path)
      const blob = await response.blob()
      const file = new File([blob], `${sticker.name}.png`, { type: blob.type })

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: 'Figurinha', files: [file] })
      } else {
        // Fallback: open in new tab
        window.open(sticker.path, '_blank')
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        addToast('❌ Falha ao compartilhar', 'error')
      }
    }
  }, [addToast])

  return { copySticker, shareSticker, copyingId, toasts }
}

async function copyImageFallback(imageUrl) {
  // Try Clipboard API with ClipboardItem
  if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
    const response = await fetch(imageUrl)
    const blob = await response.blob()

    // Convert to PNG if needed (Instagram prefers PNG)
    let finalBlob = blob
    if (blob.type !== 'image/png') {
      finalBlob = await convertToPng(blob)
    }

    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': finalBlob })
    ])
  } else {
    // Fallback: copy URL as text
    await navigator.clipboard.writeText(imageUrl)
  }
}

async function convertToPng(blob) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(blob)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      canvas.toBlob(resolve, 'image/png')
    }
    img.src = url
  })
}

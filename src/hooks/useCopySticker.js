import { useState, useCallback } from 'react'

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

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
        const isGif = sticker.path.toLowerCase().endsWith('.gif')

        if (isGif && isMobile) {
          // GIF no mobile: abre o compartilhamento do sistema → Instagram aceita como Stories/Reels
          const shared = await shareFile(sticker.path, sticker.name, 'image/gif')
          if (!shared) {
            await downloadImage(sticker.path, sticker.name, 'gif')
            addToast('💾 GIF salvo! Abra no Instagram e escolha da galeria', 'success')
          }
        } else {
          const copied = await tryClipboard(sticker.path)
          if (copied) {
            addToast('📋 Copiado! Cole no Instagram', 'success')
          } else {
            addToast('⚠️ Seu navegador não suporta copiar imagem. Use o botão de compartilhar.', 'error')
          }
        }
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

// Returns true if clipboard succeeded, false if not supported
async function tryClipboard(imageUrl) {
  if (typeof ClipboardItem === 'undefined' || !navigator.clipboard?.write) return false
  try {
    // A Promise é passada diretamente ao ClipboardItem para preservar o gesto do usuário
    // no mobile (await antes do write quebraria a user activation)
    const blobPromise = fetch(imageUrl)
      .then(r => r.blob())
      .then(blob => blob.type === 'image/png' ? blob : convertToPng(blob))

    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blobPromise })
    ])
    return true
  } catch {
    return false
  }
}

// Returns true if share was initiated, false if not supported
async function shareFile(imageUrl, name, mimeType) {
  if (!navigator.share) return false
  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    const ext = mimeType === 'image/gif' ? 'gif' : 'png'
    const file = new File([blob], `${name || 'figurinha'}.${ext}`, { type: mimeType })
    if (!navigator.canShare?.({ files: [file] })) return false
    await navigator.share({ files: [file], title: name || 'Figurinha' })
    return true
  } catch (err) {
    if (err.name === 'AbortError') return true // usuário fechou o sheet — não é erro
    return false
  }
}

async function downloadImage(imageUrl, name, ext = 'png') {
  const response = await fetch(imageUrl)
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${name || 'figurinha'}.${ext}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
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

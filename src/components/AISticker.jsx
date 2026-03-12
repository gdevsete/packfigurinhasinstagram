import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { removeBackground } from '@imgly/background-removal'

/* ─── API config ──────────────────────────────────────────── */
const GEMINI_KEY = 'AIzaSyAfwraL6ZZ9ogLS6vO3e4NjzS4-jRTGwyc'
const BASE = 'https://generativelanguage.googleapis.com/v1beta/models'

async function callImageAPI(promptText) {
  const errors = []

  for (const model of [
    'gemini-2.5-flash-image',
    'gemini-3-flash-image',
    'gemini-3.1-flash-image-preview',
    'gemini-3-pro-image-preview',
  ]) {
    try {
      const res = await fetch(`${BASE}/${model}:generateContent?key=${GEMINI_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
        }),
      })
      const data = await res.json()
      if (res.ok) {
        const part = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData)
        if (part?.inlineData) {
          return { data: part.inlineData.data, mimeType: part.inlineData.mimeType }
        }
        errors.push(`${model}: ok mas sem imagem — ${JSON.stringify(data).slice(0, 300)}`)
      } else {
        const msg = data?.error?.message || JSON.stringify(data).slice(0, 300)
        errors.push(`${model} [${res.status}]: ${msg}`)
      }
    } catch (e) {
      errors.push(`${model} exception: ${e.message}`)
    }
  }

  console.error('callImageAPI failures:', errors)
  throw new Error(errors.join('\n') || 'Não foi possível gerar a imagem.')
}

/* ─── Style presets ───────────────────────────────────────── */
const STYLES = [
  {
    id: 'graffiti',
    label: 'Graffiti',
    emoji: '🎨',
    desc: 'Street art colorido com spray',
    color: '#39ff14',
    prompt: (text) =>
      `Create a Brazilian Instagram sticker with the text "${text}". Style: vibrant street art graffiti. Bold 3D block letters with spray paint texture, colorful paint drips, neon lime green and hot pink colors, urban graffiti typography. The text should be clear and readable. White background only — no scenery, no floor, no walls — just the colorful text sticker isolated on pure white.`,
  },
  {
    id: 'neon',
    label: 'Neon Glow',
    emoji: '💡',
    desc: 'Letras com brilho neon',
    color: '#00d4ff',
    prompt: (text) =>
      `Create a Brazilian Instagram sticker with the text "${text}". Style: glowing neon sign. Bright neon tube letters with intense electric glow, colors: cyan, hot pink and electric purple. Bold neon light aesthetic. White background only — no background elements — just the glowing neon text isolated on white.`,
  },
  {
    id: '3d',
    label: '3D Bold',
    emoji: '🔠',
    desc: 'Texto 3D com profundidade',
    color: '#ffd700',
    prompt: (text) =>
      `Create a Brazilian Instagram sticker with the text "${text}". Style: bold 3D block letters. Chunky 3D extrusion, yellow-orange gradient fill, dark brown 3D shadow, cartoon bold fun style. White background only — just the 3D text design isolated on pure white, no background elements.`,
  },
  {
    id: 'cartoon',
    label: 'Cartoon HQ',
    emoji: '💥',
    desc: 'Estilo quadrinhos com contorno',
    color: '#ff2d78',
    prompt: (text) =>
      `Create a Brazilian Instagram sticker with the text "${text}". Style: comic book / cartoon pop art. Bold black thick outline around bright colored text, action burst / explosion shape behind the text, halftone dots, vibrant red and yellow. White background only — sticker isolated on white, no other elements.`,
  },
  {
    id: 'aquarela',
    label: 'Aquarela',
    emoji: '🎭',
    desc: 'Pintura aquarela artística',
    color: '#bc13fe',
    prompt: (text) =>
      `Create a Brazilian Instagram sticker with the text "${text}". Style: artistic watercolor brush lettering. Colorful watercolor splashes and bleeds behind bold hand-lettered text, purple, teal and coral watercolor washes. White background only — isolated sticker on white, no background scenery.`,
  },
  {
    id: 'fire',
    label: 'Em Chamas',
    emoji: '🔥',
    desc: 'Texto com chamas de fogo',
    color: '#ff6b00',
    prompt: (text) =>
      `Create a Brazilian Instagram sticker with the text "${text}". Style: fire flames effect. Bold block letters surrounded by realistic orange and red fire flames with yellow glow, sparks flying, intense hot visual. White background only — just the fiery text isolated on pure white.`,
  },
]

/* ─── helpers ────────────────────────────────────────────── */
function base64ToBlob(base64, mimeType) {
  const byteChars = atob(base64)
  const byteArr = new Uint8Array(byteChars.length)
  for (let i = 0; i < byteChars.length; i++) byteArr[i] = byteChars.charCodeAt(i)
  return new Blob([byteArr], { type: mimeType })
}

/* ─── Component ──────────────────────────────────────────── */
export default function AISticker({ onClose }) {
  const [text, setText]           = useState('')
  const [style, setStyle]         = useState(STYLES[0])
  const [loading, setLoading]     = useState(false)
  const [loadingStep, setStep]    = useState('')
  const [loadingPct, setPct]      = useState(0)
  const [result, setResult]       = useState(null) // { url, blob }
  const [error, setError]         = useState(null)
  const [copied, setCopied]       = useState(false)
  const prevUrlRef                = useRef(null)

  const generate = useCallback(async () => {
    if (!text.trim() || loading) return

    // Revoke previous object URL to avoid memory leaks
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current)
      prevUrlRef.current = null
    }

    setLoading(true)
    setError(null)
    setResult(null)
    setCopied(false)
    setPct(10)

    try {
      setStep('Gerando figurinha com IA...')

      const imageData = await callImageAPI(style.prompt(text.trim()))

      setPct(50)
      setStep('Removendo fundo...')

      const rawBlob = base64ToBlob(imageData.data, imageData.mimeType)

      const transparentBlob = await removeBackground(rawBlob, {
        debug: false,
        model: 'medium',
        output: { format: 'image/png', quality: 1 },
        progress: (key, cur, total) => {
          if (total > 0) {
            const pct = Math.round(50 + (cur / total) * 45)
            setPct(Math.min(pct, 95))
            if (key.startsWith('fetch') || key.startsWith('load')) {
              setStep(`Carregando modelo IA... ${Math.round((cur / total) * 100)}%`)
            } else {
              setStep('Removendo fundo...')
            }
          }
        },
      })

      const url = URL.createObjectURL(transparentBlob)
      prevUrlRef.current = url
      setPct(100)
      setResult({ url, blob: transparentBlob })

    } catch (err) {
      console.error(err)
      setError(err.message || 'Erro desconhecido. Tente novamente.')
    } finally {
      setLoading(false)
      setStep('')
      setPct(0)
    }
  }, [text, style, loading])

  const handleDownload = useCallback(() => {
    if (!result) return
    const a = document.createElement('a')
    a.href = result.url
    const slug = text.trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '').toLowerCase().slice(0, 30)
    a.download = `figurinha-${slug || 'ai'}-${style.id}.png`
    a.click()
  }, [result, text, style])

  const handleCopy = useCallback(async () => {
    if (!result) return
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': result.blob })])
      if (navigator.vibrate) navigator.vibrate([30, 10, 30])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      handleDownload()
    }
  }, [result, handleDownload])

  return (
    <motion.div
      className="ai-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="ai-panel"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="ai-panel-header">
          <div>
            <div className="ai-panel-title">✦ FIGURINHA COM IA</div>
            <div className="ai-panel-sub">IA Gratuita · Fundo Transparente</div>
          </div>
          <button className="ai-panel-close" onClick={onClose} aria-label="Fechar">✕</button>
        </div>

        <div className="ai-panel-body">

          {/* ── Text input ── */}
          <div className="ai-field">
            <label className="ai-field-label">TEXTO DA FIGURINHA</label>
            <textarea
              className="ai-textarea"
              placeholder={"Bom dia pra nóis\nClica, comenta e compartilha\nÉ nois que tá!"}
              value={text}
              onChange={e => setText(e.target.value)}
              maxLength={120}
              rows={3}
              disabled={loading}
            />
            <div className="ai-char-count">{text.length}<span>/120</span></div>
          </div>

          {/* ── Style grid ── */}
          <div className="ai-field">
            <label className="ai-field-label">ESTILO</label>
            <div className="ai-styles-grid">
              {STYLES.map(s => (
                <button
                  key={s.id}
                  className={`ai-style-card ${style.id === s.id ? 'active' : ''}`}
                  style={{ '--sc': s.color }}
                  onClick={() => setStyle(s)}
                  disabled={loading}
                >
                  <span className="ai-style-emoji">{s.emoji}</span>
                  <span className="ai-style-name">{s.label}</span>
                  <span className="ai-style-desc">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Generate button ── */}
          <button
            className="ai-generate-btn"
            onClick={generate}
            disabled={loading || !text.trim()}
          >
            {loading ? (
              <span className="ai-btn-loading">
                <span className="ai-spinner" />
                {loadingStep || 'Processando...'}
              </span>
            ) : (
              '✦ GERAR FIGURINHA'
            )}
          </button>

          {/* ── Loading bar ── */}
          {loading && (
            <div className="ai-progress-bar">
              <motion.div
                className="ai-progress-fill"
                animate={{ width: `${loadingPct}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          )}

          {/* ── Note about first load ── */}
          {loading && loadingPct < 50 && (
            <p className="ai-hint">
              💡 Na primeira vez pode demorar um pouco enquanto o modelo carrega.
            </p>
          )}

          {/* ── Error ── */}
          {error && (
            <motion.div
              className="ai-error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ⚠ {error}
            </motion.div>
          )}

          {/* ── Result ── */}
          <AnimatePresence>
            {result && (
              <motion.div
                className="ai-result"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="ai-result-canvas">
                  <img
                    src={result.url}
                    alt="Figurinha gerada"
                    className="ai-result-img"
                  />
                </div>

                <div className="ai-result-actions">
                  <button
                    className={`ai-action-btn ${copied ? 'ai-action-copied' : 'ai-action-copy'}`}
                    onClick={handleCopy}
                  >
                    {copied ? '✔ Copiado!' : '📋 Copiar'}
                  </button>
                  <button className="ai-action-btn ai-action-download" onClick={handleDownload}>
                    ⬇ Baixar PNG
                  </button>
                  <button
                    className="ai-action-btn ai-action-regen"
                    onClick={generate}
                    disabled={loading}
                  >
                    🔄 Gerar novamente
                  </button>
                </div>

                <p className="ai-result-hint">
                  Figurinha com fundo transparente • pronta para usar no Instagram
                </p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </motion.div>
  )
}

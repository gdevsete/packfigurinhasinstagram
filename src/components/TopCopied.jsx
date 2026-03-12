import { motion } from 'framer-motion'

export default function TopCopied({ stickers, onCopy, onPreview }) {
  if (!stickers.length) return null

  return (
    <div className="top-copied-section">
      <div className="section-title">
        🔥 Mais copiadas
      </div>
      <div className="top-copied-scroll">
        {stickers.map((s, i) => (
          <motion.div
            key={s.id}
            className="top-copied-item"
            whileTap={{ scale: 0.93 }}
            onClick={() => onCopy(s)}
            onContextMenu={e => { e.preventDefault(); onPreview(s) }}
          >
            <div className="top-copied-rank">#{i + 1}</div>
            <div className="top-copied-img-wrap">
              <img src={s.path} alt={s.name} />
            </div>
            <div className="top-copied-count">{s.copyCount}×</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

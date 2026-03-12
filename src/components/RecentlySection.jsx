import { motion } from 'framer-motion'

export default function RecentlySection({ items, onCopy }) {
  if (!items.length) return null

  return (
    <div className="recently-copied">
      <div className="section-title">⚡ Copiados Recentemente</div>
      <div className="recently-scroll">
        {items.map((sticker, i) => (
          <motion.div
            key={sticker.id + i}
            className="recent-item"
            whileTap={{ scale: 0.9 }}
            onClick={() => onCopy(sticker)}
            title={sticker.name}
          >
            {sticker.path ? (
              <img src={sticker.path} alt={sticker.name} loading="lazy" />
            ) : (
              <span style={{ fontSize: '36px', lineHeight: 1 }}>{sticker.emoji}</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

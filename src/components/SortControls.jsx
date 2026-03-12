const OPTIONS = [
  { value: 'default',  label: '✦ Padrão'      },
  { value: 'newest',   label: '🆕 Mais Novas'  },
  { value: 'popular',  label: '🔥 Mais Copiadas'},
  { value: 'az',       label: '🔤 A → Z'       },
  { value: 'za',       label: '🔤 Z → A'       },
]

export default function SortControls({ sortBy, onSortChange }) {
  return (
    <div className="sort-controls">
      <select
        className="sort-select"
        value={sortBy}
        onChange={e => onSortChange(e.target.value)}
        aria-label="Ordenar por"
      >
        {OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

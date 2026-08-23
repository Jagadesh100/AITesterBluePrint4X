import { tagColor } from '../utils/helpers'

export default function TagChip({ tag, onRemove }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${tagColor(tag)}`}
    >
      {tag}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-current opacity-60 hover:opacity-100"
          aria-label={`Remove tag ${tag}`}
        >
          ×
        </button>
      )}
    </span>
  )
}

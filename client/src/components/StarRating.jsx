import { Star } from 'lucide-react'

export default function StarRating({ rating = 0, numReviews, size = 16, interactive = false, onRate }) {
  const stars = [1, 2, 3, 4, 5]
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {stars.map((star) => {
          const filled = star <= Math.round(rating)
          const half = !filled && star - 0.5 <= rating
          return (
            <button
              key={star}
              disabled={!interactive}
              onClick={() => interactive && onRate?.(star)}
              className={`${interactive ? 'cursor-pointer hover:scale-125 transition-transform' : 'cursor-default'}`}
            >
              <Star
                size={size}
                className={filled || half ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}
              />
            </button>
          )
        })}
      </div>
      {numReviews !== undefined && (
        <span className="text-slate-400 text-xs">({numReviews})</span>
      )}
    </div>
  )
}

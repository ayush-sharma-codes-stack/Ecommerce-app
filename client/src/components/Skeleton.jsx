export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="shimmer h-56 w-full" />
      <div className="p-4 space-y-3">
        <div className="shimmer h-4 rounded-lg w-3/4" />
        <div className="shimmer h-3 rounded-lg w-1/2" />
        <div className="shimmer h-5 rounded-lg w-1/3" />
        <div className="shimmer h-9 rounded-xl w-full" />
      </div>
    </div>
  )
}

export function PageSkeleton({ rows = 6 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="shimmer h-12 rounded-xl" />
      ))}
    </div>
  )
}

export function OrderCardSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex justify-between">
        <div className="shimmer h-5 rounded-lg w-32" />
        <div className="shimmer h-5 rounded-full w-20" />
      </div>
      <div className="shimmer h-4 rounded-lg w-48" />
      <div className="shimmer h-4 rounded-lg w-24" />
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="shimmer w-20 h-20 rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="shimmer h-6 rounded-lg w-48" />
          <div className="shimmer h-4 rounded-lg w-64" />
        </div>
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="shimmer h-12 rounded-xl" />
      ))}
    </div>
  )
}

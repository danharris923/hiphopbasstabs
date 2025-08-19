/**
 * Loading skeleton components for different UI elements
 */

export function VideoSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="aspect-video bg-gray-200 rounded-lg mb-2"></div>
      <div className="flex justify-between items-center">
        <div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  )
}

export function TabSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 bg-gray-200 rounded w-48"></div>
        <div className="h-5 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="bg-gray-200 rounded-lg p-4 mb-4" style={{ height: '200px' }}>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="h-8 bg-gray-200 rounded w-16"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  )
}

export function TrackInfoSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="flex space-x-2">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <TrackInfoSkeleton className="mb-8" />
      
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <VideoSkeleton />
        <VideoSkeleton />
      </div>
      
      <TabSkeleton />
    </div>
  )
}
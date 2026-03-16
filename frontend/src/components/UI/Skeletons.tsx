export const SkeletonBox = ({ className = '' }: { className?: string }) => (
  <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} />
);

export const SkeletonText = ({ className = '' }: { className?: string }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
);

export const CourseCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full animate-pulse">
    <div className="flex items-center space-x-4 mb-6">
      <SkeletonBox className="w-16 h-16 rounded-2xl bg-primary-100/50" />
      <div className="flex-1">
        <SkeletonText className="h-6 w-3/4 mb-2" />
        <SkeletonText className="h-4 w-1/2" />
      </div>
    </div>
    
    <div className="space-y-3 mb-8 flex-1">
      <SkeletonText className="h-4 w-full" />
      <SkeletonText className="h-4 w-5/6" />
      <SkeletonText className="h-4 w-4/6" />
    </div>
    
    <div className="mt-auto">
      <div className="flex items-center justify-between border-t border-gray-100 pt-5">
        <SkeletonText className="h-5 w-24" />
        <SkeletonBox className="h-8 w-24 rounded-full" />
      </div>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="w-full">
    <div className="flex flex-col">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center p-4 border-b border-gray-100 animate-pulse">
          <SkeletonBox className="h-10 w-24 mr-4" />
          <div className="flex-1 mr-4">
            <SkeletonText className="h-5 w-1/3 mb-2" />
            <SkeletonText className="h-4 w-1/4" />
          </div>
          <SkeletonBox className="h-8 w-16 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

export const VideoCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row h-auto sm:h-32 mb-4 animate-pulse">
    <SkeletonBox className="h-40 sm:h-full w-full sm:w-48 flex-shrink-0 rounded-none" />
    <div className="p-4 flex-1 flex flex-col justify-center">
      <SkeletonText className="h-6 w-3/4 mb-2" />
      <SkeletonText className="h-4 w-full mb-3" />
      <div className="flex gap-2">
        <SkeletonBox className="h-6 w-16" />
        <SkeletonBox className="h-6 w-16" />
      </div>
    </div>
  </div>
);

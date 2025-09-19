import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className, ...props }: SkeletonProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700",
        className
      )}
      {...props}
    />
  )
}

export function MessageSkeleton({ isUser = false }: { isUser?: boolean }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${isUser ? 'items-end' : 'items-start'} flex flex-col space-y-2`}>
        <Skeleton className={`h-16 ${isUser ? 'w-48' : 'w-56'} rounded-2xl`} />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

export function ChatroomSkeleton() {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  )
}

export function CountrySkeleton() {
  return (
    <div className="flex items-center gap-3 p-2">
      <Skeleton className="w-6 h-4" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-12 ml-auto" />
    </div>
  )
}

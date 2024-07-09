import { Skeleton } from "../ui/skeleton";

export default function AccommodationDetailsSkeleton() {
  return (
    <div className="w-full space-y-8 my-5">
      <div className="w-full h-96">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-1/3 h-10" />
        <Skeleton className="w-1/4 h-6" />
      </div>
      <div className="space-y-4">
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-[80%] h-8" />
        <Skeleton className="w-[60%] h-8" />
      </div>
      <div className="space-y-4">
        <Skeleton className="w-[40%] h-8" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="w-[35%] h-6" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="w-[40%] h-8" />
        <div className="grid grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-[200px]" />
          ))}
        </div>
      </div>
    </div>
  );
}

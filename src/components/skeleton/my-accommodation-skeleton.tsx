import { Skeleton } from "../ui/skeleton";

export default function MyAccommodationSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="w-full h-10" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="w-full h-16" />
          <Skeleton className="w-full h-16" />
          <Skeleton className="w-full h-16" />
          <Skeleton className="w-full h-16" />
        </div>
      ))}
    </div>
  );
}

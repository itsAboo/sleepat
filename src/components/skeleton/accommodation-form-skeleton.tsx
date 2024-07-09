import { Skeleton } from "../ui/skeleton";

export default function AccommodationFormSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-4 my-5">
      <div className="space-y-6 w-full">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-32" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-14" />
        <Skeleton className="w-full h-52" />
      </div>
      <div className="space-y-6 w-full">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-52" />
        <Skeleton className="w-full h-16" />
      </div>
    </div>
  );
}

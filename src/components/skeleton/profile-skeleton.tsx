import { Skeleton } from "../ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="w-full flex flex-col md:flex-row lg:gap-40 md:gap-20">
      <div className="md:w-1/2 w-full flex justify-center mb-5">
        <Skeleton className="lg:w-72 lg:h-72 md:h-52 md:w-52 w-32 h-32 rounded-full" />
      </div>
      <div className="space-y-6 w-full">
        <Skeleton className="w-full h-10" />
        <div className="flex gap-5">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}

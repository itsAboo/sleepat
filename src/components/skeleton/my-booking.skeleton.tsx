import { Skeleton } from "../ui/skeleton";

export default function MyBookingSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="w-full h-48">
          <div className="flex w-full gap-4 h-full">
            <div className="xl:w-1/3 w-full">
              <Skeleton className="w-full h-full" />
            </div>
            <div className="flex flex-col space-y-4 w-full">
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-[80%] h-8" />
              <Skeleton className="w-[60%] h-8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import { Skeleton } from "../ui/skeleton";

export default function AccommodationListSkeleton() {
  return (
    <div className="grid xl:grid-cols-3 md:grid-cols-2 sm:gap-2 gap-4 mb-5">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="flex sm:flex-row flex-col gap-3 w-full">
          <Skeleton className="w-full h-[200px] rounded-xl" />
          <div className="space-y-4 w-full">
            <Skeleton className="w-[100%] sm:h-5 h-8" />
            <Skeleton className="sm:w-[100%] w-[80%] h-6 sm:h-5" />
            <Skeleton className="sm:w-[80%] sm:h-5 w-[70%] h-6" />
          </div>
        </div>
      ))}
    </div>
  );
}

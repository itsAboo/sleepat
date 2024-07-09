import AccommodationList from "@/components/home/accommodation-list";
import FilterBar from "@/components/home/filter-bar";
import SearchBar from "@/components/home/search-bar";
import AccommodationListSkeleton from "@/components/skeleton/accommodation-list-skeleton";
import { Suspense } from "react";

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <>
      <FilterBar />
      <SearchBar />
      <Suspense fallback={<AccommodationListSkeleton />}>
        <AccommodationList searchParams={searchParams} />
      </Suspense>
    </>
  );
}

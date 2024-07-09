import { getAllMyAccommodation } from "@/api/auth";
import AccommodationListTable from "@/components/accommodation/accommodation-list-table";
import MyAccommodationSkeleton from "@/components/skeleton/my-accommodation-skeleton";
import { Suspense } from "react";

const MyAccommodation = async () => {
  const accommodation = await getAllMyAccommodation();
  return <AccommodationListTable accommodation={accommodation} />;
};

export default function MyAccommodationPage() {
  return (
    <div className="mt-5">
      <h1 className="mb-5 text-2xl font-bold">My Accommodation</h1>
      <Suspense fallback={<MyAccommodationSkeleton />}>
        <MyAccommodation />
      </Suspense>
    </div>
  );
}

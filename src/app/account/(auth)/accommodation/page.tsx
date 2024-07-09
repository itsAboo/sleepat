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
    <div className="md:mt-5 mt-2">
      <h1 className="md:mb-5 mb-2 text-2xl font-bold">My Accommodation</h1>
      <Suspense fallback={<MyAccommodationSkeleton />}>
        <MyAccommodation />
      </Suspense>
    </div>
  );
}

import { getAccommodation } from "@/api/accommodation";
import RoomCard from "@/components/accommodation/room-card";
import AccommodationDetailsSkeleton from "@/components/skeleton/accommodation-details-skeleton";
import { getUser } from "@/lib/lucia";
import { amenitieIcon } from "@/util/amenities";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}) => {
  const accommodation = await getAccommodation(params.id);
  return {
    title: accommodation.name + " | Sleep-at",
  };
};

const AccommodationDetail = async ({ id }: { id: string }) => {
  const { user } = await getUser();
  const accommodation = await getAccommodation(id);
  if (!accommodation) {
    return notFound();
  }

  return (
    <div className="mt-5">
      <div className="relative w-full h-96 rounded-sm overflow-hidden">
        <Image
          className="object-cover"
          src={accommodation.image?.url || ""}
          alt={accommodation.name || ""}
          fill
        />
      </div>
      <div className="mt-5">
        <h1 className="text-3xl font-bold">{accommodation.name}</h1>
        <p className="text-sm">{accommodation.address}</p>
        <hr className="my-8" />
        <p>{accommodation.description}</p>
        <hr className="my-8" />
        <div>
          <h2 className="font-bold text-xl">Highlights</h2>
          <div className="grid grid-cols-2 gap-2 mt-5">
            {accommodation.amenities?.map((amen) => (
              <div className="flex items-center gap-3 mb-3" key={amen}>
                <span>{amenitieIcon(amen)}</span>
                <p>{amen}</p>
              </div>
            ))}
          </div>
        </div>
        <hr className="my-8" />
        <div className="text-xl font-bold mb-8">
          <h2>Room available at {accommodation.name}</h2>
          <div className="mt-5 grid lg:grid-cols-2 gap-3 gap-y-7">
            {accommodation.rooms?.map((room) => (
              <RoomCard
                user={{
                  email: user?.email,
                  firstName: user?.firstName,
                  lastName: user?.lastName,
                }}
                accommodation={accommodation}
                key={room._id}
                room={room}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AccommodationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <Suspense fallback={<AccommodationDetailsSkeleton />}>
      <AccommodationDetail id={params.id} />
    </Suspense>
  );
}

import Link from "next/link";
import AccommodationCard from "./accommodation-card";
import { getAllAccommodation } from "@/api/accommodation";

export default async function AccommodationList({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const accommodation = await getAllAccommodation(searchParams);

  return (
    <>
      {accommodation?.length! > 0 ? (
        <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-2 mb-5">
          {accommodation!.map((acc) => (
            <Link key={acc._id} href={`/accommodation/details/${acc._id}`}>
              <AccommodationCard
                name={acc.name}
                state={acc.state}
                country={acc.country}
                description={acc.description}
                image={acc.image}
                minPricePerNight={acc.minPricePerNight}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h1>No result.</h1>
        </div>
      )}
    </>
  );
}

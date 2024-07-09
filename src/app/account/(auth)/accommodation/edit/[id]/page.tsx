import { getAccommodation } from "@/api/accommodation";
import AccommodationEditForm from "@/components/accommodation/accommodation-edit-form";
import { getUser } from "@/lib/lucia";
import { notFound } from "next/navigation";

export default async function EditAccommodation({
  params,
}: {
  params: { id: string };
}) {
  const { user } = await getUser();
  const accommodation = await getAccommodation(params.id);
  if (user?.id.toString() !== accommodation.userId) {
    return notFound();
  }
  if (!accommodation) {
    return notFound();
  }
  return (
    <>
      <h1 className="text-2xl font-bold my-2 md:my-5">Edit your accommodation</h1>
      <AccommodationEditForm accommodation={accommodation} />
    </>
  );
}

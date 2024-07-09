import AccommodationForm from "@/components/accommodation/accommodation-form";

export default async function CreateNewAccommodation() {
  return (
    <>
      <h1 className="text-2xl font-bold my-5">Describe your accommodation</h1>
      <AccommodationForm />
    </>
  );
}

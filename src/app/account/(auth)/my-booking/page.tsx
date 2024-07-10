import { getAllMyBooking } from "@/api/auth";
import BookingList from "@/components/booking/booking-list";
import MyBookingSkeleton from "@/components/skeleton/my-booking.skeleton";
import { Suspense } from "react";

const MyBooking = async () => {
  const bookings = await getAllMyBooking();
  return (
    <>
      {bookings.length < 1 ? (
        <h1 className="mt-5 text-center">No result</h1>
      ) : (
        <BookingList bookings={bookings} />
      )}
    </>
  );
};

export default function MyBookingPage() {
  return (
    <>
      <h1 className="my-5 text-2xl font-bold">My Booking</h1>
      <Suspense fallback={<MyBookingSkeleton />}>
        <MyBooking />
      </Suspense>
    </>
  );
}

export const dynamic = "force-dynamic";

import BookingList from "@/components/booking/booking-list";
import MyBookingSkeleton from "@/components/skeleton/my-booking.skeleton";
import { lucia } from "@/lib/lucia";
import { IBooking } from "@/models/booking.model";
import { cookies } from "next/headers";
import { Suspense } from "react";

const MyBooking = async () => {
  try {
    const response = await fetch(`${process.env.AUTH_API}/booking`, {
      headers: {
        Authorization: `Bearer ${JSON.stringify(
          cookies().get(lucia.sessionCookieName)
        )}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    const data = await response.json();
    const bookings = data.bookings as IBooking[];
    return (
      <>
        {bookings.length < 1 ? (
          <h1 className="mt-5 text-center">No result</h1>
        ) : (
          <BookingList bookings={bookings} />
        )}
      </>
    );
  } catch (error: any) {
    console.log(error);
    throw error;
  }
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

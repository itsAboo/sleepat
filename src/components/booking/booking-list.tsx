"use client";

import { IBooking } from "@/models/booking.model";
import BookingCard from "./booking-card";

export default function BookingList({ bookings }: { bookings: IBooking[] }) {
  const sortedBookings = bookings.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return (
    <div className="grid md:grid-cols-2  gap-3 xl:flex xl:flex-col xl:gap-5 mb-5">
      {sortedBookings.map((booking) => (
        <BookingCard key={booking._id} booking={booking} />
      ))}
    </div>
  );
}

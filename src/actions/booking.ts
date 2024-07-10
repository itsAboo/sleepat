"use server";

import { getUser } from "@/lib/lucia";
import dbConnect from "@/lib/mongoose";
import Accommodation, {
  IAccommodation,
  IRoom,
} from "@/models/accommodation.model";
import Booking from "@/models/booking.model";
import { differenceInCalendarDays } from "date-fns";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";
import { DateRange } from "react-day-picker";
import { redirect } from "next/navigation";
import { checkDateOverlap } from "@/util/format";

export const createBooking = async (
  date: DateRange,
  accommodation: IAccommodation,
  room: IRoom
) => {
  const { user } = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  if (!date.from || !date.to) {
    throw new Error("Date range is required");
  }

  try {
    await dbConnect();
    const roomBookings = await Booking.find({ roomId: room._id });
    const roomBookingDates = roomBookings?.map((booking) => ({
      startDate: booking.startDate,
      endDate: booking.endDate,
    }));

    const isDateOverlap = checkDateOverlap(
      date.from,
      date.to,
      roomBookingDates!
    );
    if (isDateOverlap) {
      throw new Error("Date has overlap");
    }
    const days = differenceInCalendarDays(date.to, date.from);
    const totalPrice = room.pricePerNight! * days;

    const newBooking = {
      roomId: room._id,
      userId: user.id,
      userEmail: user.email,
      accommodationId: accommodation._id,
      ownerId: accommodation.userId,
      startDate: date.from,
      endDate: date.to,
      nightStaying: days,
      totalPrice: totalPrice,
    };
    const result = await Booking.create(newBooking);

    await Accommodation.findOneAndUpdate(
      {
        _id: accommodation._id,
        userId: accommodation.userId,
      },
      {
        $push: { bookings: result._id },
      },
      { new: true, useFindAndModify: false }
    );
    revalidatePath("/", "layout");
  } catch (error: any) {
    console.log(error);
    if (isRedirectError(error)) {
      throw error;
    }
    console.log(error);
  }
  return redirect("/account/my-booking");
};

export const confirmPaid = async (bookId: string) => {
  const { user } = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  if (!bookId) {
    return { error: true, message: "id is invalid" };
  }
  try {
    await Booking.findOneAndUpdate({ _id: bookId }, { status: "Paid" });
    revalidatePath("/", "layout");
  } catch (error) {
    console.log(error);
  }
};

export const cancelBooking = async (bookId: string, accId: string) => {
  const { user } = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  if (!bookId || !accId) {
    return { error: true, message: "id is invalid" };
  }
  try {
    await Booking.findOneAndDelete({ _id: bookId });
    await Accommodation.findOneAndUpdate(
      { _id: accId },
      { $pull: { bookings: bookId } }
    );
    revalidatePath("/", "layout");
  } catch (error) {
    console.log(error);
  }
};

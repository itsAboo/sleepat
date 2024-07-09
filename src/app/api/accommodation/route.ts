import dbConnect from "@/lib/mongoose";
import Accommodation, { IAccommodation } from "@/models/accommodation.model";
import Booking from "@/models/booking.model";
import { checkDateOverlap } from "@/util/format";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country");
  const state = searchParams.get("state");
  const keyword = searchParams.get("keyword");
  const category = searchParams.get("category");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const query: any = { status: "success" };
  if (country) query.country = country;
  if (state) query.state = state;
  if (category) query.category = category;
  if (keyword) query.name = { $regex: keyword, $options: "i" };

  try {
    await dbConnect();
    const accommodations = (await Accommodation.find(
      query
    )) as IAccommodation[];

    const accommodationsWithBooking = (await Booking.populate(accommodations, {
      path: "bookings",
      select: "startDate endDate",
    })) as IAccommodation[];

    if (from && to) {
      const availableAccommodations = accommodationsWithBooking.filter(
        (acc) => {
          const accBookingDates = acc.bookings?.map((booking) => ({
            startDate: new Date(booking.startDate),
            endDate: new Date(booking.endDate),
          }));

          const isOverlap = checkDateOverlap(
            new Date(from),
            new Date(to),
            accBookingDates!
          );

          return !isOverlap;
        }
      );

      return NextResponse.json(
        { accommodation: availableAccommodations },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { accommodation: accommodationsWithBooking },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

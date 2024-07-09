import dbConnect from "@/lib/mongoose";
import Accommodation, { IAccommodation } from "@/models/accommodation.model";
import Booking from "@/models/booking.model";
import { NextResponse } from "next/server";

export const GET = async (
  _req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    await dbConnect();
    const accommodation = (await Accommodation.findById(
      params.id
    )) as IAccommodation;
    const bookings = await Booking.find({
      _id: { $in: accommodation.bookings },
    });
    accommodation.bookings = bookings;
    return NextResponse.json({ accommodation }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
};

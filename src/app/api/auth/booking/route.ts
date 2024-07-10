import dbConnect from "@/lib/mongoose";
import { validateRequest } from "@/lib/lucia";
import Booking from "@/models/booking.model";
import { NextResponse } from "next/server";
import Accommodation, { IRoom } from "@/models/accommodation.model";
import User from "@/models/user.model";

interface IBookingDoc {
  _id: string;
  roomId: string;
  userId: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    address: string;
  };
  userEmail: string;
  accommodationId: {
    _id: string;
    image: {
      id: string;
      url: string;
    };
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    amenities: string[];
    rooms: IRoom[];
  };
  ownerId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  nightStaying: number;
  status: "pending" | "success";
  createdAt: Date;
  updatedAt: Date;
}

export const GET = async (req: Request) => {
  await dbConnect();
  if (!req.headers.get("Authorization")) {
    return NextResponse.json(
      { message: "Authorization is required" },
      { status: 400 }
    );
  }
  const authSession = req.headers.get("Authorization")?.split(" ")[1];
  const sessionId = JSON.parse(authSession as string).value;
  const { user } = await validateRequest(sessionId);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const bookings = await Booking.find({
      userId: user.id,
      userEmail: user.email,
    });

    const bookingsWithUser = await User.populate(bookings, {
      path: "userId",
      select: "email firstName lastName address",
      model: "User",
    });

    const bookingsWithUserAndAccommodation = (await Accommodation.populate(
      bookingsWithUser,
      {
        path: "accommodationId",
        select: "name address city state country amenities image rooms",
      }
    )) as IBookingDoc[];

    const formatBookings = bookingsWithUserAndAccommodation.map((booking) => {
      const room = booking.accommodationId.rooms.find(
        (room) => room._id?.toString() === booking.roomId
      );
      return {
        ...booking,
        accommodation: booking.accommodationId,
        accommodationId: undefined,
        user: booking.userId,
        userId: undefined,
        userEmail: undefined,
        ownerId: undefined,
        roomId: undefined,
        room: room,
      };
    });

    return NextResponse.json({ bookings: formatBookings }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

import mongoose from "mongoose";
import { IAccommodation, IRoom } from "./accommodation.model";
import { IUser } from "./user.model";

export interface IBooking {
  _id: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  nightStaying: number;
  status: "Not paid" | "Paid";
  createdAt: Date;
  updatedAt: Date;
  accommodation: IAccommodation;
  user: IUser;
  roomId? : string;
  room: IRoom;
}

export interface IBookingDoc {
  roomId?: string;
  userId?: string;
  userEmail?: string;
  accommodationId?: string;
  ownerId?: string;
  startDate?: Date;
  endDate?: Date;
  totalPrice?: number;
  nightStaying?: number;
  status?: string;
}

const bookingSchema = new mongoose.Schema<IBookingDoc>(
  {
    roomId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    accommodationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Accommodation",
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    nightStaying: {
      type: Number,
    },
    status: {
      type: String,
      default: "Not paid",
    },
  },
  { timestamps: true }
);

const Booking =
  mongoose.models.Booking ||
  mongoose.model<typeof bookingSchema>("Booking", bookingSchema);

export default Booking;

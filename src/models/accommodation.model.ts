import mongoose from "mongoose";
import { IBooking } from "./booking.model";

export interface IAccommodation {
  _id?: string;
  userId?: string;
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  amenities?: string[];
  image?: { id: string; url: string };
  category?: string;
  minPricePerNight?: number;
  status?: "pending" | "success" | "failed";
  rooms?: IRoom[];
  bookings?: IBooking[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRoom {
  _id?: string;
  name?: string;
  size?: number;
  maxGuest?: number;
  feature?:
    | "Balcony/terrace"
    | "Outdoor view"
    | "City view"
    | "Ocean view"
    | "Sea view"
    | "Garden view";
  pricePerNight?: number;
  bedType?: "Single" | "Twin" | "Double" | "Full" | "Queen" | "King";
  bedCount?: number;
  bathRoomCount?: number;
  image?: { id: string; url: string };
}

const accommodationSchema = new mongoose.Schema<IAccommodation>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
      required: true,
    },
    amenities: {
      type: [String],
    },
    image: {
      id: String,
      url: String,
    },
    category: {
      type: String,
      default: "house",
    },
    minPricePerNight: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    rooms: [
      {
        name: {
          type: String,
          required: true,
        },
        size: {
          type: Number,
          required: true,
        },
        maxGuest: {
          type: Number,
          required: true,
        },
        feature: String,
        pricePerNight: {
          type: Number,
          required: true,
        },
        bedType: {
          type: String,
          required: true,
        },
        bedCount: {
          type: Number,
          required: true,
        },
        bathRoomCount: {
          type: Number,
          required: true,
        },
        image: {
          id: String,
          url: String,
        },
      },
    ],
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Booking",
      },
    ],
  },
  { timestamps: true }
);

const Accommodation =
  mongoose.models.Accommodation ||
  mongoose.model<IAccommodation>("Accommodation", accommodationSchema);

export default Accommodation;

import { lucia } from "@/lib/lucia";
import { IAccommodation } from "@/models/accommodation.model";
import { IBooking } from "@/models/booking.model";
import { cookies } from "next/headers";

export const getAllMyAccommodation = async () => {
  try {
    const response = await fetch(`${process.env.AUTH_API}/accommodation`, {
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
    return data.accommodation as IAccommodation[];
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

export const getAllMyBooking = async () => {
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
    return data.bookings as IBooking[];
  } catch (error: any) {
    console.error("Error on getAllMyBooking");
    console.log(error);
    throw error;
  }
};

"use server";

import { deleteImage, uploadImage } from "@/lib/cloundinary";
import { getUser } from "@/lib/lucia";
import dbConnect from "@/lib/mongoose";
import Accommodation from "@/models/accommodation.model";
import { jsonParse } from "@/util/format";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";

export const addRoom = async (formData: FormData, accId: string) => {
  const { user } = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  if (!accId) {
    throw new Error("Invalid accommodation id");
  }
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("Image is required");
  }

  try {
    await dbConnect();
    const result = await uploadImage(file);
    const newRoom = {
      name: formData.get("name"),
      size: JSON.parse(formData.get("size") as string),
      maxGuest: JSON.parse(formData.get("maxGuest") as string),
      feature: jsonParse(formData.get("feature") as string),
      pricePerNight: JSON.parse(formData.get("pricePerNight") as string),
      bedType: formData.get("bedType"),
      bedCount: JSON.parse(formData.get("bedCount") as string),
      bathRoomCount: JSON.parse(formData.get("bathRoomCount") as string),
      image: result,
    };

    await Accommodation.findOneAndUpdate(
      { _id: accId, userId: user.id },
      { $push: { rooms: newRoom }, status: "success" },
      { new: true, useFindAndModify: false }
    );

    revalidatePath("/", "layout");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.log(error);
  }
};

export const updateRoom = async (
  formData: FormData,
  accId: string,
  roomId: string,
  image: { id: string; url: string }
) => {
  const { user } = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  if (!accId || !roomId) {
    throw new Error("id is required");
  }
  let result = image;
  const file = formData.get("file") as File;
  try {
    await dbConnect();
    if (file.size !== 0) {
      await deleteImage(image.id);
      result = await uploadImage(file as File);
    }
    const updateRoom = {
      name: formData.get("name"),
      size: JSON.parse(formData.get("size") as string),
      maxGuest: JSON.parse(formData.get("maxGuest") as string),
      feature: jsonParse(formData.get("feature") as string),
      pricePerNight: JSON.parse(formData.get("pricePerNight") as string),
      bedType: formData.get("bedType"),
      bedCount: JSON.parse(formData.get("bedCount") as string),
      bathRoomCount: JSON.parse(formData.get("bathRoomCount") as string),
      image: result,
    };
    await Accommodation.findOneAndUpdate(
      {
        _id: accId,
        userId: user.id,
        "rooms._id": roomId,
      },
      { $set: { "rooms.$": updateRoom } }
    );
    revalidatePath("/", "layout");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.log(error);
  }
};

export const deleteRoom = async (accId: string, roomId: string) => {
  const { user } = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  if (!roomId || !accId) {
    throw new Error("id is required");
  }

  try {
    const result = await Accommodation.findOneAndUpdate(
      { _id: accId, userId: user.id },
      { $pull: { rooms: { _id: roomId } } },
      { new: true }
    );
    if (result.rooms.length < 1) {
      await Accommodation.findOneAndUpdate(
        { _id: accId, userId: user.id },
        { status: "pending" }
      );
    }
    revalidatePath("/", "layout");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.log(error);
  }
};

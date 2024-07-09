"use server";

import { deleteImage, deleteImages, uploadImage } from "@/lib/cloundinary";
import { getUser } from "@/lib/lucia";
import dbConnect from "@/lib/mongoose";
import Accommodation, { IAccommodation } from "@/models/accommodation.model";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";

export const createAccommodation = async (formData: FormData) => {
  const { user } = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const file = formData.get("file");
  if (!file) {
    throw new Error("Image is required");
  }
  try {
    await dbConnect();
    const result = await uploadImage(file as File);
    const newAccommodation = {
      userId: user.id,
      name: formData.get("name"),
      description: formData.get("description"),
      address: formData.get("address"),
      category: formData.get("category"),
      amenities: JSON.parse(formData.get("amenities") as string),
      country: formData.get("country"),
      state: formData.get("state"),
      city: formData.get("city"),
      minPricePerNight: formData.get("minPricePerNight"),
      image: result,
    };
    await Accommodation.create(newAccommodation);
    revalidatePath("/", "layout");
    return redirect("/account/accommodation");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.log(error);
  }
};

export const deleteAccommodation = async (accId: string) => {
  const { user } = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const accommodation = (await Accommodation.find({
      _id: accId,
      userId: user.id,
    })) as IAccommodation[];

    if (accommodation.length < 1) {
      throw new Error("Accommodation not found");
    }
    await deleteImage(accommodation[0].image?.id as string);
    if (accommodation[0].rooms?.length! > 0) {
      await deleteImages(
        accommodation[0].rooms?.map((room) => room.image?.id)! as string[]
      );
    }
    await Accommodation.deleteOne({ _id: accId });
    revalidatePath("/", "layout");
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateAccommodation = async (
  formData: FormData,
  accId: string
) => {
  const { user } = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  if (!accId) {
    throw new Error("Invalid accommodation id");
  }
  let result;
  const file = formData.get("file") as File;

  try {
    await dbConnect();
    if (file.size !== 0) {
      result = await uploadImage(file as File);
    }
    const updateAccommodation = {
      name: formData.get("name"),
      description: formData.get("description"),
      address: formData.get("address"),
      category: formData.get("category"),
      amenities: JSON.parse(formData.get("amenities") as string),
      country: formData.get("country"),
      state: formData.get("state"),
      city: formData.get("city"),
      minPricePerNight: formData.get("minPricePerNight"),
      image: result,
    };
    await Accommodation.findOneAndUpdate(
      { userId: user.id, _id: accId },
      updateAccommodation
    );
    revalidatePath("/", "layout");
  } catch (error) {
    console.log(error);
  }
};

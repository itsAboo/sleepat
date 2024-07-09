import { IAccommodation } from "../models/accommodation.model";

export const getAllAccommodation = async (search: {
  [key: string]: string | string[] | undefined;
}) => {
  const params = new URLSearchParams();

  Object.entries(search).forEach(([key, value]) => {
    if (typeof value === "string") {
      params.append(key, value.replace(/\+/g, " "));
    } else if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v.replace(/\+/g, " ")));
    }
  });

  const url = `${process.env.ACCOMMODATION_API!}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error);
    }

    const data = await response.json();

    return data.accommodation as IAccommodation[] | [];
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const getAccommodation = async (id: string) => {
  try {
    const response = await fetch(`${process.env.ACCOMMODATION_API}/${id}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    const data = await response.json();
    return data.accommodation as IAccommodation;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

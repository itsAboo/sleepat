"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/mongoose";
import User from "@/models/user.model";
import { lucia, getUser } from "@/lib/lucia";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export const signup = async (formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  if (!email || !password || !firstName || !lastName) {
    return { error: true, message: "Some values does not exist" };
  }
  try {
    await dbConnect();
    const hasUser = await User.findOne({ email });
    if (hasUser) {
      return {
        error: true,
        message: "Email already exists",
      };
    }
    const hashedPassword = await bcrypt.hash(password as string, 12);
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    const session = await lucia.createSession(user._id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: "An unknown error occurred",
    };
  }
  return redirect("/");
};

export const signin = async (formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");
  if (!email || !password) {
    return { error: true, message: "Email or password is invalid" };
  }

  try {
    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) {
      return {
        error: true,
        message: "Email or password is incorrect",
      };
    }

    const isPwMatched = await bcrypt.compare(password as string, user.password);
    if (!isPwMatched) {
      return {
        error: true,
        message: "Email or password is incorrect",
      };
    }

    const session = await lucia.createSession(user._id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: "An unknown error occurred",
    };
  }
  return redirect("/");
};

export const signout = async () => {
  const { session } = await getUser();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/account/signin");
};

export const updateProfile = async (formData: FormData) => {
  const { user } = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const updateObj = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phoneNumber: formData.get("phoneNumber"),
    address: formData.get("address"),
  };

  try {
    await User.findByIdAndUpdate(user.id, updateObj);
    revalidatePath("/", "layout");
  } catch (error) {
    console.log(error);
  }
};

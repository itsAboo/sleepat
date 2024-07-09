import { validateRequest } from "@/lib/lucia";
import dbConnect from "@/lib/mongoose";
import Accommodation from "@/models/accommodation.model";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  if (!req.headers.get("Authorization")) {
    return NextResponse.json({ message: "Authorization is required" });
  }
  const authSession = req.headers.get("Authorization")?.split(" ")[1];
  const sessionId = JSON.parse(authSession as string).value;
  const { user } = await validateRequest(sessionId);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    await dbConnect();
    const accommodation = await Accommodation.find({ userId: user.id });
    return NextResponse.json({ accommodation }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

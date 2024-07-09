import mongoose from "mongoose";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";

interface Session {
  userId: string;
  expiresAt: Date;
}

export const sessionSchema = new mongoose.Schema<Session>(
  {
    userId: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Session =
  mongoose.models.Session || mongoose.model<Session>("Session", sessionSchema);

export default Session;

export const adapter = new MongodbAdapter(
  mongoose.connection.collection("sessions"),
  mongoose.connection.collection("users")
);

import mongoose from "mongoose";
declare global {
  var mongoose: any;
}

let DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

if (!DB_CONNECTION_STRING) {
  throw new Error("DB_CONNECTION_STRING doesn't define");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async () => {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    let conn = await mongoose.connect(DB_CONNECTION_STRING, {
      dbName: "sleep_at",
    });
    cached.promise = conn;
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default dbConnect;

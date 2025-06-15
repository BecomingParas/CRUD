import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

export async function connectionMongoDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "", {
      dbName: "users",
    });
    console.log("Mongodb Database connected");
  } catch (error) {
    console.error("Failed to connect to mongodb!", error);
    process.exit(1);
  }
}

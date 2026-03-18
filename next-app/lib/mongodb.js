import { promises as dns } from "dns";
import mongoose from "mongoose";

// Optional DNS override for MongoDB Atlas
dns.setServers(["1.1.1.1", "1.0.0.1", "8.8.8.8"]);

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined in .env.local");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("MongoDB Connected ✅", db.connection.host);
  } catch (error) {
    console.log("MongoDB Connection Error ❌", error);
    throw error;
  }
};

export default connectDB;
import mongoose from "mongoose";

const RegisterSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

export default mongoose.models.Register || mongoose.model("Register", RegisterSchema);
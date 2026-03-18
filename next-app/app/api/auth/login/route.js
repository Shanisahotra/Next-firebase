import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Register from "../../../../models/Register";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../../../lib/sendEmail";

export async function POST(req) {
  await connectDB();

  const { email, password } = await req.json();

  const user = await Register.findOne({ email });

  if (!user) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  // generate token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  user.otpExpire = Date.now() + 5 * 60 * 1000;
  await user.save();

  // ✅ Send Email
  await sendEmail(
    user.email,
    "Your OTP Code",
    `Your OTP is ${otp}`
  );

  return NextResponse.json({
    message: "Login successful",
    token,
  });
}
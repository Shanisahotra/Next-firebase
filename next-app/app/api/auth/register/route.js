import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import bcrypt from "bcrypt";
import Register from "../../../../models/Register";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, password } = body;

    // Check existing user
    const userExist = await Register.findOne({ email });
    if (userExist) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await Register.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({
      message: "User registered ✅",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return NextResponse.json({ message: "Error ❌", error: error.message }, { status: 500 });
  }
}
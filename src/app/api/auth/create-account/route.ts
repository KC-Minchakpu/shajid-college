import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1. Basic Validation
    if (!name || !email || !password || password.length < 9) {
      return NextResponse.json(
        { error: "Invalid input. Password must be at least 9 characters." },
        { status: 400 }
      );
    }

    await dbConnect();

    // 2. Check if user exists (Normalizing email to lowercase)
    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create new user
    // The 'role' and 'status' are explicitly set for security and clarity
    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "applicant", 
      status: "pending", 
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: newUser._id }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
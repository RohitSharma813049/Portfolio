import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { name, email, mobile, notes, projectId, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "Email already in use" }, { status: 409 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const newUser = new User({
      name,
      email,
      mobile,
      notes,
      projectId,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token
    const token = await signToken({ userId: newUser._id, email: newUser.email, role: "client" });
    
    const response = NextResponse.json({ success: true, role: "client", message: "Account created successfully" });
    
    // Set cookie
    response.cookies.set({
      name: "client_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    
    return response;
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to create account" }, { status: 500 });
  }
}

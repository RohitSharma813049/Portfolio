import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Check credentials against environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json({ success: false, error: "Admin credentials not configured on server" }, { status: 500 });
    }

    if (email === adminEmail && password === adminPassword) {
      // Create JWT payload
      const token = await signToken({ email, role: "admin" });
      
      // Create response and set cookie
      const response = NextResponse.json({ success: true });
      
      response.cookies.set({
        name: "admin_token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });
      
      return response;
    }
    
    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

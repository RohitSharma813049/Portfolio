import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("client_token")?.value;
    
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    
    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

    await connectToDatabase();
    const user = await User.findById(decoded.userId).populate("wishlist");
    
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: user.wishlist || [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("client_token")?.value;
    
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    
    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

    const { projectId } = await req.json();
    if (!projectId) return NextResponse.json({ success: false, error: "Project ID is required" }, { status: 400 });

    await connectToDatabase();
    
    // Check if project is already in wishlist
    const user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    const wishlist = user.wishlist || [];
    const index = wishlist.indexOf(projectId);
    
    if (index === -1) {
      // Add
      wishlist.push(projectId);
    } else {
      // Remove
      wishlist.splice(index, 1);
    }

    user.wishlist = wishlist;
    await user.save();

    return NextResponse.json({ success: true, data: user.wishlist });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

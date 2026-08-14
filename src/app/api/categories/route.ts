import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.has("admin_token")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    
    if (!body.name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    const category = await Category.create({ 
      name: body.name,
      coverImage: body.coverImage || ""
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/categories");

    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: "Category already exists" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

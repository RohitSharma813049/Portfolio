import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";

// GET all projects
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    
    const query: any = status ? { status } : {};
    const projects = await Project.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: projects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// POST a new project
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    
    // Automatically generate slug if not provided
    if (!body.slug && body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const project = await Project.create(body);
    
    // Purge cache for live dashboard and public pages
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/projects");
    revalidatePath("/categories");
    
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error: any) {
    // Check for duplicate slug
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: "A project with this slug already exists." }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

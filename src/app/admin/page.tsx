import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await connectToDatabase();
  
  // Fetch real counts from the database
  const total = await Project.countDocuments();
  const published = await Project.countDocuments({ status: "PUBLISHED" });
  const drafts = await Project.countDocuments({ status: "DRAFT" });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/admin/projects/new" className="bg-[#111111] text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-[#333] transition flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[20px] border border-[#EAEAEA] shadow-sm">
          <h3 className="text-sm font-semibold text-[#666666] uppercase tracking-wider mb-2">Total Projects</h3>
          <p className="text-4xl font-extrabold text-[#111111]">{total}</p>
        </div>
        
        <div className="bg-white p-6 rounded-[20px] border border-[#EAEAEA] shadow-sm">
          <h3 className="text-sm font-semibold text-[#666666] uppercase tracking-wider mb-2">Published</h3>
          <p className="text-4xl font-extrabold text-green-600">{published}</p>
        </div>

        <div className="bg-white p-6 rounded-[20px] border border-[#EAEAEA] shadow-sm">
          <h3 className="text-sm font-semibold text-[#666666] uppercase tracking-wider mb-2">Drafts</h3>
          <p className="text-4xl font-extrabold text-amber-500">{drafts}</p>
        </div>
      </div>
    </div>
  );
}

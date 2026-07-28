import Link from "next/link";
import { LayoutDashboard, FolderKanban, Settings } from "lucide-react";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connectToDatabase();
  
  // Fetch real counts from the database
  const totalProjects = await Project.countDocuments();
  const draftProjects = await Project.countDocuments({ status: "DRAFT" });

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#EAEAEA] flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-[#EAEAEA]">
          <h2 className="font-bold text-lg tracking-tight">PortfolioCMS</h2>
          <span className="text-xs text-[#666666] uppercase tracking-wider font-semibold">Admin Panel</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {/* Dashboard - No Count (-) */}
          <Link href="/admin" className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium hover:bg-[#f4f4f4] transition text-[#111111]">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </div>
            <span className="text-[#666666]">-</span>
          </Link>
          
          {/* Projects - Count */}
          <Link href="/admin/projects" className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium hover:bg-[#f4f4f4] transition text-[#666666]">
            <div className="flex items-center gap-3">
              <FolderKanban className="w-4 h-4" /> Projects
            </div>
            <span className="bg-[#fcd34d] text-[#92400e] text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-sm">
              {totalProjects}
            </span>
          </Link>
          
          {/* Drafts - Count */}
          <Link href="/admin/projects?status=DRAFT" className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium hover:bg-[#f4f4f4] transition text-[#666666]">
            <div className="flex items-center gap-3 ml-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Drafts
            </div>
            <span className="bg-[#f4f4f4] text-[#666666] text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
              {draftProjects}
            </span>
          </Link>

          {/* Settings - No Count (-) */}
          <Link href="/admin/settings" className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium hover:bg-[#f4f4f4] transition text-[#666666] mt-4">
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4" /> Settings
            </div>
            <span className="text-[#666666]">-</span>
          </Link>
          
          <LogoutButton />
        </nav>
        
        <div className="p-4 border-t border-[#EAEAEA]">
          <Link href="/" className="text-sm font-medium text-[#666666] hover:text-[#111111] transition">
            &larr; Back to Website
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

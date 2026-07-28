import Link from "next/link";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import ProjectGrid from "@/components/ProjectGrid";

// Revalidate the page every 60 seconds (ISR) or leave it dynamic
export const revalidate = 60;

export default async function Home() {
  await connectToDatabase();
  // Fetch only published projects, sorted by newest
  const projects = await Project.find({ status: "PUBLISHED" }).sort({ createdAt: -1 }).lean();

  return (
    <main className="min-h-screen bg-white">
      {/* Header / Navigation */}
      <header className="flex justify-between items-center py-6 px-8 max-w-7xl mx-auto border-b border-[#EAEAEA]">
        <div className="font-bold text-xl tracking-tight">PortfolioCMS</div>
        <nav className="flex gap-6 items-center">
          <Link href="/" className="text-sm font-medium hover:text-[#666666] transition">Projects</Link>
          <Link href="/categories" className="text-sm font-medium hover:text-[#666666] transition">Categories</Link>
          <Link href="/admin" className="bg-[#111111] text-white px-5 py-2 rounded-[8px] text-sm font-medium hover:bg-[#333] transition">
            Admin Login
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 pt-24 pb-16 text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-[#f4f4f4] text-xs font-semibold uppercase tracking-wider mb-6 text-[#666666]">
          Premium Software Portfolio
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
          Ready-Made Software Projects on Modern Technology
        </h1>
        <p className="text-lg text-[#666666] max-w-2xl mx-auto mb-10">
          Deploy production-ready software solutions instantly. Explore our comprehensive collection of premium applications tailored for your business needs.
        </p>
      </section>

      {/* Project Grid (Client Component for Search) */}
      <section className="max-w-7xl mx-auto px-8 pb-16">
        <ProjectGrid initialProjects={JSON.parse(JSON.stringify(projects))} />
      </section>

      {/* Footer */}
      <footer className="border-t border-[#EAEAEA] py-12 mt-20">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center text-sm text-[#666666]">
          <p>© 2026 Webbeside Technology. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-[#111111]">Terms</Link>
            <Link href="#" className="hover:text-[#111111]">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#111111]">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

import Link from "next/link";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import ProjectGrid from "@/components/ProjectGrid";

export const dynamic = "force-dynamic";

export default async function AllProjectsPage() {
  let projects: any[] = [];
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      projects = await Project.find(
        {},
        "name slug shortDescription featureImage categories technologies status createdAt purchaseOption livePreviewUrl bookDemoUrl"
      )
        .sort({ createdAt: -1 })
        .lean();
    }
  } catch (error) {
    console.error("Failed to fetch projects page data:", error);
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-10 pb-4 text-center animate-fade-in-up">
        <span className="inline-block py-1 px-4 rounded-full bg-gray-100 text-[10px] font-bold uppercase tracking-widest mb-3 text-[#D8C494]">
          PORTFOLIO SHOWCASE
        </span>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-playfair font-medium tracking-tight mb-3 max-w-4xl mx-auto leading-tight text-[#111]">
          All <span className="text-[#D8C494] italic">Projects</span>
        </h1>
        <p className="text-sm sm:text-base text-[#666] font-light max-w-2xl mx-auto mb-4">
          Explore our complete catalog of web applications, mobile platforms, enterprise software systems, and custom digital solutions.
        </p>
      </section>

      {/* Project Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-8">
        <ProjectGrid initialProjects={JSON.parse(JSON.stringify(projects))} />
      </section>

      {/* Footer */}
      <footer className="border-t border-[#EAEAEA] py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-[#16325C]">
          <p>© 2026 Webbeside Technology. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/about" className="hover:text-[#0B1B3D]">About Us</Link>
            <Link href="/connect" className="hover:text-[#0B1B3D]">Connect</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

import Link from "next/link";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import ProjectGrid from "@/components/ProjectGrid";

export const revalidate = 60;

export default async function AllProjectsPage() {
  await connectToDatabase();
  const projects = await Project.find({ status: "PUBLISHED" }).sort({ createdAt: -1 }).lean();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 pt-24 pb-16 text-center animate-fade-in-up">
        <span className="inline-block py-1 px-4 rounded-full bg-gray-100 text-[10px] font-bold uppercase tracking-widest mb-6 text-[#D8C494]">
          PORTFOLIO SHOWCASE
        </span>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-playfair font-medium tracking-tight mb-6 max-w-4xl mx-auto leading-tight text-[#111]">
          All <span className="text-[#D8C494] italic">Projects</span>
        </h1>
        <p className="text-lg text-[#666] font-light max-w-2xl mx-auto mb-10">
          Explore our complete catalog of web applications, mobile platforms, enterprise software systems, and custom digital solutions.
        </p>
      </section>

      {/* Project Grid */}
      <section className="max-w-7xl mx-auto px-8 pb-16">
        <ProjectGrid initialProjects={JSON.parse(JSON.stringify(projects))} />
      </section>

      {/* Footer */}
      <footer className="border-t border-[#EAEAEA] py-12 mt-20">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center text-sm text-[#16325C]">
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

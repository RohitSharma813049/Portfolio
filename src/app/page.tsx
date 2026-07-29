import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import ProjectGrid from "@/components/ProjectGrid";
import HeroCarousel from "@/components/HeroCarousel";
import Link from "next/link";

// Revalidate the page every 60 seconds (ISR) or leave it dynamic
export const revalidate = 60;

export default async function Home() {
  await connectToDatabase();
  
  // Fetch only the projects that are published (or all, depending on your logic)
  const projects = await Project.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div className="bg-white min-h-screen text-[#1E3A8A] font-sans">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden border-b border-[#EAEAEA]">
        <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight animate-fade-in-up">
            Building the Future <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E3A8A] to-[#4169E1]">With Mega Project</span>
          </h1>
          <p className="text-lg md:text-xl text-[#4169E1] max-w-3xl mx-auto mb-12 animate-fade-in-up-delay-1">
            We deliver implementation-ready, highly accessible UI components and design systems for construction companies. Explore our portfolio of work below.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up-delay-2 mb-16">
            <Link href="#projects" className="w-full sm:w-auto bg-[#4169E1] text-white px-8 py-4 rounded-none font-semibold hover:bg-[#1E3A8A] transition-colors shadow-sm">
              Explore Projects
            </Link>
            <Link href="/categories" className="w-full sm:w-auto bg-white border border-[#EAEAEA] text-[#1E3A8A] px-8 py-4 rounded-none font-semibold hover:bg-[#f4f4f4] transition-colors shadow-sm">
              View Categories
            </Link>
          </div>
          
          <HeroCarousel projects={JSON.parse(JSON.stringify(projects))} />
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-4 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-extrabold text-[#1E3A8A] mb-4">Our Portfolio</h2>
            <p className="text-[#4169E1] max-w-2xl mx-auto">
              Browse through our recent projects. Use the search and filters to find exactly what you're looking for.
            </p>
          </div>
          
          <ProjectGrid initialProjects={JSON.parse(JSON.stringify(projects))} />
        </div>
      </section>
    </div>
  );
}

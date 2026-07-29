import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ChevronRight, PlayCircle } from "lucide-react";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import ProjectTabs from "@/components/ProjectTabs";
import EnquiryButton from "@/components/EnquiryButton";

export const revalidate = 60; // ISR

export default async function ProjectDetails({ params }: { params: Promise<{ slug: string }> }) {
  await connectToDatabase();
  
  const { slug } = await params;
  
  // Find project by slug
  const project = await Project.findOne({ slug }).lean();
  
  if (!project) {
    notFound();
  }
  
  return (
    <main className="min-h-screen bg-white pb-24">


      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-8 pt-16 pb-12 border-b border-[#EAEAEA]">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="flex-1">
            {project.categories && project.categories.length > 0 && (
              <span className="inline-block py-1 px-3 rounded-none-none bg-[#f4f4f4] text-xs font-semibold uppercase tracking-wider mb-4 text-[#16325C]">
                {project.categories[0]}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
              {project.name}
            </h1>
            <p className="text-lg text-[#16325C] mb-8">
              {project.shortDescription}
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              {project.technologies?.slice(0,2).map((tech: string) => (
                <span key={tech} className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-green-600" /> {tech}</span>
              ))}
              {project.isWhiteLabel && (
                <span className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-green-600" /> White Label</span>
              )}
              {project.hasSubscription && (
                <span className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-green-600" /> Subscription</span>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <a href={project.bookDemoUrl || "#"} className="bg-[#111111] text-white px-6 py-3 rounded-none-none text-sm font-medium hover:bg-[#333] transition shadow-soft">
                Book Demo
              </a>
              <EnquiryButton 
                projectId={project._id.toString()}
                projectName={project.name}
                className="border border-[#EAEAEA] px-6 py-3 rounded-none-none text-sm font-medium hover:bg-[#f4f4f4] transition"
                buttonText="Enquiry for Cost"
              />
              {project.livePreviewUrl && (
                <a href={project.livePreviewUrl} target="_blank" rel="noreferrer" className="border border-[#EAEAEA] px-6 py-3 rounded-none-none text-sm font-medium hover:bg-[#f4f4f4] transition">
                  Live Preview
                </a>
              )}
            </div>
          </div>
          
          <div className="w-full md:w-1/3 aspect-square bg-[#f8f9fa] rounded-none-none border border-[#EAEAEA] flex items-center justify-center p-8 overflow-hidden">
            {project.featureImage ? (
               <img src={project.featureImage} alt={project.name} className="w-full h-full object-cover rounded-none-none" />
            ) : (
               <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-blue-100 rounded-none-none flex items-center justify-center">
                  <span className="text-indigo-900 font-bold text-xl text-center">No Image</span>
               </div>
            )}
          </div>
        </div>
      </section>

      {/* Tabs & Content Area (Client Component) */}
      <ProjectTabs project={JSON.parse(JSON.stringify(project))} />
      
      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-8 mt-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Interested in this project?</h2>
        <p className="text-[#16325C] mb-8">Book a demo or request pricing to get started with your deployment.</p>
        <EnquiryButton 
          projectId={project._id.toString()}
          projectName={project.name}
          className="bg-[#111111] inline-block text-white px-8 py-4 rounded-none-none font-medium hover:bg-[#333] transition shadow-soft"
          buttonText="Talk to an Expert"
        />
      </section>
    </main>
  );
}

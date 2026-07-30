import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ChevronRight, PlayCircle } from "lucide-react";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import ProjectTabs from "@/components/ProjectTabs";
import EnquiryButton from "@/components/EnquiryButton";
import ProjectGallery from "@/components/ProjectGallery";

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
      <section className="max-w-6xl mx-auto px-8 pt-20 pb-16 border-b border-[#EAEAEA] animate-fade-in-up">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1">
            {project.categories && project.categories.length > 0 && (
              <span className="inline-block py-1.5 px-4 rounded-full bg-gray-100 text-[10px] font-bold uppercase tracking-widest mb-6 text-[#D8C494]">
                {project.categories[0]}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-medium tracking-tight mb-6 leading-tight text-[#111]">
              {project.name}
            </h1>
            <p className="text-lg text-[#666] font-light mb-8 leading-relaxed max-w-xl">
              {project.shortDescription}
            </p>
            
            <div className="flex flex-wrap gap-4 mb-10">
              {project.technologies?.slice(0,2).map((tech: string) => (
                <span key={tech} className="flex items-center gap-2 text-sm font-medium text-[#111]"><CheckCircle2 className="w-4 h-4 text-[#D8C494]" /> {tech}</span>
              ))}
              {project.isWhiteLabel && (
                <span className="flex items-center gap-2 text-sm font-medium text-[#111]"><CheckCircle2 className="w-4 h-4 text-[#D8C494]" /> White Label</span>
              )}
              {project.hasSubscription && (
                <span className="flex items-center gap-2 text-sm font-medium text-[#111]"><CheckCircle2 className="w-4 h-4 text-[#D8C494]" /> Subscription</span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <a href={project.bookDemoUrl || "#"} className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#D8C494] transition-colors shadow-sm hover:scale-105 duration-300">
                Book Demo
              </a>
              <EnquiryButton 
                projectId={project._id.toString()}
                projectName={project.name}
                className="border border-[#EAEAEA] px-5 py-2.5 rounded-full text-sm font-medium hover:border-[#D8C494] hover:text-[#D8C494] transition-colors bg-white hover:scale-105 duration-300"
                buttonText="Enquiry for Cost"
              />
              {project.livePreviewUrl && (
                <a href={project.livePreviewUrl} target="_blank" rel="noreferrer" className="border border-[#EAEAEA] px-5 py-2.5 rounded-full text-sm font-medium hover:border-[#D8C494] hover:text-[#D8C494] transition-colors bg-white hover:scale-105 duration-300">
                  Live Preview
                </a>
              )}
            </div>
          </div>
          
          <div className="w-full md:w-6/12 bg-[#f8f9fa] rounded-3xl border border-[#EAEAEA] flex items-center justify-center p-2 shadow-sm relative min-h-[350px] md:min-h-[500px] lg:min-h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#f4f4f4] to-white z-0 rounded-3xl" />
            <ProjectGallery 
              featureImage={project.featureImage || ""}
              screenshots={project.screenshots ? JSON.parse(JSON.stringify(project.screenshots)) : []}
              panels={project.panels ? JSON.parse(JSON.stringify(project.panels)) : []}
              videoUrl={project.videoUrl}
              projectName={project.name}
            />
          </div>
        </div>
      </section>

      {/* Tabs & Content Area (Client Component) */}
      <ProjectTabs project={JSON.parse(JSON.stringify(project))} />
      
      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-8 mt-24 text-center">
        <h2 className="text-4xl font-playfair font-medium mb-4 text-[#111]">Interested in this publication?</h2>
        <p className="text-[#666] font-light mb-10 max-w-xl mx-auto">Book a demo or request pricing to get started with your deployment and access the full source material.</p>
        <EnquiryButton 
          projectId={project._id.toString()}
          projectName={project.name}
          className="bg-black inline-block text-white px-10 py-4 rounded-full font-medium hover:bg-[#D8C494] transition-colors shadow-sm hover:scale-105 duration-300"
          buttonText="Talk to an Expert"
        />
      </section>
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import ProjectTabs from "@/components/ProjectTabs";
import EnquiryButton from "@/components/EnquiryButton";
import ProjectGallery from "@/components/ProjectGallery";
import ProjectActionButtons from "@/components/ProjectActionButtons";
import ProjectCard from "@/components/ProjectCard";

export const revalidate = 60; // ISR

export default async function ProjectDetails({ params }: { params: Promise<{ slug: string }> }) {
  await connectToDatabase();

  const { slug } = await params;

  // Find project by slug and populate similarProjects if defined
  const project = await Project.findOne({ slug })
    .populate("similarProjects", "name slug featureImage shortDescription categories status")
    .lean();

  if (!project) {
    notFound();
  }

  // Fetch similar projects fallback if explicit similarProjects are not set
  let similarProjectsList: any[] = [];
  if (project.similarProjects && project.similarProjects.length > 0) {
    similarProjectsList = project.similarProjects.filter((sp: any) => sp && sp.status !== "DRAFT");
  }

  if (similarProjectsList.length < 3) {
    const fallback = await Project.find({
      _id: { $ne: project._id, $nin: similarProjectsList.map((sp: any) => sp._id) },
      categories: { $in: project.categories || [] },
      status: "PUBLISHED",
    })
      .limit(3 - similarProjectsList.length)
      .lean();

    similarProjectsList = [...similarProjectsList, ...fallback];
  }

  // If still under 3, fetch recent published projects
  if (similarProjectsList.length < 3) {
    const recentFallback = await Project.find({
      _id: { $ne: project._id, $nin: similarProjectsList.map((sp: any) => sp._id) },
      status: "PUBLISHED",
    })
      .sort({ createdAt: -1 })
      .limit(3 - similarProjectsList.length)
      .lean();

    similarProjectsList = [...similarProjectsList, ...recentFallback];
  }

  return (
    <main className="min-h-screen bg-white pb-16 sm:pb-24">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 sm:pt-20 pb-10 sm:pb-16 border-b border-[#EAEAEA] animate-fade-in-up">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start lg:items-center">
          <div className="flex-1 w-full">
            {project.categories && project.categories.length > 0 && (
              <span className="inline-block py-1 px-3.5 rounded-full bg-gray-100 text-[10px] font-bold uppercase tracking-widest mb-4 sm:mb-6 text-[#D8C494]">
                {project.categories[0]}
              </span>
            )}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-playfair font-medium tracking-tight mb-4 sm:mb-6 leading-tight text-[#111]">
              {project.name}
            </h1>
            <p className="text-base sm:text-lg text-[#666] font-light mb-6 sm:mb-8 leading-relaxed max-w-xl">
              {project.shortDescription}
            </p>

            <div className="flex flex-wrap gap-2.5 sm:gap-4 mb-6 sm:mb-10">
              {project.technologies?.slice(0, 3).map((tech: string) => (
                <span key={tech} className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#111] bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D8C494]" /> {tech}
                </span>
              ))}
              {project.isWhiteLabel && (
                <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#111] bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D8C494]" /> White Label
                </span>
              )}
              {project.hasSubscription && (
                <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#111] bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D8C494]" /> Subscription
                </span>
              )}
            </div>

            {/* Interactive Action Buttons */}
            <ProjectActionButtons
              projectId={project._id.toString()}
              projectName={project.name}
              bookDemoUrl={project.bookDemoUrl}
              livePreviewUrl={project.livePreviewUrl}
              purchaseOption={project.purchaseOption}
            />
          </div>

          <div className="w-full lg:w-6/12 bg-[#f8f9fa] rounded-2xl sm:rounded-3xl border border-[#EAEAEA] flex items-center justify-center p-2 sm:p-4 shadow-sm relative min-h-[280px] sm:min-h-[450px] lg:min-h-[550px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#f4f4f4] to-white z-0 rounded-2xl sm:rounded-3xl" />
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

      {/* Similar Projects Section */}
      {similarProjectsList.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-8 mt-12 sm:mt-24 pt-10 sm:pt-16 border-t border-[#EAEAEA]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D8C494] block mb-2">
                RECOMMENDED FOR YOU
              </span>
              <h2 className="text-2xl sm:text-4xl font-playfair font-medium text-[#111]">
                Similar Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="flex items-center gap-2 text-sm font-semibold text-[#111] hover:text-[#D8C494] transition-colors"
            >
              View All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarProjectsList.map((simProj: any) => (
              <ProjectCard
                key={simProj._id.toString()}
                project={simProj}
                showWishlist={true}
                imageHeightClass="h-48"
              />
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 mt-12 sm:mt-24 text-center">
        <h2 className="text-2xl sm:text-4xl font-playfair font-medium mb-3 sm:mb-4 text-[#111]">
          Interested in this project?
        </h2>
        <p className="text-sm sm:text-base text-[#666] font-light mb-8 sm:mb-10 max-w-xl mx-auto">
          Book a demo, request pricing, or discuss custom development to get started with your deployment.
        </p>
        <EnquiryButton
          projectId={project._id.toString()}
          projectName={project.name}
          className="bg-black inline-block text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-medium hover:bg-[#D8C494] transition-colors shadow-sm hover:scale-105 duration-300 cursor-pointer"
          buttonText="Talk to an Expert"
        />
      </section>
    </main>
  );
}

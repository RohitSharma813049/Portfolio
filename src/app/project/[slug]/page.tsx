import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import ProjectTabs from "@/components/ProjectTabs";
import EnquiryButton from "@/components/EnquiryButton";
import ProjectGallery from "@/components/ProjectGallery";
import ProjectActionButtons from "@/components/ProjectActionButtons";

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
              {project.technologies?.slice(0, 3).map((tech: string) => (
                <span key={tech} className="flex items-center gap-2 text-sm font-medium text-[#111]">
                  <CheckCircle2 className="w-4 h-4 text-[#D8C494]" /> {tech}
                </span>
              ))}
              {project.isWhiteLabel && (
                <span className="flex items-center gap-2 text-sm font-medium text-[#111]">
                  <CheckCircle2 className="w-4 h-4 text-[#D8C494]" /> White Label
                </span>
              )}
              {project.hasSubscription && (
                <span className="flex items-center gap-2 text-sm font-medium text-[#111]">
                  <CheckCircle2 className="w-4 h-4 text-[#D8C494]" /> Subscription
                </span>
              )}
            </div>

            {/* Interactive Action Buttons */}
            <ProjectActionButtons
              projectId={project._id.toString()}
              projectName={project.name}
              bookDemoUrl={project.bookDemoUrl}
              livePreviewUrl={project.livePreviewUrl}
            />
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

      {/* Similar Projects Section */}
      {similarProjectsList.length > 0 && (
        <section className="max-w-6xl mx-auto px-8 mt-24 pt-16 border-t border-[#EAEAEA]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D8C494] block mb-2">
                RECOMMENDED FOR YOU
              </span>
              <h2 className="text-3xl md:text-4xl font-playfair font-medium text-[#111]">
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
              <div
                key={simProj._id.toString()}
                className="group bg-white rounded-3xl overflow-hidden border border-[#EAEAEA] shadow-sm hover:shadow-hover transition-all flex flex-col h-full"
              >
                <div className="relative h-48 bg-[#f4f4f4] overflow-hidden">
                  <span className="absolute top-4 left-4 z-10 bg-[#0B1B3D]/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    {simProj.categories?.[0] || "SOFTWARE"}
                  </span>
                  {simProj.featureImage ? (
                    <img
                      src={simProj.featureImage}
                      alt={simProj.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-[#0B1B3D]/20 font-bold text-xl px-4 text-center">
                        {simProj.name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-playfair text-xl font-medium text-[#111] mb-3 line-clamp-2">
                    {simProj.name}
                  </h3>
                  <p className="text-sm text-[#888] font-light line-clamp-2 mb-6 flex-grow">
                    {simProj.shortDescription}
                  </p>
                  <div className="border-t border-[#EAEAEA] pt-4 mt-auto">
                    <Link
                      href={`/project/${simProj.slug}`}
                      className="text-sm font-semibold text-[#D8C494] flex items-center gap-2 group-hover:text-[#111] transition-colors"
                    >
                      View Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-8 mt-24 text-center">
        <h2 className="text-4xl font-playfair font-medium mb-4 text-[#111]">
          Interested in this project?
        </h2>
        <p className="text-[#666] font-light mb-10 max-w-xl mx-auto">
          Book a demo, request pricing, or discuss custom development to get started with your deployment.
        </p>
        <EnquiryButton
          projectId={project._id.toString()}
          projectName={project.name}
          className="bg-black inline-block text-white px-10 py-4 rounded-full font-medium hover:bg-[#D8C494] transition-colors shadow-sm hover:scale-105 duration-300 cursor-pointer"
          buttonText="Talk to an Expert"
        />
      </section>
    </main>
  );
}

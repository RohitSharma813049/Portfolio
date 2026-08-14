import Link from "next/link";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import ProjectGrid from "@/components/ProjectGrid";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CategoryFilteredPage({ params }: { params: Promise<{ slug: string }> }) {
  await connectToDatabase();
  const { slug } = await params;

  // Fetch all projects except DRAFT
  const allProjects = await Project.find(
    { status: { $ne: "DRAFT" } },
    "name slug shortDescription featureImage categories technologies status createdAt purchaseOption livePreviewUrl bookDemoUrl"
  )
    .sort({ createdAt: -1 })
    .lean();

  const normalizedSlug = slug.toLowerCase().trim();

  // Filter projects by matching category slug or string
  const projects = allProjects.filter((project: any) => {
    if (!project.categories || project.categories.length === 0) return false;
    return project.categories.some((cat: string) => {
      const catSlug = cat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      const targetSlug = normalizedSlug.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      return catSlug === targetSlug || cat.toLowerCase().includes(normalizedSlug.replace(/-/g, " "));
    });
  });

  let categoryName = slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  if (projects.length > 0 && projects[0].categories) {
    const matchingCat = projects[0].categories.find(
      (c: string) => c.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") === normalizedSlug
    );
    if (matchingCat) categoryName = matchingCat;
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-10 pb-4 text-center animate-fade-in-up">
        <Link
          href="/categories"
          className="inline-block py-1.5 px-4 rounded-full bg-black text-[10px] font-bold uppercase tracking-widest mb-4 text-white hover:bg-[#D8C494] transition-colors"
        >
          &larr; Back to Categories
        </Link>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-playfair font-medium tracking-tight mb-3 max-w-4xl mx-auto leading-tight text-[#111]">
          {categoryName}
        </h1>
        <p className="text-sm sm:text-base text-[#666] font-light max-w-2xl mx-auto mb-4">
          Showing {projects.length} {projects.length === 1 ? "project" : "projects"} in the {categoryName} category.
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
            <Link href="#" className="hover:text-[#0B1B3D]">Terms</Link>
            <Link href="#" className="hover:text-[#0B1B3D]">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#0B1B3D]">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

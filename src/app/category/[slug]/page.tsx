import Link from "next/link";
import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";

export const revalidate = 60;

export default async function CategoryFilteredPage({ params }: { params: Promise<{ slug: string }> }) {
  await connectToDatabase();
  const { slug } = await params;
  
  // Fetch all published projects
  const allProjects = await Project.find({ status: "PUBLISHED" }).sort({ createdAt: -1 }).lean();
  
  // Filter projects by matching the slug against their categories
  const projects = allProjects.filter((project: any) => {
    if (!project.categories) return false;
    return project.categories.some((cat: string) => {
      const catSlug = cat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      return catSlug === slug;
    });
  });

  // If no projects match, and we don't even know if this category exists, we can still show a 0 state
  // But let's try to find the actual category name to display
  let categoryName = slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  if (projects.length > 0 && projects[0].categories) {
    const matchingCat = projects[0].categories.find((c: string) => 
      c.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") === slug
    );
    if (matchingCat) categoryName = matchingCat;
  }

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
        <Link href="/categories" className="inline-block py-1 px-3 rounded-full bg-[#f4f4f4] text-xs font-semibold uppercase tracking-wider mb-6 text-[#666666] hover:bg-[#eaeaea] transition">
          &larr; All Categories
        </Link>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
          {categoryName}
        </h1>
        <p className="text-lg text-[#666666] max-w-2xl mx-auto mb-10">
          Showing {projects.length} {projects.length === 1 ? "project" : "projects"} in the {categoryName} category.
        </p>
      </section>

      {/* Project Grid */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        {projects.length === 0 ? (
          <div className="text-center text-[#666666] py-12">
            No projects found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {projects.map((project: any) => (
              <div key={project._id.toString()} className="group rounded-[20px] border border-[#EAEAEA] bg-white shadow-sm hover:shadow-hover transition-all duration-300 overflow-hidden flex flex-col">
                <div className="aspect-square bg-[#f8f9fa] relative overflow-hidden flex items-center justify-center p-8">
                  {project.featureImage ? (
                    <img src={project.featureImage} alt={project.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl flex items-center justify-center">
                      <span className="text-gray-900 font-bold text-center px-4">{project.name}</span>
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg leading-tight">{project.name}</h3>
                  </div>
                  <p className="text-sm text-[#666666] line-clamp-3 mb-6 flex-grow">
                    {project.shortDescription}
                  </p>
                  
                  <div className="flex gap-2 flex-wrap mb-6">
                    {project.technologies?.slice(0, 2).map((tech: string) => (
                      <span key={tech} className="text-xs font-medium bg-[#f4f4f4] px-2 py-1 rounded-md">{tech}</span>
                    ))}
                  </div>
                  
                  <div className="flex gap-3 mt-auto">
                    <Link href={`/project/${project.slug}`} className="flex-1 text-center border border-[#EAEAEA] py-2 rounded-lg text-sm font-medium hover:bg-[#f4f4f4] transition">
                      Details
                    </Link>
                    <a href={project.enquiryUrl || "#"} className="flex-1 text-center bg-[#111111] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#333] transition">
                      Enquiry
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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

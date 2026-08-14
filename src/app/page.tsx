import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import Category from "@/models/Category";
import FeaturedProjects from "@/components/FeaturedProjects";
import Link from "next/link";
import { ArrowRight, UserPlus, Compass, Code, Layers } from "lucide-react";
import ClientSearch from "@/components/ClientSearch";
import CTA from "@/components/CTA";

export const dynamic = "force-dynamic";

export default async function Home() {
  let projects: any[] = [];
  let dbCategories: any[] = [];
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      projects = await Project.find({}, "name slug shortDescription featureImage categories technologies status createdAt purchaseOption livePreviewUrl bookDemoUrl").sort({ createdAt: -1 }).lean();
      dbCategories = await Category.find({}, "name slug coverImage").lean();
    }
  } catch (error) {
    console.error("Failed to fetch home page data:", error);
  }

  const totalProjects = projects.length;
  // Create dynamic category cards from dbCategories
  const categoryCards = dbCategories.map((cat) => {
    const count = projects.filter((p) => p.categories && p.categories.includes(cat.name)).length;
    const slug = cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    return {
      title: cat.name,
      slug: slug,
      count: `${count} PROJECT${count === 1 ? "" : "S"}`,
      image:
        cat.coverImage ||
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    };
  });

  // Default fallback presets if database has no categories created yet
  const defaultCategoryPresets = [
    {
      title: "Web Applications",
      slug: "web-applications",
      count: "5+ PROJECTS",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Mobile Apps",
      slug: "mobile-apps",
      count: "4+ PROJECTS",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Enterprise Solutions",
      slug: "enterprise-solutions",
      count: "3+ PROJECTS",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "AI & Cloud Platforms",
      slug: "ai-cloud-platforms",
      count: "4+ PROJECTS",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
    },
  ];

  // Show ONLY real database categories created by user in Admin panel. If none exist, show presets.
  const displayCategories =
    categoryCards.length > 0 ? categoryCards : defaultCategoryPresets;

  return (
    <div className="bg-white min-h-screen text-[#0B1B3D] font-sans">
      {/* 1. SPLIT HERO SECTION */}
      <section className="relative flex flex-col lg:flex-row min-h-[85vh] border-b border-[#EAEAEA]">
        {/* Left Side: Content */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 sm:px-16 py-12 lg:py-0">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="flex items-center gap-4 mb-8 text-xs font-bold tracking-widest uppercase text-[#D8C494]">
              Innovative Software · Cutting-Edge Solutions · High Performance
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-playfair font-medium leading-[1.1] mb-6 text-[#16276B]">
              Building the Future<br />With Premium Software
            </h1>

            <p className="text-lg text-[#666] leading-relaxed mb-12 max-w-xl font-light">
              We deliver implementation-ready, high-performance web applications, mobile apps, and custom software platforms. Explore our portfolio of projects below.
            </p>

            {/* Search Box */}
            <ClientSearch />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-12">
              <span className="px-4 py-1.5 border border-black rounded-full text-xs font-medium cursor-pointer">
                All
              </span>
              <span className="px-4 py-1.5 border border-[#EAEAEA] text-[#666] rounded-full text-xs hover:border-black cursor-pointer transition-colors">
                Next.js
              </span>
              <span className="px-4 py-1.5 border border-[#EAEAEA] text-[#666] rounded-full text-xs hover:border-black cursor-pointer transition-colors">
                React Native
              </span>
              <span className="px-4 py-1.5 border border-[#EAEAEA] text-[#666] rounded-full text-xs hover:border-black cursor-pointer transition-colors">
                Node.js & MongoDB
              </span>
              <span className="px-4 py-1.5 border border-[#EAEAEA] text-[#666] rounded-full text-xs hover:border-black cursor-pointer transition-colors">
                Cloud Architecture
              </span>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 animate-fade-in-up-delay-1">
              <Link
                href="#projects"
                className="flex items-center gap-2 bg-black hover:bg-[#D8C494] text-white px-8 py-4 rounded-xl font-medium transition-all hover:scale-105 duration-300 shadow-sm hover:shadow-hover"
              >
                Explore Projects <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/projects"
                className="flex items-center gap-2 bg-white border border-[#EAEAEA] text-[#111] hover:border-[#D8C494] hover:text-[#D8C494] px-8 py-4 rounded-xl font-medium transition-all hover:scale-105 duration-300"
              >
                All Projects
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="w-full lg:w-[45%] bg-[#1E1B38] relative min-h-[50vh] lg:min-h-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#1E1B38] to-[#2D2A54] opacity-90 mix-blend-multiply z-10" />
          <img
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2000&auto=format&fit=crop"
            alt="Software Code Development"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute top-8 right-8 z-20">
            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              Live Demos Available
            </span>
          </div>

          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <h2 className="text-white/20 font-playfair font-bold text-[15rem] leading-none tracking-tighter mix-blend-overlay select-none">
              DEV
            </h2>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="border-b border-[#EAEAEA] py-12 bg-white relative z-10 -mt-1 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 text-center divide-x divide-y md:divide-y-0 divide-[#EAEAEA]">
          <div className="py-6 flex flex-col">
            <span className="font-playfair text-3xl md:text-4xl text-[#111] font-medium mb-1">
              {totalProjects}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#666] font-bold">
              PROJECTS
            </span>
          </div>
          <div className="py-6 flex flex-col">
            <span className="font-playfair text-3xl md:text-4xl text-[#111] font-medium mb-1">
              350+
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#666] font-bold">
              COMPONENTS
            </span>
          </div>
          <div className="py-6 flex flex-col border-t md:border-t-0 border-[#EAEAEA]">
            <span className="font-playfair text-3xl md:text-4xl text-[#111] font-medium mb-1">
              15+
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#666] font-bold">
              DEVELOPERS
            </span>
          </div>
          <div className="py-6 flex flex-col border-t md:border-t-0 border-[#EAEAEA]">
            <span className="font-playfair text-3xl md:text-4xl text-[#111] font-medium mb-1">
              80+
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#666] font-bold">
              CLIENTS
            </span>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section className="py-16 md:py-24 px-4 sm:px-8 max-w-7xl mx-auto bg-white">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-4 text-xs font-bold tracking-widest uppercase text-[#D8C494]">
              BROWSE BY CATEGORY
            </div>
            <h2 className="text-4xl md:text-5xl font-playfair font-medium text-[#16276B] mb-6">
              Project <span className="text-[#645CBB] italic">Categories</span>
            </h2>
            <p className="text-[#666] font-light text-lg">
              Explore web applications, mobile platforms, enterprise SaaS, and full-stack solutions built with cutting-edge technologies.
            </p>
          </div>
          <Link
            href="/categories"
            className="flex items-center gap-2 font-medium text-sm hover:opacity-70 transition-opacity whitespace-nowrap"
          >
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div
          className={`grid gap-6 ${
            displayCategories.length === 1
              ? "grid-cols-1 max-w-md"
              : displayCategories.length === 2
              ? "grid-cols-1 sm:grid-cols-2 max-w-3xl"
              : displayCategories.length === 3
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full"
          }`}
        >
          {displayCategories.map((cat, i) => (
            <Link
              href={`/categories`}
              key={i}
              className="group relative h-96 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-8 text-white bg-[#1E1B38]"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3D]/95 via-[#0B1B3D]/40 to-transparent z-10" />

              <div className="relative z-20">
                <p className="text-[10px] font-bold tracking-widest uppercase mb-2 text-[#D8C494]">
                  {cat.count}
                </p>
                <h3 className="font-playfair text-2xl md:text-3xl font-medium mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                  {cat.title}
                </h3>

                <div className="w-10 h-10 rounded-full border border-white/40 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#D8C494] group-hover:border-[#D8C494] group-hover:text-black transition-all">
                  <ArrowRight className="w-4 h-4 -rotate-45" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section className="py-24 bg-[#FAFAFA] border-y border-[#EAEAEA]">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#645CBB] mb-4">
            SIMPLE PROCESS
          </div>
          <h2 className="text-4xl font-playfair font-medium text-[#16276B] mb-16">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-[#EAEAEA] relative z-10">
              <div className="w-12 h-12 bg-[#F3F2F9] text-[#645CBB] rounded-full flex items-center justify-center mx-auto mb-6">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-4 text-[#111]">Explore Projects</h3>
              <p className="text-[#666] text-sm leading-relaxed">
                Browse our curated showcase of web and mobile software projects, live previews, and system features.
              </p>
            </div>

            {/* Arrow between 1 and 2 */}
            <div className="hidden md:block absolute top-1/2 left-[30%] text-[#ccc] -translate-y-1/2 z-0">
              <ArrowRight className="w-6 h-6" />
            </div>

            <div className="bg-white rounded-2xl p-10 shadow-sm border border-[#EAEAEA] relative z-10">
              <div className="w-12 h-12 bg-[#F3F2F9] text-[#645CBB] rounded-full flex items-center justify-center mx-auto mb-6">
                <Code className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-4 text-[#111]">Test Live Demo</h3>
              <p className="text-[#666] text-sm leading-relaxed">
                Interact with live preview links, demo access credentials, and video walkthrough tours.
              </p>
            </div>

            {/* Arrow between 2 and 3 */}
            <div className="hidden md:block absolute top-1/2 right-[30%] text-[#ccc] -translate-y-1/2 z-0">
              <ArrowRight className="w-6 h-6" />
            </div>

            <div className="bg-white rounded-2xl p-10 shadow-sm border border-[#EAEAEA] relative z-10">
              <div className="w-12 h-12 bg-[#F3F2F9] text-[#645CBB] rounded-full flex items-center justify-center mx-auto mb-6">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-4 text-[#111]">Deploy & Deploy</h3>
              <p className="text-[#666] text-sm leading-relaxed">
                Request source code, custom feature development, or full white-label software deployment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED PROJECTS SECTION */}
      <section id="projects" className="py-16 md:py-24 px-4 sm:px-8 max-w-7xl mx-auto bg-white">
        <div className="flex flex-col mb-12">
          <div className="flex items-center gap-4 mb-4 text-xs font-bold tracking-widest uppercase text-[#D8C494]">
            CURATED PROJECTS
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-playfair font-medium text-[#16276B] mb-6">
                Featured <span className="text-[#D8C494] italic">Projects</span>
              </h2>
              <p className="text-[#666] font-light text-lg max-w-2xl">
                A curated selection of distinguished web applications, mobile platforms, and enterprise software systems.
              </p>
            </div>
            <Link
              href="/projects"
              className="flex items-center gap-2 font-medium text-sm hover:opacity-70 transition-opacity whitespace-nowrap"
            >
              View All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-3 mb-10">
            <span className="px-6 py-2 border border-[#D8C494] bg-[#D8C494]/10 text-[#D8C494] rounded-full text-sm font-medium cursor-pointer transition-colors">
              All
            </span>
            <span className="px-6 py-2 border border-[#EAEAEA] text-[#666] rounded-full text-sm hover:border-[#D8C494] hover:text-[#D8C494] cursor-pointer transition-colors">
              Web Apps
            </span>
            <span className="px-6 py-2 border border-[#EAEAEA] text-[#666] rounded-full text-sm hover:border-[#D8C494] hover:text-[#D8C494] cursor-pointer transition-colors">
              Mobile Platforms
            </span>
          </div>
        </div>

        <FeaturedProjects projects={JSON.parse(JSON.stringify(projects))} />
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="py-24 bg-[#FAFAFA] border-t border-[#EAEAEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center">
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#645CBB] mb-4">
            SUCCESS STORIES
          </div>
          <h2 className="text-4xl font-playfair font-medium text-[#16276B] mb-16">
            What Clients Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              {
                quote:
                  "The booking platform delivered was fast, responsive, and completely customized for our travel business needs.",
                name: "James Wilson",
                role: "Director, Sahab Travel",
                img: "https://ui-avatars.com/api/?name=James+Wilson&background=random",
              },
              {
                quote:
                  "High quality code structure and responsive UI components. Deployed to production seamlessly.",
                name: "Emily Roberts",
                role: "CTO, Nexus Tech",
                img: "https://ui-avatars.com/api/?name=Emily+Roberts&background=random",
              },
              {
                quote:
                  "The admin dashboard and live preview capabilities exceeded our expectations.",
                name: "Michael Chen",
                role: "Product Manager",
                img: "https://ui-avatars.com/api/?name=Michael+Chen&background=random",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl shadow-sm border border-[#EAEAEA] flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="flex gap-1 mb-4 text-[#F59E0B]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[#444] italic leading-relaxed mb-8">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-4 border-t border-[#EAEAEA] pt-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                    <img src={testimonial.img} alt={testimonial.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111] text-sm">{testimonial.name}</h4>
                    <p className="text-xs text-[#888]">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA BANNER */}
      <CTA />
    </div>
  );
}

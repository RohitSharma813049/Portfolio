import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import Category from "@/models/Category";
import FeaturedProjects from "@/components/FeaturedProjects";
import Link from "next/link";
import { ArrowRight, UserPlus, Compass, BookOpen } from "lucide-react";
import ClientSearch from "@/components/ClientSearch";
import CTA from "@/components/CTA";

export const revalidate = 60;

export default async function Home() {
  await connectToDatabase();
  const projects = await Project.find({}).sort({ createdAt: -1 }).lean();
  const dbCategories = await Category.find({}).lean();
  
  const totalProjects = projects.length;
  // Let's create dynamic category cards from the dbCategories, merging project counts
  const categoryCards = dbCategories.map(cat => {
    const count = projects.filter(p => p.categories && p.categories.includes(cat.name)).length;
    return {
      title: cat.name,
      count: `${count} PUBLICATION${count === 1 ? '' : 'S'}`,
      image: cat.coverImage || "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop"
    };
  });
  
  // If no DB categories exist yet, provide a default layout
  const displayCategories = categoryCards.length > 0 ? categoryCards.slice(0, 4) : [
    { title: "Research Articles", count: "3+ PAPERS", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop" },
    { title: "eBooks", count: "3+ BOOKS", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop" },
    { title: "Magazines", count: "0+ ISSUES", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop" },
    { title: "Theses", count: "3+ PAPERS", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop" }
  ];

  return (
    <div className="bg-white min-h-screen text-[#0B1B3D] font-sans">
      
      {/* 1. SPLIT HERO SECTION */}
      <section className="relative flex flex-col lg:flex-row min-h-[85vh] border-b border-[#EAEAEA]">
        
        {/* Left Side: Content */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 sm:px-16 py-12 lg:py-0">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="flex items-center gap-4 mb-8 text-xs font-bold tracking-widest uppercase text-[#D8C494]">
              <span className="w-8 h-px bg-[#D8C494]"></span>
              Peer-Reviewed · Open Access · Global Impact
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-playfair font-medium leading-[1.1] mb-6 text-[#111]">
              Building the Future<br />With Mega Project
            </h1>
            
            <p className="text-lg text-[#666] leading-relaxed mb-12 max-w-xl font-light">
              We deliver implementation-ready, highly accessible UI components and design systems for construction companies. Explore our portfolio of work below.
            </p>
            
            {/* Search Box */}
            <ClientSearch />
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-12">
              <span className="px-4 py-1.5 border border-black rounded-full text-xs font-medium cursor-pointer">All</span>
              <span className="px-4 py-1.5 border border-[#EAEAEA] text-[#666] rounded-full text-xs hover:border-black cursor-pointer transition-colors">Agriculture</span>
              <span className="px-4 py-1.5 border border-[#EAEAEA] text-[#666] rounded-full text-xs hover:border-black cursor-pointer transition-colors">Computer Science</span>
              <span className="px-4 py-1.5 border border-[#EAEAEA] text-[#666] rounded-full text-xs hover:border-black cursor-pointer transition-colors">Business</span>
              <span className="px-4 py-1.5 border border-[#EAEAEA] text-[#666] rounded-full text-xs hover:border-black cursor-pointer transition-colors">Scholars</span>
            </div>
            
            {/* Buttons */}
            <div className="flex flex-wrap gap-4 animate-fade-in-up-delay-1">
              <Link href="#projects" className="flex items-center gap-2 bg-black hover:bg-[#D8C494] text-white px-8 py-4 rounded-xl font-medium transition-all hover:scale-105 duration-300 shadow-sm hover:shadow-hover">
                Explore Projects <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/categories" className="flex items-center gap-2 bg-white border border-[#EAEAEA] text-[#111] hover:border-[#D8C494] hover:text-[#D8C494] px-8 py-4 rounded-xl font-medium transition-all hover:scale-105 duration-300">
                Meet Our Scholars
              </Link>
            </div>
          </div>
        </div>
        
        {/* Right Side: Image */}
        <div className="w-full lg:w-[45%] bg-[#1E1B38] relative min-h-[50vh] lg:min-h-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#1E1B38] to-[#2D2A54] opacity-90 mix-blend-multiply z-10" />
          <img 
            src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2000&auto=format&fit=crop" 
            alt="Library Book" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          <div className="absolute top-8 right-8 z-20">
            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              Open Access 2026
            </span>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
             <h2 className="text-white/20 font-playfair font-bold text-[15rem] leading-none tracking-tighter mix-blend-overlay select-none">AI</h2>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="border-b border-[#EAEAEA] py-12 bg-white relative z-10 -mt-1 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 text-center divide-x divide-y md:divide-y-0 divide-[#EAEAEA]">
          <div className="py-6 flex flex-col">
            <span className="font-playfair text-3xl md:text-4xl text-[#111] font-medium mb-1">{totalProjects}</span>
            <span className="text-[10px] uppercase tracking-widest text-[#666] font-bold">PROJECTS</span>
          </div>
          <div className="py-6 flex flex-col">
            <span className="font-playfair text-3xl md:text-4xl text-[#111] font-medium mb-1">350+</span>
            <span className="text-[10px] uppercase tracking-widest text-[#666] font-bold">COMPONENTS</span>
          </div>
          <div className="py-6 flex flex-col border-t md:border-t-0 border-[#EAEAEA]">
            <span className="font-playfair text-3xl md:text-4xl text-[#111] font-medium mb-1">9</span>
            <span className="text-[10px] uppercase tracking-widest text-[#666] font-bold">DEVELOPERS</span>
          </div>
          <div className="py-6 flex flex-col border-t md:border-t-0 border-[#EAEAEA]">
            <span className="font-playfair text-3xl md:text-4xl text-[#111] font-medium mb-1">80+</span>
            <span className="text-[10px] uppercase tracking-widest text-[#666] font-bold">COMPANIES</span>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section className="py-16 md:py-24 px-4 sm:px-8 max-w-7xl mx-auto bg-white">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-4 text-xs font-bold tracking-widest uppercase text-[#D8C494]">
              <span className="w-8 h-px bg-[#D8C494]"></span>
              BROWSE BY FORMAT
            </div>
            <h2 className="text-4xl md:text-5xl font-playfair font-medium text-[#111] mb-6">
              Publication <span className="text-[#645CBB] italic">Categories</span>
            </h2>
            <p className="text-[#666] font-light text-lg">
              Explore scholarly work across theses, research articles, eBooks and magazines — curated from 350+ peer-reviewed journals.
            </p>
          </div>
          <Link href="/categories" className="flex items-center gap-2 font-medium text-sm hover:opacity-70 transition-opacity whitespace-nowrap">
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCategories.map((cat, i) => (
            <Link href={`/categories`} key={i} className="group relative h-96 rounded-3xl overflow-hidden shadow-soft flex flex-col justify-end p-8 text-white">
              <div className="absolute inset-0 bg-[#2D2A54] z-0" />
              <img 
                src={cat.image} 
                alt={cat.title} 
                className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-700 z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111]/90 via-[#111]/20 to-transparent z-10" />
              
              <div className="relative z-20">
                <p className="text-[10px] font-bold tracking-widest uppercase mb-2 text-white/80">{cat.count}</p>
                <h3 className="font-playfair text-3xl font-medium mb-6 group-hover:-translate-y-2 transition-transform duration-300">{cat.title}</h3>
                
                <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-[#111] transition-all">
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
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#645CBB] mb-4">SIMPLE PROCESS</div>
          <h2 className="text-4xl font-playfair font-medium text-[#111] mb-16">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-[#EAEAEA] relative z-10">
              <div className="w-12 h-12 bg-[#F3F2F9] text-[#645CBB] rounded-full flex items-center justify-center mx-auto mb-6">
                <UserPlus className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-4 text-[#111]">Sign Up</h3>
              <p className="text-[#666] text-sm leading-relaxed">
                Create your account in seconds and join our global community of scholars.
              </p>
            </div>
            
            {/* Arrow between 1 and 2 */}
            <div className="hidden md:block absolute top-1/2 left-[30%] text-[#ccc] -translate-y-1/2 z-0">
               <ArrowRight className="w-6 h-6" />
            </div>

            <div className="bg-white rounded-2xl p-10 shadow-sm border border-[#EAEAEA] relative z-10">
              <div className="w-12 h-12 bg-[#F3F2F9] text-[#645CBB] rounded-full flex items-center justify-center mx-auto mb-6">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-4 text-[#111]">Explore or Apply</h3>
              <p className="text-[#666] text-sm leading-relaxed">
                Browse thousands of research papers, thesis, and publications or apply to become a publisher.
              </p>
            </div>
            
            {/* Arrow between 2 and 3 */}
            <div className="hidden md:block absolute top-1/2 right-[30%] text-[#ccc] -translate-y-1/2 z-0">
               <ArrowRight className="w-6 h-6" />
            </div>

            <div className="bg-white rounded-2xl p-10 shadow-sm border border-[#EAEAEA] relative z-10">
              <div className="w-12 h-12 bg-[#F3F2F9] text-[#645CBB] rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-4 text-[#111]">Publish & Read</h3>
              <p className="text-[#666] text-sm leading-relaxed">
                Share your research with the world or read groundbreaking publications from peers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED RESEARCH SECTION */}
      <section id="projects" className="py-16 md:py-24 px-4 sm:px-8 max-w-7xl mx-auto bg-white">
        <div className="flex flex-col mb-12">
          <div className="flex items-center gap-4 mb-4 text-xs font-bold tracking-widest uppercase text-[#D8C494]">
            <span className="w-8 h-px bg-[#D8C494]"></span>
            CURATED CONTENT
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-playfair font-medium text-[#111] mb-6">
                Featured <span className="text-[#D8C494] italic">Research</span>
              </h2>
              <p className="text-[#666] font-light text-lg max-w-2xl">
                A curated selection of distinguished research, eBooks and editorial work from scholars across 80 countries.
              </p>
            </div>
            <Link href="/categories" className="flex items-center gap-2 font-medium text-sm hover:opacity-70 transition-opacity whitespace-nowrap">
              View All Publications <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-3 mb-10">
            <span className="px-6 py-2 border border-[#D8C494] bg-[#D8C494]/10 text-[#D8C494] rounded-full text-sm font-medium cursor-pointer transition-colors">All</span>
            <span className="px-6 py-2 border border-[#EAEAEA] text-[#666] rounded-full text-sm hover:border-[#D8C494] hover:text-[#D8C494] cursor-pointer transition-colors">Education</span>
            <span className="px-6 py-2 border border-[#EAEAEA] text-[#666] rounded-full text-sm hover:border-[#D8C494] hover:text-[#D8C494] cursor-pointer transition-colors">Social Sciences</span>
          </div>
          
        </div>
        
        <FeaturedProjects projects={JSON.parse(JSON.stringify(projects))} />
        
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="py-24 bg-[#FAFAFA] border-t border-[#EAEAEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center">
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#645CBB] mb-4">SUCCESS STORIES</div>
          <h2 className="text-4xl font-playfair font-medium text-[#111] mb-16">What Scholars Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {[
              {
                quote: "Publishing my thesis was seamless. Global Scholar made it easy to share my work with the academic community.",
                name: "James Wilson",
                role: "PhD Candidate",
                img: "https://ui-avatars.com/api/?name=James+Wilson&background=random"
              },
              {
                quote: "The community here is incredible. Collaborating with peers from different countries has expanded my research horizons.",
                name: "Dr. Emily Roberts",
                role: "Quantum Physics",
                img: "https://ui-avatars.com/api/?name=Emily+Roberts&background=random"
              },
              {
                quote: "I've discovered breakthrough papers I would have never found otherwise. This platform is invaluable for my work.",
                name: "Prof. Michael Chen",
                role: "Environmental Scientist",
                img: "https://ui-avatars.com/api/?name=Michael+Chen&background=random"
              },
              {
                quote: "Global Scholar transformed how I share my research. The platform is intuitive and reaches scholars worldwide.",
                name: "Dr. Sarah Johnson",
                role: "Neuroscience Researcher",
                img: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=random"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-[#EAEAEA] flex flex-col">
                <div className="flex gap-1 mb-4 text-[#F59E0B]">
                  {[1,2,3,4,5].map(star => (
                    <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-[#444] italic leading-relaxed mb-8 flex-grow">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
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

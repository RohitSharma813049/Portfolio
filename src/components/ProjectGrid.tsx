"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, LayoutGrid, List, ArrowRight } from "lucide-react";
import WishlistButton from "./WishlistButton";
import EnquiryButton from "./EnquiryButton";

interface ProjectGridProps {
  initialProjects: any[];
}

const ITEMS_PER_PAGE = 8;

export default function ProjectGrid({ initialProjects }: ProjectGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Extract unique categories and technologies for the checkboxes
  const uniqueCategories = useMemo(() => {
    const cats = new Set<string>();
    initialProjects.forEach(p => p.categories?.forEach((c: string) => cats.add(c)));
    return Array.from(cats).sort();
  }, [initialProjects]);

  const uniqueTech = useMemo(() => {
    const techs = new Set<string>();
    initialProjects.forEach(p => p.technologies?.forEach((t: string) => techs.add(t)));
    return Array.from(techs).sort();
  }, [initialProjects]);

  // Filter & Sort
  const filteredAndSortedProjects = useMemo(() => {
    let result = initialProjects.filter((project) => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const nameMatch = project.name?.toLowerCase().includes(query);
        const descMatch = project.shortDescription?.toLowerCase().includes(query);
        const catMatch = project.categories?.some((cat: string) => cat.toLowerCase().includes(query));
        const techMatch = project.technologies?.some((tech: string) => tech.toLowerCase().includes(query));
        if (!nameMatch && !descMatch && !catMatch && !techMatch) return false;
      }
      
      // Category Filter (OR logic within categories, AND logic between groups)
      if (selectedCategories.length > 0) {
        if (!project.categories?.some((c: string) => selectedCategories.includes(c))) return false;
      }

      // Tech Filter
      if (selectedTechs.length > 0) {
        if (!project.technologies?.some((t: string) => selectedTechs.includes(t))) return false;
      }

      return true;
    });

    // Sort
    result = result.sort((a, b) => {
      if (sortBy === "A-Z") return a.name.localeCompare(b.name);
      if (sortBy === "Z-A") return b.name.localeCompare(a.name);
      
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      if (sortBy === "Oldest") return dateA - dateB;
      return dateB - dateA; // Newest is default
    });

    return result;
  }, [initialProjects, searchQuery, selectedCategories, selectedTechs, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProjects = filteredAndSortedProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset page when filters change
  useMemo(() => setCurrentPage(1), [searchQuery, selectedCategories, selectedTechs, sortBy]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleTech = (tech: string) => {
    setSelectedTechs(prev => 
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  return (
    <div className="flex flex-col mb-16">
      
      {/* Top Search Bar (Spans full width like the screenshot) */}
      <div className="w-full mb-10 animate-fade-in-up-delay-1">
        <div className="relative flex items-center group max-w-4xl shadow-sm">
          <Search className="absolute left-6 w-5 h-5 text-gray-400 group-focus-within:text-[#D8C494] transition-colors" />
          <input 
            type="text" 
            placeholder="Search projects, categories, subjects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-32 py-4 rounded-xl border border-[#EAEAEA] focus:outline-none focus:border-[#D8C494] transition-all text-[#111] bg-white"
          />
          <button 
            className="absolute right-2 bg-black hover:bg-[#D8C494] text-white px-6 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            Search
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Mobile Filter Toggle */}
        <button 
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="lg:hidden flex items-center justify-center gap-2 w-full py-3 border border-[#EAEAEA] rounded-xl text-[#111] font-medium bg-white"
        >
          <SlidersHorizontal className="w-5 h-5" /> Filters
        </button>

        {/* Sidebar Filters */}
        <aside className={`w-full lg:w-72 flex-shrink-0 animate-fade-in-up-delay-2 ${isMobileSidebarOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-8 bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-6 text-[#111]">Filters</h3>
            
            {/* Category Section (Publication Type in screenshot) */}
            <div className="mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111] mb-4">Categories</h4>
              <div className="space-y-3">
                {uniqueCategories.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedCategories.includes(cat) ? 'bg-[#D8C494] border-[#D8C494]' : 'border-[#ccc] group-hover:border-[#D8C494]'}`}>
                      {selectedCategories.includes(cat) && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className={`text-sm ${selectedCategories.includes(cat) ? 'font-semibold text-[#111]' : 'text-[#666] group-hover:text-[#111]'}`}>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tech Section (Subject Category in screenshot) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111] mb-4">Technologies</h4>
              <div className="space-y-3">
                {uniqueTech.map(tech => (
                  <label key={tech} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedTechs.includes(tech) ? 'bg-[#D8C494] border-[#D8C494]' : 'border-[#ccc] group-hover:border-[#D8C494]'}`}>
                      {selectedTechs.includes(tech) && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className={`text-sm ${selectedTechs.includes(tech) ? 'font-semibold text-[#111]' : 'text-[#666] group-hover:text-[#111]'}`}>{tech}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {(selectedCategories.length > 0 || selectedTechs.length > 0) && (
              <button 
                onClick={() => { setSelectedCategories([]); setSelectedTechs([]); }}
                className="mt-8 w-full py-2 text-sm font-semibold text-red-500 hover:text-red-600 transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-grow">
          {/* Top Bar above grid */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="text-sm text-[#16325C] font-medium">
              <span className="font-bold text-[#0B1B3D]">{filteredAndSortedProjects.length}</span> projects found
            </div>
            <div className="flex items-center gap-4">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-[#EAEAEA] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#D8C494] bg-white shadow-sm"
              >
                <option value="Newest">Latest First</option>
                <option value="Oldest">Oldest First</option>
                <option value="A-Z">A to Z</option>
                <option value="Z-A">Z to A</option>
              </select>
              
              {/* Optional layout toggles like screenshot (decorative) */}
              <div className="hidden sm:flex bg-gray-100 rounded-none-none p-1 border border-[#EAEAEA]">
                <button className="p-1.5 bg-blue-900 text-white rounded-none-none shadow-sm"><LayoutGrid className="w-4 h-4" /></button>
                <button className="p-1.5 text-[#666] hover:text-[#0B1B3D]"><List className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          {/* Project Grid */}
          {currentProjects.length === 0 ? (
            <div className="text-center text-[#666] py-20 bg-white border border-[#EAEAEA] rounded-3xl">
              {initialProjects.length === 0 
                ? "No published projects found. Log in to the Admin CMS to add some!"
                : "No projects match your search and filters."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up-delay-2">
              {currentProjects.map((project: any) => (
                <div key={project._id.toString()} className="group bg-white rounded-3xl overflow-hidden border border-[#EAEAEA] shadow-sm hover:shadow-hover transition-all flex flex-col h-full relative">
                  <div className="absolute top-4 right-4 z-20">
                     <WishlistButton projectId={project._id.toString()} />
                  </div>
                  
                  {/* Image */}
                  <div className="relative h-48 bg-[#f4f4f4] overflow-hidden">
                    <span className="absolute top-4 left-4 z-10 bg-[#0B1B3D]/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      {project.categories?.[0] || 'PROJECT'}
                    </span>
                    {project.featureImage ? (
                      <img src={project.featureImage} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                        <span className="text-[#0B1B3D]/20 font-bold text-xl px-4 text-center">{project.name}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#D8C494] mb-2">
                       {project.technologies?.[0] || 'FULL STACK'}
                    </h4>
                    <h3 className="font-playfair text-xl font-medium text-[#111] mb-4 line-clamp-2">
                       {project.name}
                    </h3>
                    
                    <p className="text-sm text-[#888] font-light line-clamp-2 mb-6 flex-grow">
                       {project.shortDescription}
                    </p>

                    <div className="flex items-center justify-between border-t border-[#EAEAEA] pt-4 mt-auto group/link cursor-pointer">
                      <Link href={`/project/${project.slug}`} className="text-sm font-semibold text-[#D8C494] flex items-center gap-2 group-hover/link:text-[#111] transition-colors">
                        View Project Details <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-none-none border border-[#EAEAEA] text-[#16325C] hover:bg-[#f4f4f4] disabled:opacity-50 disabled:cursor-not-allowed transition bg-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                      currentPage === i + 1 
                        ? "bg-[#D8C494] text-white shadow-sm" 
                        : "bg-white text-[#111] border border-[#EAEAEA] hover:bg-[#f4f4f4]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-none-none border border-[#EAEAEA] text-[#16325C] hover:bg-[#f4f4f4] disabled:opacity-50 disabled:cursor-not-allowed transition bg-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

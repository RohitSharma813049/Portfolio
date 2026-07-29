"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, LayoutGrid, List } from "lucide-react";
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
      <div className="w-full mb-10">
        <div className="relative flex items-center group max-w-4xl">
          <Search className="absolute left-6 w-6 h-6 text-[#16325C] group-focus-within:text-[#0B1B3D] transition-colors" />
          <input 
            type="text" 
            placeholder="Search projects, categories, subjects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-32 py-5 rounded-none-none border border-[#EAEAEA] shadow-soft focus:shadow-hover focus:outline-none focus:border-[#C59D5F] transition-all text-[#0B1B3D] text-lg bg-white/50 backdrop-blur-sm"
          />
          <button 
            className="absolute right-3 bg-[#C59D5F] hover:bg-[#A37B3E] text-white px-6 py-3 rounded-none-none font-semibold transition"
          >
            Search
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Mobile Filter Toggle */}
        <button 
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="lg:hidden flex items-center justify-center gap-2 w-full py-3 border border-[#EAEAEA] rounded-none-none text-[#0B1B3D] font-medium"
        >
          <SlidersHorizontal className="w-5 h-5" /> Filters
        </button>

        {/* Sidebar Filters */}
        <aside className={`w-full lg:w-72 flex-shrink-0 ${isMobileSidebarOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-8 bg-white border border-[#EAEAEA] rounded-none-none p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-6 text-[#0B1B3D]">Filters</h3>
            
            {/* Category Section (Publication Type in screenshot) */}
            <div className="mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#16325C] mb-4">Categories</h4>
              <div className="space-y-3">
                {uniqueCategories.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-none border flex items-center justify-center transition-colors ${selectedCategories.includes(cat) ? 'bg-[#C59D5F] border-[#C59D5F]' : 'border-[#ccc] group-hover:border-[#C59D5F]'}`}>
                      {selectedCategories.includes(cat) && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className={`text-sm ${selectedCategories.includes(cat) ? 'font-semibold text-[#0B1B3D]' : 'text-[#666] group-hover:text-[#0B1B3D]'}`}>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tech Section (Subject Category in screenshot) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#16325C] mb-4">Technologies</h4>
              <div className="space-y-3">
                {uniqueTech.map(tech => (
                  <label key={tech} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-none border flex items-center justify-center transition-colors ${selectedTechs.includes(tech) ? 'bg-[#C59D5F] border-[#C59D5F]' : 'border-[#ccc] group-hover:border-[#C59D5F]'}`}>
                      {selectedTechs.includes(tech) && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className={`text-sm ${selectedTechs.includes(tech) ? 'font-semibold text-[#0B1B3D]' : 'text-[#666] group-hover:text-[#0B1B3D]'}`}>{tech}</span>
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
              <span className="font-bold text-[#0B1B3D]">{filteredAndSortedProjects.length}</span> publications found
            </div>
            <div className="flex items-center gap-4">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-[#EAEAEA] rounded-none-none px-4 py-2 text-sm focus:outline-none focus:border-[#C59D5F] bg-white shadow-sm"
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
            <div className="text-center text-[#16325C] py-20 bg-white border border-[#EAEAEA] rounded-none-none">
              {initialProjects.length === 0 
                ? "No published projects found. Log in to the Admin CMS to add some!"
                : "No projects match your search and filters."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentProjects.map((project: any) => (
                <div key={project._id.toString()} className="group rounded-none-none border border-[#EAEAEA] bg-white shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col relative">
                  <WishlistButton projectId={project._id.toString()} />
                  <div className="aspect-[4/3] bg-[#f8f9fa] relative overflow-hidden flex items-center justify-center border-b border-[#EAEAEA]">
                    {project.featureImage ? (
                      <img src={project.featureImage} alt={project.name} className="w-full h-full object-cover rounded-none-none group-hover:scale-105 transition-transform duration-500 shadow-sm" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200 rounded-none-none flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                        <span className="text-[#0B1B3D] font-bold text-center px-4">{project.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex gap-2 flex-wrap mb-4">
                      {project.categories?.slice(0, 1).map((cat: string) => (
                        <span key={cat} className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-[#0B1B3D] px-2 py-1 rounded-none-none">{cat}</span>
                      ))}
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-xl leading-tight text-[#0B1B3D]">{project.name}</h3>
                    </div>
                    <p className="text-sm text-[#16325C] line-clamp-2 mb-6 flex-grow">
                      {project.shortDescription}
                    </p>
                    
                    <div className="flex gap-3 mt-auto pt-4 border-t border-[#EAEAEA]">
                      <Link 
                        href={`/project/${project.slug}`} 
                        className="flex-1 text-center text-sm font-semibold bg-[#f4f4f4] text-[#0B1B3D] hover:bg-[#EAEAEA] py-2 rounded-none transition"
                      >
                        View Details
                      </Link>
                      <EnquiryButton 
                        projectId={project._id.toString()}
                        projectName={project.name}
                      />
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
                    className={`w-10 h-10 flex items-center justify-center rounded-none-none text-sm font-medium transition ${
                      currentPage === i + 1 
                        ? "bg-[#C59D5F] text-white shadow-md" 
                        : "bg-white text-[#16325C] border border-[#EAEAEA] hover:bg-[#f4f4f4]"
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

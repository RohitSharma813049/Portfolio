"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Folder, SlidersHorizontal, ChevronLeft, ChevronRight, LayoutGrid, List } from "lucide-react";

interface CategoryGridProps {
  initialCategories: any[];
}

const ITEMS_PER_PAGE = 8;

export default function CategoryGrid({ initialCategories }: CategoryGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("A-Z");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Filter & Sort Logic
  const filteredAndSortedCategories = useMemo(() => {
    let result = initialCategories.filter((cat) => {
      if (searchQuery) {
        return cat._id.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    });

    // Sort
    result = result.sort((a, b) => {
      if (sortBy === "A-Z") return a._id.localeCompare(b._id);
      if (sortBy === "Z-A") return b._id.localeCompare(a._id);
      if (sortBy === "Most Projects") return b.count - a.count;
      if (sortBy === "Least Projects") return a.count - b.count;
      return 0;
    });

    return result;
  }, [initialCategories, searchQuery, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedCategories.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCategories = filteredAndSortedCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset page when search or sort changes
  useMemo(() => setCurrentPage(1), [searchQuery, sortBy]);

  return (
    <div className="flex flex-col mb-16">
      
      {/* Top Search Bar */}
      <div className="w-full mb-10">
        <div className="relative flex items-center group max-w-4xl">
          <Search className="absolute left-6 w-6 h-6 text-[#16325C] group-focus-within:text-[#0B1B3D] transition-colors" />
          <input 
            type="text" 
            placeholder="Search categories..." 
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

        {/* Sidebar */}
        <aside className={`w-full lg:w-72 flex-shrink-0 ${isMobileSidebarOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-8 bg-white border border-[#EAEAEA] rounded-none-none p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-6 text-[#0B1B3D]">Filters</h3>
            
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#16325C] mb-4">Sort Categories</h4>
              <div className="space-y-3">
                {["A-Z", "Z-A", "Most Projects", "Least Projects"].map(sortOption => (
                  <label key={sortOption} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="sortCategories" 
                      value={sortOption}
                      checked={sortBy === sortOption}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-4 h-4 text-[#0B1B3D] focus:ring-[#C59D5F]"
                    />
                    <span className={`text-sm ${sortBy === sortOption ? 'font-semibold text-[#0B1B3D]' : 'text-[#666] group-hover:text-[#0B1B3D]'}`}>{sortOption}</span>
                  </label>
                ))}
              </div>
            </div>
            
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-grow">
          {/* Top Bar above grid */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="text-sm text-[#16325C] font-medium">
              <span className="font-bold text-[#0B1B3D]">{filteredAndSortedCategories.length}</span> categories found
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex bg-gray-100 rounded-none-none p-1 border border-[#EAEAEA]">
                <button className="p-1.5 bg-blue-900 text-white rounded-none-none shadow-sm"><LayoutGrid className="w-4 h-4" /></button>
                <button className="p-1.5 text-[#666] hover:text-[#0B1B3D]"><List className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          {/* Grid */}
          {currentCategories.length === 0 ? (
            <div className="text-center text-[#16325C] py-20 bg-white border border-[#EAEAEA] rounded-none-none">
              No categories match your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {currentCategories.map((cat: any) => {
                const categorySlug = cat._id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
                
                return (
                  <Link 
                    href={`/category/${categorySlug}`} 
                    key={cat._id}
                    className="group flex flex-col rounded-none-none border border-[#EAEAEA] bg-white shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    {cat.featureImage ? (
                      <div className="w-full h-40 overflow-hidden border-b border-[#EAEAEA]">
                        <img 
                          src={cat.featureImage} 
                          alt={`${cat._id} category`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-40 bg-[#f8f9fa] border-b border-[#EAEAEA] flex items-center justify-center text-[#16325C]">
                        <Folder className="w-8 h-8 opacity-20" />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-1 text-[#0B1B3D]">{cat._id}</h3>
                      <p className="text-sm text-[#16325C] font-medium">
                        {cat.count} {cat.count === 1 ? 'Project' : 'Projects'}
                      </p>
                    </div>
                  </Link>
                );
              })}
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

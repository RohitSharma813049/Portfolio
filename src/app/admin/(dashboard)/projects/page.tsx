"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 8;

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  async function fetchProjects() {
    try {
      setLoading(true);
      const res = await fetch("/api/projects");
      const json = await res.json();
      if (json.success) {
        setProjects(json.data);
      }
    } catch (error) {
      console.error("Failed to load projects", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project? This cannot be undone.")) return;
    
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        fetchProjects(); // Refresh the list
      } else {
        alert("Failed to delete: " + json.error);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting the project.");
    }
  };

  // Extract unique categories
  const uniqueCategories = useMemo(() => {
    const cats = new Set<string>();
    projects.forEach(p => p.categories?.forEach((c: string) => cats.add(c)));
    return ["All", ...Array.from(cats).sort()];
  }, [projects]);

  // Filter & Sort Logic
  const filteredAndSortedProjects = useMemo(() => {
    let result = projects.filter((project) => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const nameMatch = project.name?.toLowerCase().includes(query);
        const catMatch = project.categories?.some((cat: string) => cat.toLowerCase().includes(query));
        if (!nameMatch && !catMatch) return false;
      }
      
      // Category Filter
      if (selectedCategory !== "All") {
        if (!project.categories?.includes(selectedCategory)) return false;
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
  }, [projects, searchQuery, selectedCategory, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProjects = filteredAndSortedProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset page when filters change
  useMemo(() => setCurrentPage(1), [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm text-[#16325C] mt-1">Manage your portfolio software projects.</p>
        </div>
        <Link href="/admin/projects/new" className="flex items-center gap-2 bg-[#111111] text-white px-5 py-2.5 rounded-none-none text-sm font-medium hover:bg-[#333] transition shadow-soft">
          <Plus className="w-4 h-4" /> Add Project
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex-grow flex items-center group">
            <Search className="absolute left-4 w-5 h-5 text-[#16325C] group-focus-within:text-[#0B1B3D] transition-colors" />
            <input 
              type="text" 
              placeholder="Search projects by name or category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-none-none border border-[#EAEAEA] shadow-sm focus:outline-none focus:border-[#111111] transition-all text-sm"
            />
          </div>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-3 rounded-none-none transition flex items-center justify-center gap-2 font-medium text-sm border shadow-sm ${isFilterOpen ? 'bg-[#111111] text-white border-[#111111]' : 'bg-white text-[#16325C] border-[#EAEAEA] hover:bg-[#f4f4f4]'}`}
          >
            <SlidersHorizontal className="w-4 h-4" /> 
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {isFilterOpen && (
          <div className="bg-white border border-[#EAEAEA] rounded-none-none p-4 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#16325C] mb-2">Category</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-[#EAEAEA] rounded-none-none px-3 py-2 text-sm focus:outline-none focus:border-[#111111] bg-white"
              >
                {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#16325C] mb-2">Sort By</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-[#EAEAEA] rounded-none-none px-3 py-2 text-sm focus:outline-none focus:border-[#111111] bg-white"
              >
                <option value="Newest">Newest First</option>
                <option value="Oldest">Oldest First</option>
                <option value="A-Z">A to Z</option>
                <option value="Z-A">Z to A</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-[#EAEAEA] rounded-none-none shadow-sm overflow-hidden mb-6">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f8f9fa] border-b border-[#EAEAEA]">
            <tr>
              <th className="px-6 py-4 font-semibold text-[#16325C]">Project Name</th>
              <th className="px-6 py-4 font-semibold text-[#16325C]">Status</th>
              <th className="px-6 py-4 font-semibold text-[#16325C]">Categories</th>
              <th className="px-6 py-4 font-semibold text-[#16325C] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-[#16325C]">Loading projects...</td>
              </tr>
            ) : currentProjects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-[#16325C]">No projects found.</td>
              </tr>
            ) : (
              currentProjects.map((project: any) => (
                <tr key={project._id} className="border-b border-[#EAEAEA] hover:bg-[#fafafa] transition">
                  <td className="px-6 py-4 font-medium text-[#0B1B3D]">{project.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-none-none text-xs font-semibold ${project.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#16325C]">{project.categories?.join(', ') || '-'}</td>
                  <td className="px-6 py-4 flex items-center justify-end gap-3">
                    <Link href={`/admin/projects/${project._id}/edit`} className="text-[#0B1B3D] hover:bg-[#FCF9F2] p-2 rounded-none-none transition">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(project._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-none-none transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-none-none border border-[#EAEAEA] text-[#16325C] hover:bg-[#f4f4f4] disabled:opacity-50 disabled:cursor-not-allowed transition"
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
                    ? "bg-[#111111] text-white" 
                    : "text-[#16325C] hover:bg-[#f4f4f4]"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-none-none border border-[#EAEAEA] text-[#16325C] hover:bg-[#f4f4f4] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

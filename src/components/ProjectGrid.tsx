"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

interface ProjectGridProps {
  initialProjects: any[];
}

export default function ProjectGrid({ initialProjects }: ProjectGridProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter projects based on the search query
  const filteredProjects = initialProjects.filter((project) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const nameMatch = project.name?.toLowerCase().includes(query);
    const descMatch = project.shortDescription?.toLowerCase().includes(query);
    
    const catMatch = project.categories?.some((cat: string) => 
      cat.toLowerCase().includes(query)
    );
    
    const techMatch = project.technologies?.some((tech: string) => 
      tech.toLowerCase().includes(query)
    );

    return nameMatch || descMatch || catMatch || techMatch;
  });

  return (
    <>
      {/* Search Bar */}
      <div className="max-w-xl mx-auto relative flex items-center mb-16">
        <Search className="absolute left-4 w-5 h-5 text-[#666666]" />
        <input 
          type="text" 
          placeholder="Search projects by name, category, or tech..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-xl border border-[#EAEAEA] shadow-soft focus:outline-none focus:border-[#111111] transition text-[#111111]"
        />
      </div>

      {/* Project Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center text-[#666666] py-12">
          {initialProjects.length === 0 
            ? "No published projects found. Log in to the Admin CMS to add some!"
            : "No projects match your search."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProjects.map((project: any) => (
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
                  {project.categories?.slice(0, 1).map((cat: string) => (
                    <span key={cat} className="text-xs font-medium bg-[#f4f4f4] px-2 py-1 rounded-md">{cat}</span>
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
    </>
  );
}

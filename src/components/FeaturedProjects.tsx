"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FeaturedProjectsProps {
  projects: any[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  // Take top 4 projects for featured
  const featured = projects.slice(0, 4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {featured.map((project) => (
        <div key={project._id.toString()} className="group bg-white rounded-3xl overflow-hidden border border-[#EAEAEA] shadow-sm hover:shadow-hover transition-all flex flex-col h-full">
          {/* Image */}
          <div className="relative h-48 bg-[#f4f4f4] overflow-hidden">
            <span className="absolute top-4 left-4 z-10 bg-[#0B1B3D]/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              {project.categories?.[0] || 'ARTICLE'}
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
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#16276B] mb-2">
               {project.technologies?.[0] || 'EDUCATION'}
            </h4>
            <h3 className="font-playfair text-xl font-medium text-[#111] mb-4 line-clamp-2">
               {project.name}
            </h3>
            
            {/* Author */}
            <div className="flex items-center gap-3 mb-6">
               <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Author" className="w-full h-full object-cover" />
               </div>
               <span className="text-sm font-medium text-[#666]">Admin</span>
            </div>
            
            <p className="text-sm text-[#888] font-light line-clamp-2 mb-6 flex-grow">
               {project.shortDescription}
            </p>

            <div className="flex items-center justify-between border-t border-[#EAEAEA] pt-4 mt-auto group/link cursor-pointer">
              <Link href={`/project/${project.slug}`} className="text-sm font-semibold text-[#16276B] flex items-center gap-2 group-hover/link:text-[#0B1B3D] transition-colors">
                Read Full Publication <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
              <span className="text-xs text-[#999]">{Math.floor(Math.random() * 50) + 1} reads</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

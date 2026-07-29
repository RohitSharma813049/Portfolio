"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface FeaturedProjectsProps {
  projects: any[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -350, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full">
      <div className="flex justify-end gap-3 mb-6 relative z-20">
        <button onClick={scrollLeft} className="w-12 h-12 flex items-center justify-center rounded-full border border-[#EAEAEA] bg-white hover:border-[#D8C494] hover:text-[#D8C494] transition-colors shadow-sm text-[#111]">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={scrollRight} className="w-12 h-12 flex items-center justify-center rounded-full border border-[#EAEAEA] bg-white hover:border-[#D8C494] hover:text-[#D8C494] transition-colors shadow-sm text-[#111]">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div 
        ref={scrollRef} 
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}} />
      {projects.map((project) => (
        <div key={project._id.toString()} className="group snap-start bg-white rounded-3xl overflow-hidden border border-[#EAEAEA] shadow-sm hover:shadow-hover transition-all flex flex-col h-full min-w-[280px] md:min-w-[320px] lg:min-w-[380px] shrink-0">
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
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#D8C494] mb-2">
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
              <Link href={`/project/${project.slug}`} className="text-sm font-semibold text-[#D8C494] flex items-center gap-2 group-hover/link:text-[#111] transition-colors">
                Read Full Publication <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
              <span className="text-xs text-[#999]">{Math.floor(Math.random() * 50) + 1} reads</span>
            </div>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}

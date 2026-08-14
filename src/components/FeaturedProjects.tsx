"use client";

import { useRef, useCallback, memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProjectCard from "./ProjectCard";

interface FeaturedProjectsProps {
  projects: any[];
}

function FeaturedProjectsComponent({ projects }: FeaturedProjectsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = useCallback(() => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ left: -containerWidth, behavior: "smooth" });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ left: containerWidth, behavior: "smooth" });
    }
  }, []);

  return (
    <div className="relative w-full">
      <div className="flex justify-end gap-3 mb-6 relative z-20">
        <button
          onClick={scrollLeft}
          aria-label="Previous Projects"
          className="w-12 h-12 flex items-center justify-center rounded-full border border-[#EAEAEA] bg-white hover:border-[#D8C494] hover:text-[#D8C494] transition-colors shadow-sm text-[#111] cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={scrollRight}
          aria-label="Next Projects"
          className="w-12 h-12 flex items-center justify-center rounded-full border border-[#EAEAEA] bg-white hover:border-[#D8C494] hover:text-[#D8C494] transition-colors shadow-sm text-[#111] cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `,
          }}
        />
        {projects.map((project) => (
          <ProjectCard
            key={project._id?.toString() || project.slug}
            project={project}
            showWishlist={false}
            imageHeightClass="h-60 sm:h-64 md:h-72"
            containerClass="group snap-start bg-white rounded-3xl overflow-hidden border border-[#EAEAEA] shadow-sm hover:shadow-hover transition-all flex flex-col h-full w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0"
          />
        ))}
      </div>
    </div>
  );
}

export default memo(FeaturedProjectsComponent);

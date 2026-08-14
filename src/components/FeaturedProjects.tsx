"use client";

import { useState, useMemo, useRef, useCallback, memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProjectCard from "./ProjectCard";

interface FeaturedProjectsProps {
  projects: any[];
  categories?: string[];
}

function FeaturedProjectsComponent({ projects, categories }: FeaturedProjectsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Collect available category options dynamically from actual projects
  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      p.categories?.forEach((c: string) => {
        if (c && c.trim()) set.add(c.trim());
      });
    });
    return ["All", ...Array.from(set)];
  }, [projects]);

  // Filter projects by selected category
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") return projects;
    return projects.filter((p) =>
      p.categories?.some(
        (c: string) => c.toLowerCase() === selectedCategory.toLowerCase()
      )
    );
  }, [projects, selectedCategory]);

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

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
      {/* Category Pills & Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        {/* Scrollable Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 max-w-full">
          {categoryOptions.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleSelectCategory(cat)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[#D8C494] text-black shadow-sm font-semibold"
                    : "bg-white border border-[#EAEAEA] text-[#666] hover:border-[#D8C494] hover:text-[#111]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Next/Prev Navigation Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            onClick={scrollLeft}
            aria-label="Previous Projects"
            className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full border border-[#EAEAEA] bg-white hover:border-[#D8C494] hover:text-[#D8C494] transition-colors shadow-sm text-[#111] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={scrollRight}
            aria-label="Next Projects"
            className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full border border-[#EAEAEA] bg-white hover:border-[#D8C494] hover:text-[#D8C494] transition-colors shadow-sm text-[#111] cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Projects Carousel Grid */}
      {filteredProjects.length === 0 ? (
        <div className="py-16 text-center bg-[#f9f9f9] border border-[#EAEAEA] rounded-3xl text-[#666] text-sm">
          No projects found in <strong className="text-[#111]">{selectedCategory}</strong>.
        </div>
      ) : (
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
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id?.toString() || project.slug}
              project={project}
              showWishlist={false}
              imageHeightClass="h-60 sm:h-64 md:h-72"
              containerClass="group snap-start bg-white rounded-3xl overflow-hidden border border-[#EAEAEA] shadow-sm hover:shadow-hover transition-all flex flex-col h-full w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(FeaturedProjectsComponent);

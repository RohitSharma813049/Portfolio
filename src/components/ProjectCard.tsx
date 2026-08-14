"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import WishlistButton from "./WishlistButton";

export interface ProjectCardData {
  _id: string | any;
  name: string;
  slug: string;
  shortDescription?: string;
  featureImage?: string;
  categories?: string[];
  technologies?: string[];
}

interface ProjectCardProps {
  project: ProjectCardData;
  showWishlist?: boolean;
  imageHeightClass?: string;
  containerClass?: string;
}

function ProjectCardComponent({
  project,
  showWishlist = true,
  imageHeightClass = "h-48",
  containerClass = "group bg-white rounded-3xl overflow-hidden border border-[#EAEAEA] shadow-sm hover:shadow-hover transition-all flex flex-col h-full relative",
}: ProjectCardProps) {
  const projectId = project._id?.toString() || project._id;
  const categoryTag = project.categories?.[0];
  const techTag = project.technologies?.[0] || "FULL STACK";

  return (
    <div className={containerClass}>
      {showWishlist && projectId && (
        <div className="absolute top-4 right-4 z-20">
          <WishlistButton projectId={projectId} />
        </div>
      )}

      {/* Poster / Image Box */}
      <div className={`relative ${imageHeightClass || "aspect-[16/10] sm:h-48"} w-full bg-[#f4f4f4] overflow-hidden shrink-0`}>
        {categoryTag && (
          <span className="absolute top-4 left-4 z-10 bg-[#0B1B3D]/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            {categoryTag}
          </span>
        )}
        {project.featureImage ? (
          <img
            src={project.featureImage}
            alt={project.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
            <span className="text-[#0B1B3D]/20 font-bold text-xl px-4 text-center">
              {project.name}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#D8C494] mb-2">
          {techTag}
        </h4>
        <h3 className="font-playfair text-xl font-medium text-[#111] mb-4 line-clamp-2">
          {project.name}
        </h3>

        <p className="text-sm text-[#888] font-light line-clamp-2 mb-6 flex-grow">
          {project.shortDescription}
        </p>

        <div className="flex items-center justify-between border-t border-[#EAEAEA] pt-4 mt-auto group/link cursor-pointer">
          <Link
            href={`/project/${project.slug}`}
            className="text-sm font-semibold text-[#D8C494] flex items-center gap-2 group-hover/link:text-[#111] transition-colors"
          >
            View Project Details{" "}
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export const ProjectCard = React.memo(ProjectCardComponent);
export default ProjectCard;

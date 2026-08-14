"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import { getVideoEmbedInfo } from "@/lib/videoUtils";

interface ProjectGalleryProps {
  featureImage: string;
  screenshots?: { url?: string; type: string }[];
  panels?: { image?: string; name: string }[];
  videoUrl?: string;
  projectName: string;
}

export default function ProjectGallery({
  featureImage,
  screenshots = [],
  panels = [],
  videoUrl,
  projectName,
}: ProjectGalleryProps) {
  const galleryItems: { type: "image" | "video"; url: string; label?: string; videoInfo?: any }[] = [];

  if (featureImage) {
    galleryItems.push({ type: "image", url: featureImage, label: "Feature" });
  }

  if (videoUrl) {
    const videoInfo = getVideoEmbedInfo(videoUrl);
    galleryItems.push({
      type: "video",
      url: videoUrl,
      label: "Video Tour",
      videoInfo,
    });
  }

  screenshots.forEach((shot) => {
    if (shot.url) {
      galleryItems.push({ type: "image", url: shot.url, label: shot.type });
    }
  });

  panels.forEach((panel) => {
    if (panel.image) {
      galleryItems.push({ type: "image", url: panel.image, label: panel.name });
    }
  });

  const [activeIndex, setActiveIndex] = useState(0);

  if (galleryItems.length === 0) {
    return (
      <div className="w-full aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center relative z-10 border border-[#EAEAEA]">
        <span className="text-[#999] font-playfair text-xl sm:text-2xl text-center">No Image Available</span>
      </div>
    );
  }

  const activeItem = galleryItems[activeIndex];

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  return (
    <div className="flex flex-col gap-3 w-full relative z-10">
      {/* Main Display Box */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-auto md:h-[420px] lg:h-[480px] rounded-2xl overflow-hidden bg-[#111] group shadow-sm border border-[#EAEAEA] flex items-center justify-center">
        {activeItem.type === "image" ? (
          <img
            src={activeItem.url}
            alt={`${projectName} view`}
            className="w-full h-full object-contain bg-[#111] transition-opacity duration-300"
          />
        ) : activeItem.videoInfo?.isVideoFile ? (
          <video src={activeItem.videoInfo.embedUrl} controls className="w-full h-full object-contain bg-black" />
        ) : (
          <iframe
            src={activeItem.videoInfo?.embedUrl || activeItem.url}
            title="Video Tour"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}

        {/* Carousel Overlay Nav Arrows */}
        {galleryItems.length > 1 && activeItem.type === "image" && (
          <>
            <button
              onClick={prevImage}
              aria-label="Previous Image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-black opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-105 cursor-pointer z-20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next Image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-black opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-105 cursor-pointer z-20"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Current Image Label / Counter Badge */}
        {galleryItems.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full z-20 border border-white/20">
            {activeIndex + 1} / {galleryItems.length}
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {galleryItems.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto py-1 px-0.5 scrollbar-hide w-full shrink-0">
          {galleryItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 cursor-pointer ${
                activeIndex === idx
                  ? "border-[#D8C494] shadow-md scale-105"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              {item.type === "image" ? (
                <img src={item.url} alt={`${projectName} thumbnail ${idx}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center relative">
                  {item.videoInfo?.thumbnail ? (
                    <>
                      <img src={item.videoInfo.thumbnail} className="w-full h-full object-cover opacity-60" alt="Video thumbnail" />
                      <PlayCircle className="w-5 h-5 text-white absolute" />
                    </>
                  ) : (
                    <PlayCircle className="w-6 h-6 text-white" />
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

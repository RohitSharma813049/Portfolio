"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";

interface ProjectGalleryProps {
  featureImage: string;
  screenshots?: { url?: string; type: string }[];
  panels?: { image?: string; name: string }[];
  videoUrl?: string;
  projectName: string;
}

export default function ProjectGallery({ featureImage, screenshots = [], panels = [], videoUrl, projectName }: ProjectGalleryProps) {
  // Combine all images into a single array
  const galleryItems: { type: "image" | "video"; url: string; label?: string; videoId?: string }[] = [];
  
  if (featureImage) {
    galleryItems.push({ type: "image", url: featureImage, label: "Feature" });
  }

  // Add video if exists (assume YouTube for now, extract ID to use as thumbnail if possible, else generic thumbnail)
  if (videoUrl) {
    let videoId = "";
    if (videoUrl.includes("youtube.com/watch?v=")) {
      videoId = videoUrl.split("watch?v=")[1].split("&")[0];
    } else if (videoUrl.includes("youtu.be/")) {
      videoId = videoUrl.split("youtu.be/")[1].split("?")[0];
    }
    
    galleryItems.push({ 
      type: "video", 
      url: videoUrl, 
      label: "Video Tour",
      videoId: videoId
    });
  }

  screenshots.forEach(shot => {
    if (shot.url) {
      galleryItems.push({ type: "image", url: shot.url, label: shot.type });
    }
  });

  panels.forEach(panel => {
    if (panel.image) {
      galleryItems.push({ type: "image", url: panel.image, label: panel.name });
    }
  });

  const [activeIndex, setActiveIndex] = useState(0);

  if (galleryItems.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200 rounded-2xl flex items-center justify-center relative z-10 border border-[#EAEAEA]">
        <span className="text-[#999] font-playfair text-2xl text-center">No Image</span>
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
    <div className="flex flex-col-reverse md:flex-row gap-4 w-full h-full p-2 relative">
      {/* Thumbnails (Left side on desktop, bottom on mobile) */}
      {galleryItems.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-24 flex-shrink-0 z-10 p-1">
          {galleryItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-square rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${
                activeIndex === idx ? "border-[#D8C494] shadow-[0_0_10px_rgba(216,196,148,0.3)]" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              {item.type === "image" ? (
                <img src={item.url} alt={`${projectName} thumbnail ${idx}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center relative">
                   {item.videoId ? (
                     <>
                       <img src={`https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`} className="w-full h-full object-cover opacity-60" alt="Video thumbnail" />
                       <PlayCircle className="w-6 h-6 text-white absolute" />
                     </>
                   ) : (
                     <PlayCircle className="w-8 h-8 text-white" />
                   )}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Main Display */}
      <div className="flex-1 relative rounded-2xl overflow-hidden bg-black z-10 group shadow-sm border border-[#EAEAEA] w-full min-h-[300px] sm:min-h-[400px] md:h-full">
        {activeItem.type === "image" ? (
           <img 
             src={activeItem.url} 
             alt={`${projectName} view`} 
             className="w-full h-full object-contain bg-[#f8f9fa] transition-opacity duration-500" 
           />
        ) : (
           <iframe 
             src={activeItem.url.replace("watch?v=", "embed/")} 
             title="Video Tour" 
             className="w-full h-full border-0"
             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
             allowFullScreen
           ></iframe>
        )}

        {/* Carousel Controls */}
        {galleryItems.length > 1 && activeItem.type === "image" && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-105"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-105"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

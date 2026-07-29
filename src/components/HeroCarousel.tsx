"use client";

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroCarousel({ projects }: { projects: any[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  if (!projects || projects.length === 0) return null;

  // Take top 5 projects
  const carouselProjects = projects.slice(0, 5);

  return (
    <div className="relative max-w-5xl mx-auto mt-12 rounded-none-none overflow-hidden shadow-hover border border-[#EAEAEA]">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {carouselProjects.map((project, index) => (
            <div className="flex-[0_0_100%] min-w-0 relative aspect-[16/9] md:aspect-[3/1] max-h-[400px]" key={project._id.toString()}>
              {project.featureImage ? (
                <img src={project.featureImage} alt={project.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center">
                   <span className="text-4xl font-bold text-[#1E3A8A] opacity-50">{project.name}</span>
                </div>
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                <h2 className="text-3xl font-bold text-white mb-2">{project.name}</h2>
                <p className="text-white/80 line-clamp-2 max-w-2xl mb-4">{project.shortDescription}</p>
                <div className="flex gap-2 mb-4">
                  {project.technologies?.slice(0,3).map((t: string) => (
                    <span key={t} className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-none text-white text-xs font-semibold">{t}</span>
                  ))}
                </div>
                <Link href={`/project/${project.slug}`} className="bg-[#4169E1] hover:bg-[#1E3A8A] text-white px-6 py-2 rounded-none-none font-medium transition-colors inline-block">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation */}
      <button onClick={scrollPrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/30 hover:bg-white/50 backdrop-blur-md rounded-none-none text-white transition z-20">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={scrollNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/30 hover:bg-white/50 backdrop-blur-md rounded-none-none text-white transition z-20">
        <ChevronRight className="w-6 h-6" />
      </button>
      
      {/* Dots */}
      <div className="absolute bottom-4 right-8 flex gap-2 z-20">
        {carouselProjects.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => emblaApi?.scrollTo(idx)}
            className={`w-2.5 h-2.5 rounded-none-none transition-all ${idx === selectedIndex ? 'bg-white w-6' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}

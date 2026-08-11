"use client";

import { useState } from "react";
import EnquiryModal from "./EnquiryModal";
import { formatExternalUrl } from "@/lib/videoUtils";
import { ExternalLink, Calendar, HelpCircle } from "lucide-react";

interface ProjectActionButtonsProps {
  projectId: string;
  projectName: string;
  bookDemoUrl?: string;
  livePreviewUrl?: string;
}

export default function ProjectActionButtons({
  projectId,
  projectName,
  bookDemoUrl,
  livePreviewUrl,
}: ProjectActionButtonsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSubject, setModalSubject] = useState("Project Enquiry");

  const formattedDemoUrl = formatExternalUrl(bookDemoUrl);
  const formattedPreviewUrl = formatExternalUrl(livePreviewUrl);

  const handleBookDemo = (e: React.MouseEvent) => {
    if (formattedDemoUrl) {
      window.open(formattedDemoUrl, "_blank", "noopener,noreferrer");
    } else {
      e.preventDefault();
      setModalSubject("Book Demo Request");
      setIsModalOpen(true);
    }
  };

  const handleLivePreview = (e: React.MouseEvent) => {
    if (formattedPreviewUrl) {
      window.open(formattedPreviewUrl, "_blank", "noopener,noreferrer");
    } else {
      e.preventDefault();
      setModalSubject("Live Preview Request");
      setIsModalOpen(true);
    }
  };

  const handleEnquiryForCost = () => {
    setModalSubject("Project Cost & Pricing Enquiry");
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        {/* Book Demo Button */}
        <button
          type="button"
          onClick={handleBookDemo}
          className="bg-black hover:bg-[#D8C494] text-white px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-sm hover:scale-105 duration-300 flex items-center gap-2 cursor-pointer"
        >
          <Calendar className="w-4 h-4" /> Book Demo
        </button>

        {/* Enquiry for Cost Button */}
        <button
          type="button"
          onClick={handleEnquiryForCost}
          className="border border-[#EAEAEA] bg-white text-[#111] hover:border-[#D8C494] hover:text-[#D8C494] px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-sm hover:scale-105 duration-300 flex items-center gap-2 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" /> Enquiry for Cost
        </button>

        {/* Live Preview Button */}
        <button
          type="button"
          onClick={handleLivePreview}
          className="border border-[#EAEAEA] bg-white text-[#111] hover:border-[#D8C494] hover:text-[#D8C494] px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-sm hover:scale-105 duration-300 flex items-center gap-2 cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" /> Live Preview
        </button>
      </div>

      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectName={projectName}
        projectId={projectId}
        defaultSubject={modalSubject}
      />
    </>
  );
}

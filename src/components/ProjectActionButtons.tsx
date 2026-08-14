"use client";

import { useState } from "react";
import EnquiryModal from "./EnquiryModal";
import { formatExternalUrl } from "@/lib/videoUtils";
import { ExternalLink, Calendar, ShoppingBag, Settings, HelpCircle } from "lucide-react";

interface ProjectActionButtonsProps {
  projectId: string;
  projectName: string;
  bookDemoUrl?: string;
  livePreviewUrl?: string;
  purchaseOption?: "BOTH" | "BUY" | "CUSTOMISE" | "NONE" | string;
}

export default function ProjectActionButtons({
  projectId,
  projectName,
  bookDemoUrl,
  livePreviewUrl,
  purchaseOption = "BOTH",
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

  const handleBuySoftware = () => {
    setModalSubject("Buy Ready Software Enquiry");
    setIsModalOpen(true);
  };

  const handleCustomiseSoftware = () => {
    setModalSubject("Custom Software Development Request");
    setIsModalOpen(true);
  };

  const showBuy = purchaseOption === "BUY" || purchaseOption === "BOTH";
  const showCustomise = purchaseOption === "CUSTOMISE" || purchaseOption === "BOTH";

  return (
    <>
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 w-full">
        {/* Buy Button */}
        {showBuy && (
          <button
            type="button"
            onClick={handleBuySoftware}
            className="w-full sm:w-auto bg-black hover:bg-[#D8C494] text-white px-3.5 sm:px-6 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm hover:scale-105 duration-300 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 shrink-0 text-[#D8C494]" /> Buy Software
          </button>
        )}

        {/* Customise Button */}
        {showCustomise && (
          <button
            type="button"
            onClick={handleCustomiseSoftware}
            className="w-full sm:w-auto bg-[#D8C494] text-black hover:bg-[#c2ae7c] px-3.5 sm:px-6 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm hover:scale-105 duration-300 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer"
          >
            <Settings className="w-4 h-4 shrink-0" /> Customise Software
          </button>
        )}

        {/* Book Demo Button */}
        <button
          type="button"
          onClick={handleBookDemo}
          className="w-full sm:w-auto border border-[#EAEAEA] bg-white text-[#111] hover:border-[#D8C494] hover:text-[#D8C494] px-3.5 sm:px-6 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm hover:scale-105 duration-300 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer"
        >
          <Calendar className="w-4 h-4 shrink-0" /> Book Demo
        </button>

        {/* Live Preview Button */}
        <button
          type="button"
          onClick={handleLivePreview}
          className="w-full sm:w-auto border border-[#EAEAEA] bg-white text-[#111] hover:border-[#D8C494] hover:text-[#D8C494] px-3.5 sm:px-6 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm hover:scale-105 duration-300 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer"
        >
          <ExternalLink className="w-4 h-4 shrink-0" /> Live Preview
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

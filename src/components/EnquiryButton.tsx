"use client";

import { useState } from "react";
import EnquiryModal from "./EnquiryModal";

interface EnquiryButtonProps {
  projectId: string;
  projectName: string;
  className?: string;
  buttonText?: string;
}

export default function EnquiryButton({
  projectId,
  projectName,
  className = "flex-1 text-center text-sm font-semibold bg-black text-white hover:bg-[#D8C494] py-3 rounded-full transition cursor-pointer",
  buttonText = "Enquiry",
}: EnquiryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        {buttonText}
      </button>

      <EnquiryModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        projectName={projectName}
        projectId={projectId}
        defaultSubject={`Enquiry for ${projectName}`}
      />
    </>
  );
}

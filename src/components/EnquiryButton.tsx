"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface EnquiryButtonProps {
  projectId: string;
  projectName: string;
  className?: string;
  buttonText?: string;
}

export default function EnquiryButton({ 
  projectId, 
  projectName, 
  className = "flex-1 text-center text-sm font-semibold bg-[#1E3A8A] text-white hover:bg-[#152960] py-2 rounded-none transition",
  buttonText = "Enquiry"
}: EnquiryButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleEnquiry = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Attempt to add to wishlist (which also acts as our auth check)
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, action: "add" }),
      });
      
      // 2. If unauthorized, redirect to login
      if (res.status === 401) {
        // Pass the current pathname so we can return here after login if desired
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
      
      // 3. If successful (or already in wishlist), proceed to contact page
      if (res.ok) {
        router.push(`/contact?project=${encodeURIComponent(projectName)}`);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleEnquiry} 
      disabled={loading}
      className={`${className} ${loading ? 'opacity-75 cursor-wait' : ''}`}
    >
      {loading ? "Processing..." : buttonText}
    </button>
  );
}

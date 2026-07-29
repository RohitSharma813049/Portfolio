"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WishlistButton({ projectId }: { projectId: string }) {
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkWishlist() {
      try {
        const res = await fetch("/api/wishlist");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setInWishlist(data.data.some((p: any) => p._id === projectId || p === projectId));
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    checkWishlist();
  }, [projectId]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Optimistic update
    const previousState = inWishlist;
    setInWishlist(!inWishlist);

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, action: previousState ? "remove" : "add" }),
      });
      
      if (res.status === 401) {
        router.push("/login"); // Redirect to login if not authenticated
        setInWishlist(previousState);
        return;
      }
    } catch (error) {
      setInWishlist(previousState);
    }
  };

  if (loading) return null; // Or a subtle skeleton

  return (
    <button 
      onClick={toggleWishlist}
      className={`absolute top-4 right-4 p-2 rounded-none-none shadow-soft backdrop-blur-md transition-all z-10 
        ${inWishlist ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-white/70 text-gray-400 hover:bg-white hover:text-red-500"}`}
    >
      <Heart className="w-5 h-5" fill={inWishlist ? "currentColor" : "none"} />
    </button>
  );
}

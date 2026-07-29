"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProjectGrid from "@/components/ProjectGrid";
import { LogOut, User } from "lucide-react";

export default function DashboardPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchWishlist() {
      try {
        const res = await fetch("/api/wishlist");
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (data.success) {
          setWishlist(data.data);
        }
      } catch (error) {
        console.error("Failed to load wishlist", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWishlist();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-[#EAEAEA] py-6 px-8 flex justify-between items-center">
        <div className="font-bold text-xl tracking-tight">Client Panel</div>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-[#0B1B3D] transition">Back to Home</Link>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 px-4 py-2 rounded-none-none transition font-medium">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 bg-blue-100 text-[#0B1B3D] rounded-none-none flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#0B1B3D]">My Dashboard</h1>
            <p className="text-[#16325C]">Manage your profile and view your saved wishlist projects.</p>
          </div>
        </div>

        <section className="bg-white rounded-none-none shadow-sm border border-[#EAEAEA] p-8">
          <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
          
          {loading ? (
            <div className="text-center text-[#16325C] py-12">Loading your wishlist...</div>
          ) : wishlist.length === 0 ? (
            <div className="text-center text-[#16325C] py-12 bg-gray-50 rounded-none-none border border-dashed border-[#EAEAEA]">
              You haven't saved any projects yet. 
              <br />
              <Link href="/" className="text-[#0B1B3D] font-semibold mt-2 inline-block hover:underline">Explore Projects</Link>
            </div>
          ) : (
            <div className="mt-8">
              {/* Reuse ProjectGrid for the wishlist! */}
              <ProjectGrid initialProjects={wishlist} />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProjectGrid from "@/components/ProjectGrid";
import { LogOut, User, Settings, Bookmark, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"wishlist" | "settings">("wishlist");
  const [userProfile, setUserProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchDashboardData() {
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
        
        // Simulating profile fetch since we don't have a direct /api/user/me route yet
        // A real implementation would fetch user details here.
      } catch (error) {
        console.error("Failed to load dashboard", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <header className="bg-[#111] border-b border-[#333] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <div className="font-playfair font-bold text-2xl tracking-tight text-[#D8C494]">
            Client Portal
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-[#888] hover:text-[#D8C494] transition">
              Back to Site
            </Link>
            <div className="h-4 w-px bg-[#333]"></div>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 text-sm text-[#888] hover:text-red-400 transition font-medium"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12 animate-fade-in-up">
        <div className="flex items-center gap-6 mb-12">
          <div className="w-20 h-20 bg-[#111] border border-[#333] text-[#D8C494] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(216,196,148,0.1)]">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-4xl font-playfair font-medium text-white">Welcome Back</h1>
            <p className="text-[#888] mt-2 font-light tracking-wide">Manage your saved projects and account settings.</p>
          </div>
        </div>

        <div className="flex gap-4 mb-8 border-b border-[#333] pb-4">
          <button 
            onClick={() => setActiveTab("wishlist")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === "wishlist" 
                ? "bg-[#D8C494] text-black shadow-[0_0_15px_rgba(216,196,148,0.3)]" 
                : "bg-[#111] text-[#888] hover:text-white border border-[#333]"
            }`}
          >
            <Bookmark className="w-4 h-4" /> My Wishlist
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === "settings" 
                ? "bg-[#D8C494] text-black shadow-[0_0_15px_rgba(216,196,148,0.3)]" 
                : "bg-[#111] text-[#888] hover:text-white border border-[#333]"
            }`}
          >
            <Settings className="w-4 h-4" /> Account Settings
          </button>
        </div>

        {activeTab === "wishlist" && (
          <section className="bg-[#111] rounded-2xl border border-[#333] p-8 shadow-2xl">
            {loading ? (
              <div className="text-center text-[#666] py-20 font-medium">Loading your collections...</div>
            ) : wishlist.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-[#222] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#333]">
                  <Bookmark className="w-6 h-6 text-[#555]" />
                </div>
                <h3 className="text-xl font-playfair font-medium text-white mb-2">Your wishlist is empty</h3>
                <p className="text-[#666] mb-6">Discover our portfolio and save projects that inspire you.</p>
                <Link 
                  href="/" 
                  className="bg-[#D8C494] text-black px-8 py-3 rounded-full text-sm font-semibold inline-flex items-center hover:bg-[#c2ae7c] transition shadow-[0_0_15px_rgba(216,196,148,0.2)]"
                >
                  Explore Projects
                </Link>
              </div>
            ) : (
              <div className="mt-4">
                <ProjectGrid initialProjects={wishlist} />
              </div>
            )}
          </section>
        )}

        {activeTab === "settings" && (
          <section className="bg-[#111] rounded-2xl border border-[#333] p-8 shadow-2xl max-w-3xl">
            <h2 className="text-2xl font-playfair font-medium mb-8 text-white border-b border-[#333] pb-4">Profile Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Display Name</label>
                <input 
                  type="text" 
                  disabled
                  placeholder="Your Name"
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-[#666] focus:outline-none transition cursor-not-allowed"
                  defaultValue="Registered Client"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Email Address</label>
                <input 
                  type="email" 
                  disabled
                  placeholder="your@email.com"
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-[#666] focus:outline-none transition cursor-not-allowed"
                  defaultValue="Account Email"
                />
              </div>

              <div className="pt-6 mt-6 border-t border-[#333]">
                <h3 className="text-lg font-playfair font-medium text-white mb-4">Project Status</h3>
                <div className="bg-[#0a0a0a] border border-[#333] rounded-xl p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-900/20 text-green-400 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-lg">Onboarding Complete</h4>
                    <p className="text-[#666] text-sm mt-1 leading-relaxed">
                      Your account is active. If you have been assigned a project by our team, it will appear here or you will receive direct communications.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

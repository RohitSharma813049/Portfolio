"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Suspense } from "react";

function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        if (data.role === "admin") {
          router.push("/admin/projects");
        } else {
          router.push(redirectUrl || "/dashboard");
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err: any) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#111]">
      {/* Left Info Section */}
      <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center relative overflow-hidden bg-[#111]">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#D8C494] opacity-5 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 animate-fade-in-up">
          <Link href="/" className="inline-block text-[#D8C494] font-bold tracking-widest text-sm uppercase mb-12 hover:opacity-80 transition-opacity">
            &larr; Back to Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-playfair font-medium text-white mb-6 leading-tight">
            Welcome <span className="text-[#D8C494] italic">Back</span>.
          </h1>
          <p className="text-lg text-[#999] font-light max-w-md leading-relaxed">
            Log in to manage your saved projects, access premium resources, and view your active deployments.
          </p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 bg-[#0a0a0a] border-l border-[#222] p-8 md:p-24 flex flex-col justify-center animate-fade-in-up shadow-2xl">
        <div className="w-full max-w-sm mx-auto">
          <h2 className="text-3xl font-playfair font-medium text-white mb-8">Log In</h2>
          
          {error && <div className="bg-red-900/20 border border-red-900 text-red-400 p-4 rounded-xl mb-8 text-sm">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Email Address</label>
              <input 
                type="email" 
                required 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-[#111] border border-[#333] text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#D8C494] transition-colors placeholder-[#444]"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Password</label>
              <input 
                type="password" 
                required 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-[#111] border border-[#333] text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#D8C494] transition-colors placeholder-[#444]"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#16276B] text-white font-semibold py-4 rounded-full mt-6 hover:bg-[#111b4a] transition-colors shadow-[0_0_20px_rgba(22,39,107,0.3)] disabled:opacity-50 disabled:shadow-none hover:scale-[1.02] duration-300"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
          
          <p className="text-center text-sm text-[#777] mt-8">
            Don't have an account? <Link href="/signup" className="text-[#D8C494] font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#111]"><p className="text-[#D8C494]">Loading...</p></div>}>
      <LoginForm />
    </Suspense>
  );
}

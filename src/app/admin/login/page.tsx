"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (json.success) {
        // Redirect to admin dashboard
        router.push("/admin/projects");
        router.refresh();
      } else {
        setError(json.error || "Invalid credentials");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-8">
      <div className="bg-white max-w-md w-full p-10 rounded-[24px] border border-[#EAEAEA] shadow-sm text-center">
        <div className="w-16 h-16 bg-[#f4f4f4] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-[#111111]" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Admin Access</h1>
        <p className="text-[#666666] mb-8">Sign in to manage your portfolio</p>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#111111]">Email Address</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#EAEAEA] focus:outline-none focus:border-[#111111] transition"
              placeholder="admin@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#111111]">Password</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#EAEAEA] focus:outline-none focus:border-[#111111] transition"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#111111] text-white py-3 rounded-xl font-medium hover:bg-[#333] transition shadow-soft disabled:opacity-50 mt-4"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

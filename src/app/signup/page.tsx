"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "", notes: "", projectId: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/client/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        router.push("/dashboard");
      } else {
        setError(data.error || "Signup failed");
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
            Join <span className="text-[#D8C494] italic">Sahab Portfolio</span>.
          </h1>
          <p className="text-lg text-[#999] font-light max-w-md leading-relaxed">
            Create an account to save projects, access exclusive resources, and manage your dashboard deployments.
          </p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 bg-[#0a0a0a] border-l border-[#222] p-8 md:p-24 flex flex-col justify-center animate-fade-in-up shadow-2xl">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-3xl font-playfair font-medium text-white mb-8">Create Account</h2>
          
          {error && <div className="bg-red-900/20 border border-red-900 text-red-400 p-4 rounded-xl mb-8 text-sm">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Full Name</label>
              <input 
                type="text" 
                required 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[#111] border border-[#333] text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#D8C494] transition-colors placeholder-[#444]"
                placeholder="John Doe"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Mobile (Optional)</label>
                <input 
                  type="tel" 
                  value={formData.mobile}
                  onChange={e => setFormData({...formData, mobile: e.target.value})}
                  className="w-full bg-[#111] border border-[#333] text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#D8C494] transition-colors placeholder-[#444]"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Notes</label>
              <textarea 
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                className="w-full bg-[#111] border border-[#333] text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#D8C494] transition-colors placeholder-[#444]"
                placeholder="Any additional notes or requirements"
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Project ID (Optional)</label>
                <input 
                  type="text" 
                  value={formData.projectId}
                  onChange={e => setFormData({...formData, projectId: e.target.value})}
                  className="w-full bg-[#111] border border-[#333] text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#D8C494] transition-colors placeholder-[#444]"
                  placeholder="Specific ID if known"
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
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#D8C494] text-black font-semibold py-4 rounded-full mt-6 hover:bg-[#c2ae7c] transition-colors shadow-[0_0_20px_rgba(216,196,148,0.3)] disabled:opacity-50 disabled:shadow-none hover:scale-[1.02] duration-300"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          
          <p className="text-center text-sm text-[#777] mt-8">
            Already have an account? <Link href="/login" className="text-[#D8C494] font-semibold hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

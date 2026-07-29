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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-none-none shadow-soft p-8 border border-[#EAEAEA]">
        <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
        <p className="text-[#4169E1] text-center mb-8">Join to save projects and access your dashboard</p>
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-none-none mb-6 text-sm font-medium">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Full Name</label>
            <input 
              type="text" 
              required 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full border border-[#EAEAEA] rounded-none-none px-4 py-3 focus:outline-none focus:border-[#4169E1] transition"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Email Address</label>
            <input 
              type="email" 
              required 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full border border-[#EAEAEA] rounded-none-none px-4 py-3 focus:outline-none focus:border-[#4169E1] transition"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Mobile Number (Optional)</label>
            <input 
              type="tel" 
              value={formData.mobile}
              onChange={e => setFormData({...formData, mobile: e.target.value})}
              className="w-full border border-[#EAEAEA] rounded-none-none px-4 py-3 focus:outline-none focus:border-[#4169E1] transition"
              placeholder="+1 234 567 8900"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Notes</label>
            <textarea 
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              className="w-full border border-[#EAEAEA] rounded-none-none px-4 py-3 focus:outline-none focus:border-[#4169E1] transition"
              placeholder="Any additional notes"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Project ID (Optional)</label>
            <input 
              type="text" 
              value={formData.projectId}
              onChange={e => setFormData({...formData, projectId: e.target.value})}
              className="w-full border border-[#EAEAEA] rounded-none-none px-4 py-3 focus:outline-none focus:border-[#4169E1] transition"
              placeholder="Enter specific Project ID if known"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input 
              type="password" 
              required 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full border border-[#EAEAEA] rounded-none-none px-4 py-3 focus:outline-none focus:border-[#4169E1] transition"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#4169E1] text-white font-bold py-3 rounded-none-none hover:bg-[#1E3A8A] transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        
        <p className="text-center text-sm text-[#4169E1] mt-6">
          Already have an account? <Link href="/login" className="text-[#1E3A8A] font-semibold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}

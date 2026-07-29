"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Suspense } from "react";

function AdminLoginForm() {
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
          router.push(redirectUrl || "/admin/projects");
        } else {
          setError("Access denied. Admin privileges required.");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-none-none shadow-soft p-8 border border-[#EAEAEA]">
        <h1 className="text-3xl font-bold text-center mb-2">Admin Login</h1>
        <p className="text-[#4169E1] text-center mb-8">Access the admin dashboard</p>
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-none-none mb-6 text-sm font-medium">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Email Address</label>
            <input 
              type="email" 
              required 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full border border-[#EAEAEA] rounded-none-none px-4 py-3 focus:outline-none focus:border-[#4169E1] transition"
              placeholder="admin@example.com"
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
            {loading ? "Logging in..." : "Log In as Admin"}
          </button>
        </form>
        
        <p className="text-center text-sm text-[#4169E1] mt-6">
          <Link href="/login" className="text-[#1E3A8A] font-semibold hover:underline">Return to User Login</Link>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><p>Loading...</p></div>}>
      <AdminLoginForm />
    </Suspense>
  );
}

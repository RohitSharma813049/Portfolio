"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Tag, Save } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";

export default function NewCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setCreating(true);
    setError("");

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), coverImage }),
      });
      const json = await res.json();

      if (json.success) {
        router.push("/admin/categories");
        router.refresh();
      } else {
        setError(json.error || "Failed to create category");
      }
    } catch (err) {
      setError("Failed to create category");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto animate-fade-in-up">
      <div className="mb-6">
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-[#111] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Categories
        </Link>
        <h1 className="text-3xl font-playfair font-medium flex items-center gap-3 text-[#111]">
          <Tag className="w-8 h-8 text-[#D8C494]" /> Create New Category
        </h1>
        <p className="text-[#666] text-sm mt-1 font-light tracking-wide">
          Add a new project category to display on your portfolio workspace
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-[#EAEAEA] rounded-2xl shadow-sm p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-[#111] uppercase tracking-wider mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tour & Travel, E-Commerce, Healthcare"
              className="w-full px-4 py-3 bg-white rounded-xl border border-[#EAEAEA] focus:outline-none focus:border-black text-[#111] transition placeholder-[#999]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111] uppercase tracking-wider mb-2">
              Cover Image
            </label>
            <ImageUploader onUpload={setCoverImage} defaultImage={coverImage} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#EAEAEA]">
            <Link
              href="/admin/categories"
              className="px-6 py-3 rounded-full text-sm font-semibold text-[#666] hover:text-[#111] transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={creating}
              className="bg-[#D8C494] text-black px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#c2ae7c] transition shadow-sm disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {creating ? "Saving..." : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

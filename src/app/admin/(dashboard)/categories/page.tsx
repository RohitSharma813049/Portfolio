"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, Tag, Edit2, X, Save } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Create state
  const [name, setName] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCoverImage, setEditCoverImage] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      if (json.success) {
        setCategories(json.data);
      }
    } catch (error) {
      console.error("Failed to load categories", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setCreating(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), coverImage }),
      });
      const json = await res.json();

      if (json.success) {
        setName("");
        setCoverImage("");
        setShowCreateForm(false);
        fetchCategories();
      } else {
        alert(json.error || "Failed to create category");
      }
    } catch (error) {
      alert("Failed to create category");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (cat: any) => {
    setEditingId(cat._id);
    setEditName(cat.name);
    setEditCoverImage(cat.coverImage || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditCoverImage("");
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return;

    setSavingEdit(true);
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim(), coverImage: editCoverImage }),
      });
      const json = await res.json();

      if (json.success) {
        setEditingId(null);
        fetchCategories();
      } else {
        alert(json.error || "Failed to update category");
      }
    } catch (error) {
      alert("Failed to update category");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (json.success) {
        fetchCategories();
      } else {
        alert("Failed to delete category");
      }
    } catch (error) {
      alert("Failed to delete category");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-playfair font-medium flex items-center gap-3 text-[#111]">
            <Tag className="w-8 h-8 text-[#D8C494]" /> Categories
          </h1>
          <p className="text-[#666] text-sm mt-1 font-light tracking-wide">Manage software project categories</p>
        </div>
        {!showCreateForm && (
          <Link
            href="/admin/categories/new"
            className="bg-[#D8C494] text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#c2ae7c] transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Category
          </Link>
        )}
      </div>

      {showCreateForm && (
        <div className="bg-white border border-[#EAEAEA] rounded-2xl shadow-sm overflow-hidden mb-8 p-5 md:p-8 w-full max-w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-playfair font-medium text-2xl text-[#111]">Create New Category</h2>
            <button onClick={() => setShowCreateForm(false)} className="text-[#666] hover:text-[#111] transition">
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleCreate} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-[#111] uppercase tracking-wider mb-2">Category Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Quantum Computing"
                className="w-full px-4 py-3 bg-white rounded-xl border border-[#EAEAEA] focus:outline-none focus:border-black text-[#111] transition placeholder-[#999]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#111] uppercase tracking-wider mb-2">Cover Image</label>
              <ImageUploader onUpload={setCoverImage} defaultImage={coverImage} />
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={creating}
                className="bg-[#D8C494] text-black px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#c2ae7c] transition shadow-sm disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {creating ? "Saving..." : "Save Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-12 text-center text-[#666] shadow-sm">
          No categories found. Create one above!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-white border border-[#EAEAEA] rounded-2xl p-5 flex flex-col justify-between hover:border-[#D8C494] transition-all shadow-sm hover:shadow-md group">
              {editingId === cat._id ? (
                <div className="space-y-4 animate-fade-in-up">
                  <h3 className="font-playfair font-medium text-lg text-[#111]">Edit Category</h3>
                  <div>
                    <label className="block text-xs font-semibold text-[#111] uppercase tracking-wider mb-2">Category Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white rounded-xl border border-[#EAEAEA] focus:outline-none focus:border-black text-[#111] text-sm transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#111] uppercase tracking-wider mb-2">Cover Image</label>
                    <ImageUploader onUpload={setEditCoverImage} defaultImage={editCoverImage} />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 rounded-full text-xs font-semibold text-[#666] hover:text-[#111] transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(cat._id)}
                      disabled={savingEdit}
                      className="bg-[#D8C494] text-black px-5 py-2 rounded-full text-xs font-semibold hover:bg-[#c2ae7c] transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" /> {savingEdit ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    {/* Card Cover Image */}
                    <div className="w-full h-44 rounded-xl overflow-hidden bg-gray-100 border border-[#EAEAEA] mb-4 relative">
                      {cat.coverImage ? (
                        <img src={cat.coverImage} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#999] bg-gradient-to-br from-gray-50 to-gray-200">
                          <Tag className="w-10 h-10 opacity-40 text-[#D8C494]" />
                        </div>
                      )}
                    </div>

                    {/* Category Title & Info */}
                    <h3 className="font-playfair font-medium text-[#111] text-xl mb-1 line-clamp-1">{cat.name}</h3>
                    <p className="text-[11px] text-[#666] uppercase tracking-wider mb-4">
                      Created {new Date(cat.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EAEAEA] mt-2">
                    <button
                      onClick={() => startEdit(cat)}
                      className="p-2.5 text-[#666] hover:text-[#111] bg-gray-100 hover:bg-gray-200 rounded-full transition cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="p-2.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-full transition cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

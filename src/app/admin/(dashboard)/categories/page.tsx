"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Tag } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

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
        body: JSON.stringify({ name: name.trim() }),
      });
      const json = await res.json();
      
      if (json.success) {
        setName("");
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
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-[#0B1B3D]">
            <Tag className="w-6 h-6" /> Categories
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage project categories</p>
        </div>
      </div>

      <div className="bg-white border border-[#EAEAEA] rounded-none-none shadow-sm overflow-hidden mb-8">
        <div className="p-6 bg-[#f8f9fa] border-b border-[#EAEAEA]">
          <h2 className="font-bold text-lg mb-4">Add New Category</h2>
          <form onSubmit={handleCreate} className="flex gap-4">
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Web Development"
              className="flex-1 px-4 py-2 rounded-none-none border border-[#EAEAEA] focus:outline-none focus:border-[#111111] transition"
              required
            />
            <button 
              type="submit" 
              disabled={creating}
              className="bg-[#1E3A8A] text-white px-6 py-2 rounded-none-none text-sm font-medium hover:bg-[#152960] transition shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> {creating ? "Adding..." : "Add"}
            </button>
          </form>
        </div>

        <div className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-gray-500 border-t border-[#EAEAEA]">
              No categories found. Create one above!
            </div>
          ) : (
            <ul className="divide-y divide-[#EAEAEA]">
              {categories.map((cat) => (
                <li key={cat._id} className="flex items-center justify-between p-4 hover:bg-[#fafafa] transition">
                  <span className="font-medium text-[#16325C]">{cat.name}</span>
                  <button 
                    onClick={() => handleDelete(cat._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-none transition"
                    title="Delete Category"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

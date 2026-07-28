"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchProjects() {
    try {
      setLoading(true);
      const res = await fetch("/api/projects");
      const json = await res.json();
      if (json.success) {
        setProjects(json.data);
      }
    } catch (error) {
      console.error("Failed to load projects", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project? This cannot be undone.")) return;
    
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        fetchProjects(); // Refresh the list
      } else {
        alert("Failed to delete: " + json.error);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting the project.");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm text-[#666666] mt-1">Manage your portfolio software projects.</p>
        </div>
        <Link href="/admin/projects/new" className="flex items-center gap-2 bg-[#111111] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#333] transition shadow-soft">
          <Plus className="w-4 h-4" /> Add Project
        </Link>
      </div>

      <div className="bg-white border border-[#EAEAEA] rounded-[20px] shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f8f9fa] border-b border-[#EAEAEA]">
            <tr>
              <th className="px-6 py-4 font-semibold text-[#666666]">Project Name</th>
              <th className="px-6 py-4 font-semibold text-[#666666]">Status</th>
              <th className="px-6 py-4 font-semibold text-[#666666]">Categories</th>
              <th className="px-6 py-4 font-semibold text-[#666666] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-[#666666]">Loading projects...</td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-[#666666]">No projects found. Create one to get started!</td>
              </tr>
            ) : (
              projects.map((project: any) => (
                <tr key={project._id} className="border-b border-[#EAEAEA] hover:bg-[#fafafa] transition">
                  <td className="px-6 py-4 font-medium text-[#111111]">{project.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${project.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#666666]">{project.categories?.join(', ') || '-'}</td>
                  <td className="px-6 py-4 flex items-center justify-end gap-3">
                    <Link href={`/admin/projects/${project._id}/edit`} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(project._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

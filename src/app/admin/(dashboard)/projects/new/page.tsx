"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2, UploadCloud } from "lucide-react";

export default function NewProject() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    fullDescription: "",
    status: "DRAFT",
    categories: "",
    technologies: "",
    industries: "",
    livePreviewUrl: "",
    bookDemoUrl: "",
    requestCostUrl: "",
    enquiryUrl: "",
    videoUrl: "",
    featureImage: "",
    bannerImage: "",
  });

  const [availableCategories, setAvailableCategories] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const json = await res.json();
        if (json.success) {
          setAvailableCategories(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories");
      }
    }
    fetchCategories();
  }, []);
  
  const [features, setFeatures] = useState([{ title: "", description: "" }]);
  const [panels, setPanels] = useState([{ name: "", description: "", image: "" }]);
  const [screenshots, setScreenshots] = useState([{ url: "", type: "DESKTOP" }]);
  const [credentials, setCredentials] = useState([{ role: "", email: "", password: "" }]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (setter: any, array: any, index: number, field: string, value: string) => {
    const newArray = [...array];
    newArray[index] = { ...newArray[index], [field]: value };
    setter(newArray);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, isArray: boolean = false, index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      
      if (json.success) {
        if (isArray && index !== undefined) {
            if (fieldName === "panels") {
               handleArrayChange(setPanels, panels, index, "image", json.url);
            } else {
               handleArrayChange(setScreenshots, screenshots, index, "url", json.url);
            }
        } else {
            setFormData(prev => ({ ...prev, [fieldName]: json.url }));
        }
      } else {
        alert("Upload failed: " + json.error);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  const addArrayItem = (setter: any, array: any, emptyItem: any) => {
    setter([...array, emptyItem]);
  };

  const removeArrayItem = (setter: any, array: any, index: number) => {
    const newArray = [...array];
    newArray.splice(index, 1);
    setter(newArray);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        categories: formData.categories ? formData.categories.split(",").map(c => c.trim()).filter(Boolean) : [],
        technologies: formData.technologies ? formData.technologies.split(",").map(c => c.trim()) : [],
        industries: formData.industries ? formData.industries.split(",").map(c => c.trim()) : [],
        features: features.filter(f => f.title.trim() !== ""), 
        panels: panels.filter(p => p.name.trim() !== ""),
        screenshots: screenshots.filter(s => s.url.trim() !== ""),
        credentials: credentials.filter(c => c.role.trim() !== "" && c.email.trim() !== ""),
      };

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        router.push("/admin/projects");
      } else {
        alert("Error: " + json.error);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/projects" className="text-[#16325C] hover:text-[#0B1B3D] transition">&larr; Back</Link>
        <h1 className="text-2xl font-bold">Add New Project</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#EAEAEA] rounded-none-none shadow-sm overflow-hidden">
        
        {/* Basic Information */}
        <div className="p-8 space-y-6">
          <h2 className="font-bold text-lg border-b border-[#EAEAEA] pb-2">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0B1B3D]">Project Name *</label>
              <input 
                required
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-none-none border border-[#EAEAEA] focus:outline-none focus:border-[#111111] transition"
                placeholder="e.g., Travel Booking System"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0B1B3D]">Status</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-none-none border border-[#EAEAEA] focus:outline-none focus:border-[#111111] transition bg-white"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0B1B3D]">Feature Image</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  name="featureImage"
                  value={formData.featureImage}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 rounded-none-none border border-[#EAEAEA] focus:outline-none focus:border-[#111111] transition"
                  placeholder="Image URL or upload..."
                />
                <label className="flex items-center justify-center bg-[#f4f4f4] hover:bg-[#eaeaea] text-[#0B1B3D] px-4 py-3 rounded-none-none cursor-pointer transition">
                  <UploadCloud className="w-5 h-5" />
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "featureImage")} />
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0B1B3D]">Live Preview URL</label>
              <input 
                type="text" 
                name="livePreviewUrl"
                value={formData.livePreviewUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-none-none border border-[#EAEAEA] focus:outline-none focus:border-[#111111] transition"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0B1B3D]">Video URL (YouTube/Vimeo)</label>
              <input 
                type="text" 
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-none-none border border-[#EAEAEA] focus:outline-none focus:border-[#111111] transition"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#0B1B3D]">Short Description *</label>
            <textarea 
              required
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-3 rounded-none-none border border-[#EAEAEA] focus:outline-none focus:border-[#111111] transition"
              placeholder="A brief overview of the project..."
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#0B1B3D]">Full Description</label>
            <textarea 
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-none-none border border-[#EAEAEA] focus:outline-none focus:border-[#111111] transition"
              placeholder="Detailed description shown on the project page..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0B1B3D] mb-2 block">Category</label>
              <select
                value={formData.categories}
                onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                className="w-full px-4 py-3 rounded-none-none border border-[#EAEAEA] focus:outline-none focus:border-[#111111] transition"
              >
                <option value="">Select a category</option>
                {availableCategories.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0B1B3D]">Technologies</label>
              <input 
                type="text" 
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-none-none border border-[#EAEAEA] focus:outline-none focus:border-[#111111] transition"
                placeholder="Next.js, Node, etc."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0B1B3D]">Industries</label>
              <input 
                type="text" 
                name="industries"
                value={formData.industries}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-none-none border border-[#EAEAEA] focus:outline-none focus:border-[#111111] transition"
                placeholder="Travel, Healthcare"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Repeater: Features */}
        <div className="p-8 border-t border-[#EAEAEA] bg-[#fafafa]">
          <div className="flex justify-between items-center border-b border-[#EAEAEA] pb-2 mb-6">
             <h2 className="font-bold text-lg">Features</h2>
             <button type="button" onClick={() => addArrayItem(setFeatures, features, {title: "", description: ""})} className="text-sm font-medium flex items-center gap-1 text-[#0B1B3D] hover:text-blue-800">
               <Plus className="w-4 h-4" /> Add Feature
             </button>
          </div>
          
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-4 items-start bg-white p-4 rounded-none-none border border-[#EAEAEA]">
                <div className="flex-1 space-y-4">
                  <input 
                    type="text" 
                    value={feature.title}
                    onChange={(e) => handleArrayChange(setFeatures, features, index, "title", e.target.value)}
                    className="w-full px-4 py-2 rounded-none-none border border-[#EAEAEA] focus:outline-none focus:border-[#111111] transition text-sm"
                    placeholder="Feature Title"
                  />
                  <input 
                    type="text" 
                    value={feature.description}
                    onChange={(e) => handleArrayChange(setFeatures, features, index, "description", e.target.value)}
                    className="w-full px-4 py-2 rounded-none-none border border-[#EAEAEA] focus:outline-none focus:border-[#111111] transition text-sm"
                    placeholder="Feature Description (Optional)"
                  />
                </div>
                <button type="button" onClick={() => removeArrayItem(setFeatures, features, index)} className="p-2 text-red-500 hover:bg-red-50 rounded-none-none transition">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Dynamic Repeater: Panels */}
        <div className="p-8 border-t border-[#EAEAEA] bg-white">
          <div className="flex justify-between items-center border-b border-[#EAEAEA] pb-2 mb-6">
             <h2 className="font-bold text-lg">Panels</h2>
             <button type="button" onClick={() => addArrayItem(setPanels, panels, {name: "", description: "", image: ""})} className="text-sm font-medium flex items-center gap-1 text-[#0B1B3D] hover:text-blue-800">
               <Plus className="w-4 h-4" /> Add Panel
             </button>
          </div>
          
          <div className="space-y-4">
            {panels.map((panel, index) => (
              <div key={index} className="flex gap-4 items-start bg-[#f8f9fa] p-4 rounded-none-none border border-[#EAEAEA]">
                <div className="flex-1 space-y-4">
                  <input 
                    type="text" 
                    value={panel.name}
                    onChange={(e) => handleArrayChange(setPanels, panels, index, "name", e.target.value)}
                    className="w-full px-4 py-2 rounded-none-none border border-[#EAEAEA] focus:outline-none focus:border-[#111111] transition text-sm"
                    placeholder="Panel Name (e.g., Admin Panel)"
                  />
                  <input 
                    type="text" 
                    value={panel.description}
                    onChange={(e) => handleArrayChange(setPanels, panels, index, "description", e.target.value)}
                    className="w-full px-4 py-2 rounded-none-none border border-[#EAEAEA] focus:outline-none focus:border-[#111111] transition text-sm"
                    placeholder="Panel Description (Optional)"
                  />
                  <div className="flex gap-2 w-full">
                    <input 
                      type="text" 
                      value={panel.image || ""}
                      onChange={(e) => handleArrayChange(setPanels, panels, index, "image", e.target.value)}
                      className="flex-1 px-4 py-2 rounded-none-none border border-[#EAEAEA] focus:outline-none focus:border-[#111111] transition text-sm"
                      placeholder="Panel Image URL or upload..."
                    />
                    <label className="flex items-center justify-center bg-[#f4f4f4] hover:bg-[#eaeaea] text-[#0B1B3D] px-3 py-2 rounded-none-none cursor-pointer transition">
                      <UploadCloud className="w-4 h-4" />
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "panels", true, index)} />
                    </label>
                  </div>
                </div>
                <button type="button" onClick={() => removeArrayItem(setPanels, panels, index)} className="p-2 text-red-500 hover:bg-red-50 rounded-none-none transition">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Repeater: Screenshots */}
        <div className="p-8 border-t border-[#EAEAEA] bg-[#fafafa]">
          <div className="flex justify-between items-center border-b border-[#EAEAEA] pb-2 mb-6">
             <h2 className="font-bold text-lg">Screenshots</h2>
             <button type="button" onClick={() => addArrayItem(setScreenshots, screenshots, {url: "", type: "DESKTOP"})} className="text-sm font-medium flex items-center gap-1 text-[#0B1B3D] hover:text-blue-800">
               <Plus className="w-4 h-4" /> Add Screenshot
             </button>
          </div>
          
          <div className="space-y-4">
            {screenshots.map((shot, index) => (
              <div key={index} className="flex gap-4 items-center bg-white p-4 rounded-none-none border border-[#EAEAEA]">
                <select 
                  value={shot.type}
                  onChange={(e) => handleArrayChange(setScreenshots, screenshots, index, "type", e.target.value)}
                  className="px-4 py-2 rounded-none-none border border-[#EAEAEA] focus:outline-none focus:border-[#111111] transition text-sm bg-white"
                >
                  <option value="DESKTOP">Desktop</option>
                  <option value="MOBILE">Mobile</option>
                  <option value="TABLET">Tablet</option>
                </select>
                <div className="flex-1 flex gap-2">
                  <input 
                    type="text" 
                    value={shot.url}
                    onChange={(e) => handleArrayChange(setScreenshots, screenshots, index, "url", e.target.value)}
                    className="flex-1 px-4 py-2 rounded-none-none border border-[#EAEAEA] focus:outline-none focus:border-[#111111] transition text-sm"
                    placeholder="Image URL or upload..."
                  />
                  <label className="flex items-center justify-center bg-[#f4f4f4] hover:bg-[#eaeaea] text-[#0B1B3D] px-3 py-2 rounded-none-none cursor-pointer transition">
                    <UploadCloud className="w-4 h-4" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "screenshots", true, index)} />
                  </label>
                </div>
                <button type="button" onClick={() => removeArrayItem(setScreenshots, screenshots, index)} className="p-2 text-red-500 hover:bg-red-50 rounded-none-none transition">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 border-t border-[#EAEAEA] flex justify-end bg-white">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#111111] text-white px-8 py-3 rounded-none-none text-sm font-medium hover:bg-[#333] transition shadow-soft disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Project"}
          </button>
        </div>
      </form>
    </div>
  );
}

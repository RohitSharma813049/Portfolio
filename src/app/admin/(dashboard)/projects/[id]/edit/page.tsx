"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";

export default function EditProject() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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
    enquiryUrl: "",
    requestCostUrl: "",
    videoUrl: "",
    featureImage: "",
    bannerImage: "",
  });
  
  const [features, setFeatures] = useState([{ title: "", description: "" }]);
  const [panels, setPanels] = useState([{ name: "", description: "", image: "" }]);
  const [screenshots, setScreenshots] = useState([{ url: "", type: "DESKTOP" }]);
  const [credentials, setCredentials] = useState([{ role: "", email: "", password: "" }]);

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

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        const json = await res.json();
        
        if (json.success) {
          const project = json.data;
          
          setFormData({
            name: project.name || "",
            shortDescription: project.shortDescription || "",
            fullDescription: project.fullDescription || "",
            status: project.status || "DRAFT",
            categories: project.categories?.join(", ") || "",
            technologies: project.technologies?.join(", ") || "",
            industries: project.industries?.join(", ") || "",
            livePreviewUrl: project.livePreviewUrl || "",
            bookDemoUrl: project.bookDemoUrl || "",
            enquiryUrl: project.enquiryUrl || "",
            requestCostUrl: project.requestCostUrl || "",
            videoUrl: project.videoUrl || "",
            featureImage: project.featureImage || "",
            bannerImage: project.bannerImage || "",
          });
          
          if (project.features?.length > 0) setFeatures(project.features);
          if (project.panels?.length > 0) setPanels(project.panels);
          if (project.screenshots?.length > 0) setScreenshots(project.screenshots);
          if (project.credentials?.length > 0) setCredentials(project.credentials);
          
        } else {
          alert("Failed to load project: " + json.error);
        }
      } catch (error) {
        console.error(error);
        alert("Failed to load project");
      } finally {
        setFetching(false);
      }
    }
    
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (setter: any, array: any, index: number, field: string, value: string) => {
    const newArray = [...array];
    newArray[index] = { ...newArray[index], [field]: value };
    setter(newArray);
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

      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
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
      alert("Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-8 text-center text-[#16325C]">Loading project data...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/projects" className="text-[#16325C] hover:text-[#0B1B3D] transition">&larr; Back</Link>
        <h1 className="text-2xl font-bold">Edit Project</h1>
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
                <option value="BUY">Buy</option>
                <option value="CUSTOMIZE">Customize</option>
                <option value="PUBLISHED">Published</option>
                <option value="UPCOMING">Upcoming</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0B1B3D]">Feature Image</label>
              <ImageUploader 
                onUpload={(url) => setFormData(prev => ({ ...prev, featureImage: url }))} 
                defaultImage={formData.featureImage} 
              />
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
                  <div className="w-full">
                    <label className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-2 block">Panel Image</label>
                    <ImageUploader 
                      onUpload={(url) => handleArrayChange(setPanels, panels, index, "image", url)} 
                      defaultImage={panel.image} 
                    />
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
                <div className="flex-1 w-full">
                  <label className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-2 block">Screenshot Image</label>
                  <ImageUploader 
                    onUpload={(url) => handleArrayChange(setScreenshots, screenshots, index, "url", url)} 
                    defaultImage={shot.url} 
                  />
                </div>
                <button type="button" onClick={() => removeArrayItem(setScreenshots, screenshots, index)} className="p-2 text-red-500 hover:bg-red-50 rounded-none-none transition">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-[#EAEAEA] my-8" />
        
        <div className="p-8 border-t border-[#EAEAEA] bg-[#fafafa]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-[#0B1B3D]">Demo Credentials</h3>
            <button 
              type="button" 
              onClick={() => setCredentials([...credentials, { role: "", email: "", password: "" }])}
              className="text-[#1E3A8A] text-sm font-medium flex items-center gap-1 hover:underline"
            >
              <Plus className="w-4 h-4" /> Add Credential
            </button>
          </div>
          
          <div className="space-y-4">
            {credentials.map((cred, index) => (
              <div key={index} className="flex gap-4 items-start bg-white p-4 border border-[#EAEAEA] rounded-none-none">
                <input 
                  type="text" 
                  placeholder="Role (e.g. Admin)" 
                  value={cred.role}
                  onChange={(e) => {
                    const newCreds = [...credentials];
                    newCreds[index].role = e.target.value;
                    setCredentials(newCreds);
                  }}
                  className="flex-1 px-4 py-2 rounded-none-none border border-[#EAEAEA] text-sm"
                />
                <input 
                  type="text" 
                  placeholder="Email/Username" 
                  value={cred.email}
                  onChange={(e) => {
                    const newCreds = [...credentials];
                    newCreds[index].email = e.target.value;
                    setCredentials(newCreds);
                  }}
                  className="flex-1 px-4 py-2 rounded-none-none border border-[#EAEAEA] text-sm"
                />
                <input 
                  type="text" 
                  placeholder="Password" 
                  value={cred.password}
                  onChange={(e) => {
                    const newCreds = [...credentials];
                    newCreds[index].password = e.target.value;
                    setCredentials(newCreds);
                  }}
                  className="flex-1 px-4 py-2 rounded-none-none border border-[#EAEAEA] text-sm"
                />
                <button 
                  type="button"
                  onClick={() => {
                    const newCreds = credentials.filter((_, i) => i !== index);
                    setCredentials(newCreds.length ? newCreds : [{ role: "", email: "", password: "" }]);
                  }}
                  className="p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
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
            {loading ? "Updating..." : "Update Project"}
          </button>
        </div>
      </form>
    </div>
  );
}

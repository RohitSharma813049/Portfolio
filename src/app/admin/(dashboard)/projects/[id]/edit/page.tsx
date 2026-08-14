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

  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    fullDescription: "",
    status: "DRAFT",
    purchaseOption: "BOTH",
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
    platform: "Web",
    isWhiteLabel: false,
    hasSubscription: false,
    hasSourceCode: false,
    isCustomizable: true,
  });

  const [quickInfo, setQuickInfo] = useState([{ label: "", value: "" }]);
  const [features, setFeatures] = useState([{ title: "", description: "" }]);
  const [panels, setPanels] = useState([{ name: "", description: "", image: "" }]);
  const [screenshots, setScreenshots] = useState([{ url: "", type: "DESKTOP" }]);
  const [credentials, setCredentials] = useState([{ role: "", email: "", password: "" }]);

  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [selectedSimilarProjects, setSelectedSimilarProjects] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCategoriesAndProjects() {
      try {
        const catRes = await fetch("/api/categories");
        const catJson = await catRes.json();
        if (catJson.success) setAvailableCategories(catJson.data);

        const projRes = await fetch("/api/projects");
        const projJson = await projRes.json();
        if (projJson.success) setAllProjects(projJson.data);
      } catch (error) {
        console.error("Failed to fetch initial data");
      }
    }
    fetchCategoriesAndProjects();
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
            purchaseOption: project.purchaseOption || "BOTH",
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
            platform: project.platform || "Web",
            isWhiteLabel: !!project.isWhiteLabel,
            hasSubscription: !!project.hasSubscription,
            hasSourceCode: !!project.hasSourceCode,
            isCustomizable: project.isCustomizable !== undefined ? !!project.isCustomizable : true,
          });

          if (project.similarProjects && project.similarProjects.length > 0) {
            setSelectedSimilarProjects(
              project.similarProjects.map((sp: any) => (typeof sp === "object" ? sp._id : sp))
            );
          }

          if (project.quickInfo?.length > 0) setQuickInfo(project.quickInfo);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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

  const toggleSimilarProject = (id: string) => {
    setSelectedSimilarProjects((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        categories: formData.categories ? formData.categories.split(",").map((c) => c.trim()).filter(Boolean) : [],
        technologies: formData.technologies ? formData.technologies.split(",").map((c) => c.trim()).filter(Boolean) : [],
        industries: formData.industries ? formData.industries.split(",").map((c) => c.trim()).filter(Boolean) : [],
        similarProjects: selectedSimilarProjects,
        quickInfo: quickInfo.filter((q) => q.label.trim() !== "" && q.value.trim() !== ""),
        features: features.filter((f) => f.title.trim() !== ""),
        panels: panels.filter((p) => p.name.trim() !== ""),
        screenshots: screenshots.filter((s) => s.url.trim() !== ""),
        credentials: credentials.filter((c) => c.role.trim() !== "" && c.email.trim() !== ""),
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
        <Link href="/admin/projects" className="text-[#16325C] hover:text-[#0B1B3D] transition">
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold">Edit Project</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#EAEAEA] rounded-xl shadow-sm overflow-hidden space-y-8">
        {/* Basic Information */}
        <div className="p-8 space-y-6">
          <h2 className="font-bold text-lg border-b border-[#EAEAEA] pb-2">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0B1B3D]">Project Name *</label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111] transition"
                placeholder="e.g., Travel Booking System"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0B1B3D]">Publish Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111] transition bg-white"
              >
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="UPCOMING">Upcoming</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0B1B3D]">Buy / Customise Option</label>
              <select
                name="purchaseOption"
                value={formData.purchaseOption}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111] transition bg-white"
              >
                <option value="BOTH">Buy & Customise (Both Available)</option>
                <option value="BUY">Buy Ready Software Only</option>
                <option value="CUSTOMISE">Customise Only</option>
                <option value="NONE">Enquiry Only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0B1B3D]">Feature Image</label>
              <ImageUploader
                onUpload={(url) => setFormData((prev) => ({ ...prev, featureImage: url }))}
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
                className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111] transition"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0B1B3D]">Book Demo URL</label>
              <input
                type="text"
                name="bookDemoUrl"
                value={formData.bookDemoUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111] transition"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#0B1B3D]">Video URL (YouTube / Vimeo / MP4)</label>
            <input
              type="text"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111] transition"
              placeholder="https://youtube.com/watch?v=... or https://.../video.mp4"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#0B1B3D]">Short Description *</label>
            <textarea
              required
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111] transition"
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
              className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111] transition"
              placeholder="Detailed description shown on the project page..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0B1B3D]">Category</label>
              <select
                value={formData.categories}
                onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111] transition bg-white"
              >
                <option value="">Select a category</option>
                {availableCategories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0B1B3D]">Technologies (comma separated)</label>
              <input
                type="text"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111] transition"
                placeholder="Next.js, Node.js, MongoDB"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0B1B3D]">Industries</label>
              <input
                type="text"
                name="industries"
                value={formData.industries}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111] transition"
                placeholder="Travel, Healthcare"
              />
            </div>
          </div>
        </div>

        {/* Quick Information (Admin Dynamic Settings) */}
        <div className="p-8 border-t border-[#EAEAEA] bg-[#f8f9fa] space-y-6">
          <h2 className="font-bold text-lg border-b border-[#EAEAEA] pb-2 text-[#0B1B3D]">
            Quick Information Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0B1B3D]">Platform Type</label>
              <input
                type="text"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111] transition bg-white"
                placeholder="e.g. Web, Mobile App (iOS/Android), Web & Mobile"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <label className="flex items-center gap-3 p-4 bg-white border border-[#EAEAEA] rounded-xl cursor-pointer">
              <input
                type="checkbox"
                name="isWhiteLabel"
                checked={formData.isWhiteLabel}
                onChange={handleChange}
                className="w-5 h-5 accent-black"
              />
              <span className="text-sm font-semibold text-[#111]">White Label</span>
            </label>

            <label className="flex items-center gap-3 p-4 bg-white border border-[#EAEAEA] rounded-xl cursor-pointer">
              <input
                type="checkbox"
                name="hasSubscription"
                checked={formData.hasSubscription}
                onChange={handleChange}
                className="w-5 h-5 accent-black"
              />
              <span className="text-sm font-semibold text-[#111]">Subscription</span>
            </label>

            <label className="flex items-center gap-3 p-4 bg-white border border-[#EAEAEA] rounded-xl cursor-pointer">
              <input
                type="checkbox"
                name="hasSourceCode"
                checked={formData.hasSourceCode}
                onChange={handleChange}
                className="w-5 h-5 accent-black"
              />
              <span className="text-sm font-semibold text-[#111]">Source Code</span>
            </label>

            <label className="flex items-center gap-3 p-4 bg-white border border-[#EAEAEA] rounded-xl cursor-pointer">
              <input
                type="checkbox"
                name="isCustomizable"
                checked={formData.isCustomizable}
                onChange={handleChange}
                className="w-5 h-5 accent-black"
              />
              <span className="text-sm font-semibold text-[#111]">Customizable</span>
            </label>
          </div>

          {/* Custom Quick Information Fields Repeater */}
          <div className="pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-[#0B1B3D]">Additional Quick Info Fields (Custom Key-Value)</label>
              <button
                type="button"
                onClick={() => addArrayItem(setQuickInfo, quickInfo, { label: "", value: "" })}
                className="text-xs font-semibold flex items-center gap-1 text-[#0B1B3D] hover:text-blue-800"
              >
                <Plus className="w-3.5 h-3.5" /> Add Field
              </button>
            </div>

            <div className="space-y-3">
              {quickInfo.map((info, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={info.label}
                    onChange={(e) => handleArrayChange(setQuickInfo, quickInfo, idx, "label", e.target.value)}
                    className="w-1/2 px-4 py-2.5 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111] transition text-sm bg-white"
                    placeholder="Label (e.g. Database)"
                  />
                  <input
                    type="text"
                    value={info.value}
                    onChange={(e) => handleArrayChange(setQuickInfo, quickInfo, idx, "value", e.target.value)}
                    className="w-1/2 px-4 py-2.5 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111] transition text-sm bg-white"
                    placeholder="Value (e.g. PostgreSQL)"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(setQuickInfo, quickInfo, idx)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Similar Projects Selection */}
        <div className="p-8 border-t border-[#EAEAEA] bg-white space-y-4">
          <h2 className="font-bold text-lg border-b border-[#EAEAEA] pb-2 text-[#0B1B3D]">
            Similar Projects Selection
          </h2>
          <p className="text-sm text-[#666]">
            Select existing projects to show as "Similar Projects" on this project page. (If none selected, it will auto-fallback to category matches).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2 border border-[#EAEAEA] rounded-xl">
            {allProjects
              .filter((p) => p._id !== projectId)
              .map((p) => (
                <label
                  key={p._id}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-sm cursor-pointer transition ${
                    selectedSimilarProjects.includes(p._id)
                      ? "bg-[#D8C494]/10 border-[#D8C494] font-semibold text-[#111]"
                      : "border-[#EAEAEA] hover:bg-gray-50 text-[#666]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSimilarProjects.includes(p._id)}
                    onChange={() => toggleSimilarProject(p._id)}
                    className="w-4 h-4 accent-black"
                  />
                  <span className="truncate">{p.name}</span>
                </label>
              ))}
          </div>
        </div>

        {/* Dynamic Repeater: Features */}
        <div className="p-8 border-t border-[#EAEAEA] bg-[#fafafa]">
          <div className="flex justify-between items-center border-b border-[#EAEAEA] pb-2 mb-6">
            <h2 className="font-bold text-lg">Features</h2>
            <button
              type="button"
              onClick={() => addArrayItem(setFeatures, features, { title: "", description: "" })}
              className="text-sm font-medium flex items-center gap-1 text-[#0B1B3D] hover:text-blue-800"
            >
              <Plus className="w-4 h-4" /> Add Feature
            </button>
          </div>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-4 items-start bg-white p-4 rounded-xl border border-[#EAEAEA]">
                <div className="flex-1 space-y-4">
                  <input
                    type="text"
                    value={feature.title}
                    onChange={(e) => handleArrayChange(setFeatures, features, index, "title", e.target.value)}
                    className="w-full px-4 py-2 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111] transition text-sm"
                    placeholder="Feature Title"
                  />
                  <input
                    type="text"
                    value={feature.description}
                    onChange={(e) => handleArrayChange(setFeatures, features, index, "description", e.target.value)}
                    className="w-full px-4 py-2 border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#111111] transition text-sm"
                    placeholder="Feature Description (Optional)"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeArrayItem(setFeatures, features, index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="p-8 border-t border-[#EAEAEA] flex justify-end bg-white">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#111111] text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#333] transition shadow-md disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Project"}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  defaultImage?: string;
}

export default function ImageUploader({ onUpload, defaultImage }: ImageUploaderProps) {
  const [image, setImage] = useState<string | null>(defaultImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.url) {
        setImage(data.url);
        onUpload(data.url);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      setError("An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const clearImage = () => {
    setImage(null);
    onUpload("");
  };

  return (
    <div className="w-full">
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      
      {image ? (
        <div className="relative w-full h-48 rounded-xl overflow-hidden group border border-[#333]">
          <img src={image} alt="Uploaded" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              type="button"
              onClick={clearImage}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-48 border-2 border-dashed border-[#444] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#D8C494] hover:bg-[#D8C494]/5 transition-colors bg-[#111]"
        >
          {isUploading ? (
            <div className="flex flex-col items-center text-[#D8C494]">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <span className="text-sm font-medium">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-[#888] hover:text-[#D8C494] transition-colors">
              <UploadCloud className="w-10 h-10 mb-3" />
              <span className="text-sm font-medium">Click or drag image to upload</span>
              <span className="text-xs opacity-70 mt-1">Supports JPG, PNG, WEBP</span>
            </div>
          )}
        </div>
      )}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
}

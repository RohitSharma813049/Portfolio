"use client";

import { useState } from "react";
import { ChevronRight, PlayCircle } from "lucide-react";

export default function ProjectTabs({ project }: { project: any }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <section className="max-w-5xl mx-auto px-8 pt-12">
      {/* Tab Navigation */}
      <div className="flex gap-8 border-b border-[#EAEAEA] mb-8 overflow-x-auto pb-4">
        <button 
          onClick={() => setActiveTab("overview")}
          className={`text-sm font-bold border-b-2 pb-2 whitespace-nowrap ${activeTab === 'overview' ? 'border-[#111111] text-[#0B1B3D]' : 'border-transparent text-[#16325C] hover:text-[#0B1B3D]'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab("features")}
          className={`text-sm font-bold border-b-2 pb-2 whitespace-nowrap ${activeTab === 'features' ? 'border-[#111111] text-[#0B1B3D]' : 'border-transparent text-[#16325C] hover:text-[#0B1B3D]'}`}
        >
          Features
        </button>
        <button 
          onClick={() => setActiveTab("panels")}
          className={`text-sm font-bold border-b-2 pb-2 whitespace-nowrap ${activeTab === 'panels' ? 'border-[#111111] text-[#0B1B3D]' : 'border-transparent text-[#16325C] hover:text-[#0B1B3D]'}`}
        >
          Panels
        </button>
        <button 
          onClick={() => setActiveTab("screenshots")}
          className={`text-sm font-bold border-b-2 pb-2 whitespace-nowrap ${activeTab === 'screenshots' ? 'border-[#111111] text-[#0B1B3D]' : 'border-transparent text-[#16325C] hover:text-[#0B1B3D]'}`}
        >
          Screenshots
        </button>
        {project.videoUrl && (
          <button 
            onClick={() => setActiveTab("video")}
            className={`text-sm font-bold border-b-2 pb-2 whitespace-nowrap ${activeTab === 'video' ? 'border-[#111111] text-[#0B1B3D]' : 'border-transparent text-[#16325C] hover:text-[#0B1B3D]'}`}
          >
            Video Tour
          </button>
        )}
        {project.credentials && project.credentials.length > 0 && (
          <button 
            onClick={() => setActiveTab("demo")}
            className={`text-sm font-bold border-b-2 pb-2 whitespace-nowrap ${activeTab === 'demo' ? 'border-[#111111] text-[#0B1B3D]' : 'border-transparent text-[#16325C] hover:text-[#0B1B3D]'}`}
          >
            Demo Access
          </button>
        )}
      </div>

      {/* Content Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8 min-h-[400px]">
          
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-bold mb-4">Detailed Description</h3>
              <p className="text-[#16325C] leading-relaxed mb-4 whitespace-pre-wrap">
                {project.fullDescription || "No detailed description provided yet."}
              </p>
              
              {project.industries && project.industries.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold mb-4">Target Industries</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.industries.map((ind: string) => (
                      <span key={ind} className="text-sm bg-[#f4f4f4] px-4 py-2 rounded-none-none text-[#0B1B3D]">{ind}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Features Tab */}
          {activeTab === "features" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-bold mb-4">Key Features</h3>
              {project.features && project.features.length > 0 ? (
                <ul className="space-y-4">
                  {project.features.map((feature: any, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 bg-[#fafafa] p-4 rounded-none-none border border-[#EAEAEA]">
                      <ChevronRight className="w-5 h-5 text-[#0B1B3D] mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-[#0B1B3D] block mb-1">{feature.title}</span> 
                        {feature.description && <span className="text-[#16325C] text-sm">{feature.description}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#16325C]">No features documented for this project.</p>
              )}
            </div>
          )}

          {/* Panels Tab */}
          {activeTab === "panels" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-bold mb-4">Included Panels</h3>
              {project.panels && project.panels.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.panels.map((panel: any, idx: number) => (
                    <div key={idx} className="bg-white border border-[#EAEAEA] p-5 rounded-none-none shadow-sm">
                      <h4 className="font-bold mb-2 text-[#0B1B3D]">{panel.name}</h4>
                      {panel.description && <p className="text-sm text-[#16325C]">{panel.description}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#16325C]">No separate panels defined.</p>
              )}
            </div>
          )}
          
          {/* Screenshots Tab */}
          {activeTab === "screenshots" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-bold mb-4">Gallery</h3>
              {project.screenshots && project.screenshots.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.screenshots.map((shot: any, idx: number) => (
                    <div key={idx} className="bg-[#f8f9fa] border border-[#EAEAEA] rounded-none-none overflow-hidden aspect-video relative">
                       <img src={shot.url} alt={`Screenshot ${idx+1}`} className="w-full h-full object-cover" />
                       <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] uppercase px-2 py-1 rounded-none backdrop-blur-md">
                         {shot.type}
                       </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="aspect-video bg-[#f8f9fa] rounded-none-none border border-[#EAEAEA] flex items-center justify-center">
                  <p className="text-[#16325C]">No screenshots uploaded.</p>
                </div>
              )}
            </div>
          )}

          {/* Video Tab */}
          {activeTab === "video" && project.videoUrl && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-bold mb-4">Video Tour</h3>
              <div className="aspect-video bg-black rounded-none-none overflow-hidden">
                <iframe 
                  src={project.videoUrl.replace("watch?v=", "embed/")} 
                  title="Video Tour" 
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* Demo Credentials Tab */}
          {activeTab === "demo" && project.credentials && project.credentials.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-bold mb-4">Demo Credentials</h3>
              <p className="text-[#16325C] mb-6">Use the following credentials to test the live preview panels of this project.</p>
              <div className="space-y-4">
                {project.credentials.map((cred: any, idx: number) => (
                  <div key={idx} className="bg-[#f8f9fa] border border-[#EAEAEA] p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="flex-1">
                      <h4 className="font-bold text-[#0B1B3D] text-lg mb-1">{cred.role} Panel</h4>
                    </div>
                    <div className="flex-2 space-y-2">
                      <div className="flex justify-between bg-white px-4 py-2 border border-[#EAEAEA] text-sm font-mono">
                        <span className="text-[#666]">Email:</span>
                        <span className="text-[#0B1B3D] font-bold">{cred.email}</span>
                      </div>
                      <div className="flex justify-between bg-white px-4 py-2 border border-[#EAEAEA] text-sm font-mono">
                        <span className="text-[#666]">Password:</span>
                        <span className="text-[#0B1B3D] font-bold">{cred.password || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {project.livePreviewUrl && (
                <div className="mt-8">
                  <a href={project.livePreviewUrl} target="_blank" rel="noreferrer" className="bg-[#1E3A8A] text-white px-8 py-3 rounded-none inline-block font-semibold hover:bg-[#152960] transition">
                    Open Live Preview
                  </a>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Sidebar Info Cards */}
        <div className="space-y-6">
          <div className="p-6 rounded-none-none border border-[#EAEAEA] bg-[#fafafa]">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Quick Information</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between border-b border-[#EAEAEA] pb-2"><span className="text-[#16325C]">Platform</span><span className="font-medium">Web</span></li>
              <li className="flex justify-between border-b border-[#EAEAEA] pb-2"><span className="text-[#16325C]">White Label</span><span className="font-medium">{project.isWhiteLabel ? 'Yes' : 'No'}</span></li>
              <li className="flex justify-between border-b border-[#EAEAEA] pb-2"><span className="text-[#16325C]">Subscription</span><span className="font-medium">{project.hasSubscription ? 'Available' : 'No'}</span></li>
              <li className="flex justify-between pb-2"><span className="text-[#16325C]">Source Code</span><span className="font-medium">{project.hasSourceCode ? 'Available' : 'No'}</span></li>
            </ul>
          </div>
          
          {project.technologies && project.technologies.length > 0 && (
            <div className="p-6 rounded-none-none border border-[#EAEAEA] bg-[#fafafa]">
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech: string) => (
                  <span key={tech} className="text-xs bg-white border border-[#EAEAEA] px-3 py-1.5 rounded-none-none shadow-sm">{tech}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

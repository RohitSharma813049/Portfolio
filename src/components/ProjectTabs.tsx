"use client";

import { useState } from "react";
import { ChevronRight, PlayCircle } from "lucide-react";
import { getVideoEmbedInfo } from "@/lib/videoUtils";

export default function ProjectTabs({ project }: { project: any }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-8 pt-8 sm:pt-12">
      {/* Tab Navigation */}
      <div className="flex gap-4 sm:gap-8 border-b border-[#EAEAEA] mb-6 sm:mb-8 overflow-x-auto pb-3 scrollbar-hide">
        <button 
          onClick={() => setActiveTab("overview")}
          className={`text-xs sm:text-sm font-bold border-b-2 pb-2 whitespace-nowrap transition-colors ${activeTab === 'overview' ? 'border-[#D8C494] text-[#D8C494]' : 'border-transparent text-[#666] hover:text-[#111]'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab("features")}
          className={`text-xs sm:text-sm font-bold border-b-2 pb-2 whitespace-nowrap transition-colors ${activeTab === 'features' ? 'border-[#D8C494] text-[#D8C494]' : 'border-transparent text-[#666] hover:text-[#111]'}`}
        >
          Features
        </button>
        <button 
          onClick={() => setActiveTab("panels")}
          className={`text-xs sm:text-sm font-bold border-b-2 pb-2 whitespace-nowrap transition-colors ${activeTab === 'panels' ? 'border-[#D8C494] text-[#D8C494]' : 'border-transparent text-[#666] hover:text-[#111]'}`}
        >
          Panels
        </button>
        <button 
          onClick={() => setActiveTab("screenshots")}
          className={`text-xs sm:text-sm font-bold border-b-2 pb-2 whitespace-nowrap transition-colors ${activeTab === 'screenshots' ? 'border-[#D8C494] text-[#D8C494]' : 'border-transparent text-[#666] hover:text-[#111]'}`}
        >
          Screenshots
        </button>
        {project.videoUrl && (
          <button 
            onClick={() => setActiveTab("video")}
            className={`text-xs sm:text-sm font-bold border-b-2 pb-2 whitespace-nowrap transition-colors ${activeTab === 'video' ? 'border-[#D8C494] text-[#D8C494]' : 'border-transparent text-[#666] hover:text-[#111]'}`}
          >
            Video Tour
          </button>
        )}
        {project.credentials && project.credentials.length > 0 && (
          <button 
            onClick={() => setActiveTab("demo")}
            className={`text-xs sm:text-sm font-bold border-b-2 pb-2 whitespace-nowrap transition-colors ${activeTab === 'demo' ? 'border-[#D8C494] text-[#D8C494]' : 'border-transparent text-[#666] hover:text-[#111]'}`}
          >
            Demo Access
          </button>
        )}
      </div>

      {/* Content Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-6 sm:space-y-8 min-h-[300px]">
          
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
                      <span key={ind} className="text-sm bg-[#f4f4f4] px-4 py-2 rounded-full text-[#111] font-medium">{ind}</span>
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
                    <li key={idx} className="flex items-start gap-3 bg-[#f8f9fa] p-5 rounded-2xl border border-[#EAEAEA]">
                      <ChevronRight className="w-5 h-5 text-[#D8C494] mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-[#111] block mb-1">{feature.title}</span> 
                        {feature.description && <span className="text-[#666] text-sm">{feature.description}</span>}
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
                    <div key={idx} className="bg-white border border-[#EAEAEA] p-6 rounded-2xl shadow-sm">
                      <h4 className="font-bold mb-2 text-[#111]">{panel.name}</h4>
                      {panel.description && <p className="text-sm text-[#666]">{panel.description}</p>}
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
                    <div key={idx} className="bg-[#f8f9fa] border border-[#EAEAEA] rounded-2xl overflow-hidden aspect-video relative group">
                       <img src={shot.url} alt={`Screenshot ${idx+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] uppercase px-3 py-1.5 rounded-full backdrop-blur-md font-medium tracking-wider">
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
          {activeTab === "video" && project.videoUrl && (() => {
            const videoInfo = getVideoEmbedInfo(project.videoUrl);
            return (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Video Tour</h3>
                  <a 
                    href={project.videoUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs font-semibold text-[#D8C494] hover:underline flex items-center gap-1"
                  >
                    Open Video in New Tab ↗
                  </a>
                </div>
                <div className="aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm flex items-center justify-center relative">
                  {videoInfo.isVideoFile ? (
                    <video src={videoInfo.embedUrl} controls className="w-full h-full object-cover" />
                  ) : (
                    <iframe 
                      src={videoInfo.embedUrl} 
                      title="Video Tour" 
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Demo Credentials Tab */}
          {activeTab === "demo" && project.credentials && project.credentials.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-bold mb-4">Demo Credentials</h3>
              <p className="text-[#16325C] mb-6">Use the following credentials to test the live preview panels of this project.</p>
              <div className="space-y-4">
                {project.credentials.map((cred: any, idx: number) => (
                  <div key={idx} className="bg-white border border-[#EAEAEA] rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center shadow-sm">
                    <div className="flex-1">
                      <h4 className="font-bold text-[#111] text-lg mb-1">{cred.role} Panel</h4>
                    </div>
                    <div className="flex-2 space-y-2 w-full md:w-auto">
                      <div className="flex justify-between bg-[#f8f9fa] rounded-lg px-4 py-3 border border-[#EAEAEA] text-sm font-mono">
                        <span className="text-[#666]">Email:</span>
                        <span className="text-[#111] font-bold">{cred.email}</span>
                      </div>
                      <div className="flex justify-between bg-[#f8f9fa] rounded-lg px-4 py-3 border border-[#EAEAEA] text-sm font-mono">
                        <span className="text-[#666]">Password:</span>
                        <span className="text-[#111] font-bold">{cred.password || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {project.livePreviewUrl && (
                <div className="mt-8 text-center md:text-left">
                  <a href={project.livePreviewUrl} target="_blank" rel="noreferrer" className="bg-black text-white px-8 py-3.5 rounded-full inline-block font-semibold hover:bg-[#D8C494] transition-colors shadow-sm hover:scale-105 duration-300">
                    Open Live Preview
                  </a>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Sidebar Info Cards */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-[#EAEAEA] bg-white shadow-sm">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-6 text-[#111]">Quick Information</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between border-b border-[#EAEAEA] pb-3"><span className="text-[#666]">Platform</span><span className="font-medium text-[#111]">{project.platform || "Web"}</span></li>
              <li className="flex justify-between border-b border-[#EAEAEA] pb-3"><span className="text-[#666]">White Label</span><span className="font-medium text-[#111]">{project.isWhiteLabel ? 'Yes' : 'No'}</span></li>
              <li className="flex justify-between border-b border-[#EAEAEA] pb-3"><span className="text-[#666]">Subscription</span><span className="font-medium text-[#111]">{project.hasSubscription ? 'Available' : 'No'}</span></li>
              <li className="flex justify-between border-b border-[#EAEAEA] pb-3"><span className="text-[#666]">Source Code</span><span className="font-medium text-[#111]">{project.hasSourceCode ? 'Available' : 'No'}</span></li>
              <li className="flex justify-between border-b border-[#EAEAEA] pb-3"><span className="text-[#666]">Customizable</span><span className="font-medium text-[#111]">{project.isCustomizable ? 'Yes' : 'No'}</span></li>
              {project.quickInfo && project.quickInfo.map((info: any, idx: number) => (
                <li key={idx} className="flex justify-between border-b border-[#EAEAEA] pb-3 last:border-0 last:pb-0">
                  <span className="text-[#666]">{info.label}</span>
                  <span className="font-medium text-[#111]">{info.value}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {project.technologies && project.technologies.length > 0 && (
            <div className="p-6 rounded-3xl border border-[#EAEAEA] bg-white shadow-sm">
              <h4 className="font-bold text-sm uppercase tracking-wider mb-6 text-[#111]">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech: string) => (
                  <span key={tech} className="text-xs bg-[#f4f4f4] text-[#111] font-medium px-4 py-2 rounded-full">{tech}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

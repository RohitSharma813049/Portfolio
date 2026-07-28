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
          className={`text-sm font-bold border-b-2 pb-2 whitespace-nowrap ${activeTab === 'overview' ? 'border-[#111111] text-[#111111]' : 'border-transparent text-[#666666] hover:text-[#111111]'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab("features")}
          className={`text-sm font-bold border-b-2 pb-2 whitespace-nowrap ${activeTab === 'features' ? 'border-[#111111] text-[#111111]' : 'border-transparent text-[#666666] hover:text-[#111111]'}`}
        >
          Features
        </button>
        <button 
          onClick={() => setActiveTab("panels")}
          className={`text-sm font-bold border-b-2 pb-2 whitespace-nowrap ${activeTab === 'panels' ? 'border-[#111111] text-[#111111]' : 'border-transparent text-[#666666] hover:text-[#111111]'}`}
        >
          Panels
        </button>
        <button 
          onClick={() => setActiveTab("screenshots")}
          className={`text-sm font-bold border-b-2 pb-2 whitespace-nowrap ${activeTab === 'screenshots' ? 'border-[#111111] text-[#111111]' : 'border-transparent text-[#666666] hover:text-[#111111]'}`}
        >
          Screenshots
        </button>
      </div>

      {/* Content Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8 min-h-[400px]">
          
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-bold mb-4">Detailed Description</h3>
              <p className="text-[#666666] leading-relaxed mb-4 whitespace-pre-wrap">
                {project.fullDescription || "No detailed description provided yet."}
              </p>
              
              {project.industries && project.industries.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold mb-4">Target Industries</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.industries.map((ind: string) => (
                      <span key={ind} className="text-sm bg-[#f4f4f4] px-4 py-2 rounded-lg text-[#111111]">{ind}</span>
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
                    <li key={idx} className="flex items-start gap-3 bg-[#fafafa] p-4 rounded-xl border border-[#EAEAEA]">
                      <ChevronRight className="w-5 h-5 text-[#111111] mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-[#111111] block mb-1">{feature.title}</span> 
                        {feature.description && <span className="text-[#666666] text-sm">{feature.description}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#666666]">No features documented for this project.</p>
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
                    <div key={idx} className="bg-white border border-[#EAEAEA] p-5 rounded-xl shadow-sm">
                      <h4 className="font-bold mb-2 text-[#111111]">{panel.name}</h4>
                      {panel.description && <p className="text-sm text-[#666666]">{panel.description}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#666666]">No separate panels defined.</p>
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
                    <div key={idx} className="bg-[#f8f9fa] border border-[#EAEAEA] rounded-xl overflow-hidden aspect-video relative">
                       <img src={shot.url} alt={`Screenshot ${idx+1}`} className="w-full h-full object-cover" />
                       <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] uppercase px-2 py-1 rounded backdrop-blur-md">
                         {shot.type}
                       </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="aspect-video bg-[#f8f9fa] rounded-2xl border border-[#EAEAEA] flex items-center justify-center">
                  <p className="text-[#666666]">No screenshots uploaded.</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Sidebar Info Cards */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-[#EAEAEA] bg-[#fafafa]">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Quick Information</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between border-b border-[#EAEAEA] pb-2"><span className="text-[#666666]">Platform</span><span className="font-medium">Web</span></li>
              <li className="flex justify-between border-b border-[#EAEAEA] pb-2"><span className="text-[#666666]">White Label</span><span className="font-medium">{project.isWhiteLabel ? 'Yes' : 'No'}</span></li>
              <li className="flex justify-between border-b border-[#EAEAEA] pb-2"><span className="text-[#666666]">Subscription</span><span className="font-medium">{project.hasSubscription ? 'Available' : 'No'}</span></li>
              <li className="flex justify-between pb-2"><span className="text-[#666666]">Source Code</span><span className="font-medium">{project.hasSourceCode ? 'Available' : 'No'}</span></li>
            </ul>
          </div>
          
          {project.technologies && project.technologies.length > 0 && (
            <div className="p-6 rounded-2xl border border-[#EAEAEA] bg-[#fafafa]">
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech: string) => (
                  <span key={tech} className="text-xs bg-white border border-[#EAEAEA] px-3 py-1.5 rounded-full shadow-sm">{tech}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

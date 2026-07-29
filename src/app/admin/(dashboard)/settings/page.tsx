import { Save, Settings2, Shield, Bell } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in-up">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-playfair font-medium flex items-center gap-3 text-white">
            <Settings2 className="w-8 h-8 text-[#D8C494]" /> Platform Settings
          </h1>
          <p className="text-[#999] text-sm mt-2 font-light tracking-wide">Manage your platform's core configuration</p>
        </div>
        <button className="bg-[#D8C494] text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#c2ae7c] transition-colors shadow-[0_0_20px_rgba(216,196,148,0.2)] flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#111] border border-[#333] text-white rounded-xl font-medium transition">
            <Settings2 className="w-5 h-5 text-[#D8C494]" /> General
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-transparent hover:bg-[#111] border border-transparent hover:border-[#333] text-[#888] hover:text-white rounded-xl transition">
            <Shield className="w-5 h-5" /> Security
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-transparent hover:bg-[#111] border border-transparent hover:border-[#333] text-[#888] hover:text-white rounded-xl transition">
            <Bell className="w-5 h-5" /> Notifications
          </button>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#111] rounded-2xl border border-[#333] shadow-2xl overflow-hidden p-8">
            <div className="mb-8 border-b border-[#333] pb-4">
              <h2 className="font-playfair font-medium text-2xl text-white">General Settings</h2>
              <p className="text-[#666] text-sm mt-1">Configure your primary business details.</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Portfolio Name</label>
                <input 
                  type="text" 
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8C494] transition"
                  defaultValue="Webbeside Technology"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Contact Email</label>
                <input 
                  type="email" 
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D8C494] transition"
                  defaultValue="contact@webbeside.com"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#111] rounded-2xl border border-[#333] shadow-2xl overflow-hidden p-8">
            <div className="mb-8 border-b border-[#333] pb-4">
              <h2 className="font-playfair font-medium text-2xl text-white">System Configuration</h2>
              <p className="text-[#666] text-sm mt-1">These settings are managed via your environment variables.</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">Admin Email (Login)</label>
                <input 
                  type="email" 
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-[#666] cursor-not-allowed"
                  defaultValue="admin@example.com"
                  disabled
                />
                <p className="text-xs text-[#555] mt-2">Configured via ADMIN_EMAIL in .env</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

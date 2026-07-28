import { Save } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Platform Settings</h1>
        <button className="bg-[#111111] text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-[#333] transition flex items-center gap-2 shadow-sm">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="bg-white rounded-[20px] border border-[#EAEAEA] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[#EAEAEA]">
          <h2 className="font-bold text-lg mb-1">General Settings</h2>
          <p className="text-sm text-[#666666]">Manage your platform's basic configuration.</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-2">Portfolio Name</label>
            <input 
              type="text" 
              className="w-full border border-[#EAEAEA] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#111111] transition"
              defaultValue="Webbeside Technology"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-2">Contact Email</label>
            <input 
              type="email" 
              className="w-full border border-[#EAEAEA] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#111111] transition"
              defaultValue="contact@webbeside.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111111] mb-2">Admin Email (Login)</label>
            <input 
              type="email" 
              className="w-full border border-[#EAEAEA] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#111111] transition bg-[#f9f9f9] text-[#666666]"
              defaultValue="admin@example.com"
              disabled
            />
            <p className="text-xs text-[#666666] mt-2">Admin email is configured via environment variables (.env).</p>
          </div>
        </div>
      </div>
    </div>
  );
}

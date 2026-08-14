import { Save, Settings2, Shield, Bell } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-playfair font-medium flex items-center gap-3 text-[#111]">
            <Settings2 className="w-8 h-8 text-[#D8C494]" /> Platform Settings
          </h1>
          <p className="text-[#666] text-sm mt-1 font-light tracking-wide">Manage your platform's core configuration</p>
        </div>
        <button className="bg-[#D8C494] text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#c2ae7c] transition-colors shadow-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-[#EAEAEA] text-[#111] rounded-xl font-semibold shadow-sm transition">
            <Settings2 className="w-5 h-5 text-[#D8C494]" /> General
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-transparent hover:bg-white border border-transparent hover:border-[#EAEAEA] text-[#666] hover:text-[#111] rounded-xl transition">
            <Shield className="w-5 h-5" /> Security
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-transparent hover:bg-white border border-transparent hover:border-[#EAEAEA] text-[#666] hover:text-[#111] rounded-xl transition">
            <Bell className="w-5 h-5" /> Notifications
          </button>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-sm overflow-hidden p-6 md:p-8">
            <div className="mb-8 border-b border-[#EAEAEA] pb-4">
              <h2 className="font-playfair font-medium text-2xl text-[#111]">General Settings</h2>
              <p className="text-[#666] text-sm mt-1">Configure your primary business details.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-[#111] uppercase tracking-wider mb-2">Portfolio Name</label>
                <input
                  type="text"
                  className="w-full bg-white border border-[#EAEAEA] rounded-xl px-4 py-3 text-[#111] focus:outline-none focus:border-black transition"
                  defaultValue="Webbeside Technology"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111] uppercase tracking-wider mb-2">Contact Email</label>
                <input
                  type="email"
                  className="w-full bg-white border border-[#EAEAEA] rounded-xl px-4 py-3 text-[#111] focus:outline-none focus:border-black transition"
                  defaultValue="contact@webbeside.com"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-sm overflow-hidden p-6 md:p-8">
            <div className="mb-8 border-b border-[#EAEAEA] pb-4">
              <h2 className="font-playfair font-medium text-2xl text-[#111]">System Configuration</h2>
              <p className="text-[#666] text-sm mt-1">These settings are managed via your environment variables.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-[#111] uppercase tracking-wider mb-2">Admin Email (Login)</label>
                <input
                  type="email"
                  className="w-full bg-gray-50 border border-[#EAEAEA] rounded-xl px-4 py-3 text-[#666] cursor-not-allowed"
                  defaultValue="admin@example.com"
                  disabled
                />
                <p className="text-xs text-[#888] mt-2">Configured via ADMIN_EMAIL in .env</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

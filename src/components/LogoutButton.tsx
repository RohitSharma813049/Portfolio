"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton({ isCollapsed }: { isCollapsed?: boolean }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className={`flex w-full items-center ${isCollapsed ? 'justify-center p-2' : 'justify-between px-4 py-3'} rounded-none-none text-sm font-medium hover:bg-red-50 text-red-600 transition mt-4`}
      title={isCollapsed ? "Sign Out" : undefined}
    >
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
        <LogOut className="w-5 h-5" /> 
        {!isCollapsed && <span>Sign Out</span>}
      </div>
    </button>
  );
}

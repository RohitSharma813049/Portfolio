"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex w-full items-center justify-between px-4 py-3 rounded-xl text-sm font-medium hover:bg-red-50 text-red-600 transition mt-4"
    >
      <div className="flex items-center gap-3">
        <LogOut className="w-4 h-4" /> Sign Out
      </div>
    </button>
  );
}

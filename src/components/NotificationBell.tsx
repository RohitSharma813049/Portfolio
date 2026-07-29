"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Mock data for now so it's always visible and looks good
  const notifications = [
    { id: 1, title: "System Update", text: "New features have been added to the dashboard.", time: "1h ago", isRead: false },
    { id: 2, title: "New Publication", text: "A new journal article was just published.", time: "3h ago", isRead: false },
    { id: 3, title: "Welcome", text: "Welcome to Global Scholar Publications!", time: "1d ago", isRead: true },
  ];
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".public-notifications")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative public-notifications">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 text-[#16276B] rounded-none transition-colors relative ${isOpen ? 'bg-[#f4f4f4]' : 'hover:bg-[#f4f4f4]'}`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-80 bg-white border border-[#EAEAEA] rounded shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-2 border-b border-[#EAEAEA] flex justify-between items-center">
            <h3 className="font-bold text-sm text-[#111111]">Notifications</h3>
            <span className="text-xs text-[#D8C494] font-medium cursor-pointer hover:underline">Mark all as read</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((n) => (
              <div key={n.id} className={`px-4 py-3 border-b border-gray-50 cursor-pointer transition ${n.isRead ? 'hover:bg-gray-50' : 'bg-blue-50 hover:bg-blue-100'}`}>
                <p className="text-sm text-[#111111]"><span className="font-bold">{n.title}</span> - {n.text}</p>
                <p className="text-xs text-gray-500 mt-1">{n.time}</p>
              </div>
            ))}
          </div>
          <div className="px-4 py-2 border-t border-[#EAEAEA] text-center">
            <Link href="/dashboard" className="text-xs font-semibold text-[#D8C494] hover:underline">View all</Link>
          </div>
        </div>
      )}
    </div>
  );
}

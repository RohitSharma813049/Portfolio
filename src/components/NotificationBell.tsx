"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setNotifications(data.data);
            setUnreadCount(data.data.filter((n: any) => !n.isRead).length);
          }
        }
      } catch (error) {
        console.error("Failed to load notifications", error);
      }
    }
    fetchNotifications();
  }, []);

  if (notifications.length === 0) return null;

  return (
    <Link href="/dashboard" className="relative p-2 text-[#1E3A8A] hover:bg-[#f4f4f4] rounded-none transition-colors">
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full">
          {unreadCount}
        </span>
      )}
    </Link>
  );
}

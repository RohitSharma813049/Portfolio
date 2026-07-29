"use client";

import { usePathname } from "next/navigation";

export default function ConditionalHeader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Do not show the public header on admin pages, login, or signup
  if (pathname?.startsWith("/admin") || pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return <>{children}</>;
}

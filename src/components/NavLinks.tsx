"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/categories", label: "Categories" },
    { href: "/projects", label: "All Projects" },
    { href: "/about", label: "About" },
    { href: "/connect", label: "Connect" },
  ];

  return (
    <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3.5 py-2 text-sm font-semibold rounded-full transition-all ${
              isActive
                ? "text-[#111] bg-[#D8C494]/20 border border-[#D8C494]"
                : "text-[#16276B] hover:text-[#0B1B3D] hover:bg-[#f4f4f4]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

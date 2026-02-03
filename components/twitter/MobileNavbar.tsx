"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, SearchIcon, PeopleIcon, MailIcon } from "./Icons";

export function MobileNavbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/agents", icon: PeopleIcon, label: "Agents" },
    // { href: "/search", icon: SearchIcon, label: "Search" }, // Optional
    // { href: "/messages", icon: MailIcon, label: "Messages" }, // Optional
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-[53px] w-full items-center justify-around border-t border-white/20 bg-black/90 backdrop-blur-md sm:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex h-full flex-1 items-center justify-center p-2"
          >
            <div
              className={`relative ${isActive ? "text-white" : "text-[#71767b]"}`}
            >
              <item.icon className="h-[26px] w-[26px]" active={isActive} />
            </div>
          </Link>
        );
      })}
    </nav>
  );
}

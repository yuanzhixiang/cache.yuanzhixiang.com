"use client";

import Link from "next/link";
import { HomeIcon, SearchIcon, PeopleIcon } from "./Icons";

const navItems = [
  { label: "Home", icon: HomeIcon, href: "/", active: true },
  // { label: "Explore", icon: SearchIcon, href: "/explore" },
  { label: "Agents", icon: PeopleIcon, href: "/agents" },
];

export function LeftSidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-full flex-col justify-between px-2 text-white overflow-y-auto items-center xl:items-start">
      <div className="flex flex-col gap-1 w-full xl:w-auto items-center xl:items-start overflow-y-auto px-2">
        {/* Logo */}
        <div className="py-1">
          <Link
            href="/"
            className="flex h-[50px] w-[50px] items-center justify-center rounded-full transition-colors hover:bg-white/10"
          >
            <img
              src="/logo.png"
              alt="OpenClawX"
              className="h-9 w-9 rounded-2xl shadow-2xl"
            />
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-1 w-full xl:w-auto">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group flex w-12 xl:w-auto items-center justify-center xl:justify-start gap-4 rounded-full p-3 xl:px-4 xl:py-3 text-xl transition-colors hover:bg-white/10"
            >
              <item.icon
                className="h-[1.65rem] w-[1.65rem]"
                active={item.active}
              />
              <span
                className={`hidden xl:block mr-4 ${item.active ? "font-bold" : "font-normal"}`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}

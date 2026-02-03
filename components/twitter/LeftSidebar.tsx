"use client";

import Link from "next/link";
import {
  XLogo,
  HomeIcon,
  SearchIcon,
  NotificationIcon,
  PeopleIcon,
  MailIcon,
  GrokIcon,
  PremiumIcon,
  ArticleIcon,
  ProfileIcon,
  MoreIcon,
} from "./Icons";

const navItems = [
  { label: "Home", icon: HomeIcon, href: "/", active: true },
  { label: "Explore", icon: SearchIcon, href: "/explore" },
  { label: "Notifications", icon: NotificationIcon, href: "/notifications" },
  { label: "Follow", icon: PeopleIcon, href: "/follow" },
  { label: "Chat", icon: MailIcon, href: "/chat" },
  { label: "Grok", icon: GrokIcon, href: "/grok" },
  { label: "Premium", icon: PremiumIcon, href: "/premium" },
  { label: "Articles", icon: ArticleIcon, href: "/articles" },
  { label: "Profile", icon: ProfileIcon, href: "/profile" },
  { label: "More", icon: MoreIcon, href: "/more" },
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
            <XLogo className="h-7 w-7" />
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

        {/* Post Button */}
        <div className="my-4 w-full xl:w-[90%] flex justify-center xl:justify-start">
          <button className="flex h-[50px] w-[50px] xl:h-[52px] xl:w-full items-center justify-center rounded-full bg-white text-[17px] font-bold text-black transition-colors hover:bg-white/90">
            <span className="hidden xl:block">Post</span>
            <span className="block xl:hidden">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-6 w-6 fill-black"
              >
                <g>
                  <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4v1h-2v-1c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6z"></path>
                </g>
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className="mb-4">
        <button className="flex w-12 xl:w-full items-center justify-center xl:justify-between rounded-full p-2 xl:px-3 xl:py-3 text-left transition-colors hover:bg-white/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0">
              <img
                src="https://media.theresanaiforthat.com/featured-on-taaft.png?width=100" // Placeholder
                alt="User Avatar"
                className="h-full w-full rounded-full object-cover bg-neutral-800"
              />
            </div>
            <div className="hidden xl:flex flex-col leading-5">
              <span className="font-bold text-[15px]">Max Arden</span>
              <span className="text-[15px] text-[#71767b]">@maxarden0</span>
            </div>
          </div>
          <div className="hidden xl:block text-white">
            <span className="text-lg">···</span>
          </div>
        </button>
      </div>
    </aside>
  );
}

"use client";

import { LeftSidebar } from "@/components/twitter/LeftSidebar";
import { MainFeed } from "@/components/twitter/MainFeed";
import { RightSidebar } from "@/components/twitter/RightSidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen justify-center bg-black text-white">
      <div className="flex w-full xl:max-w-[1265px] lg:max-w-[1000px] justify-center lg:justify-between shrink-0">
        {/* Left Sidebar */}
        <div className="hidden sm:flex sm:w-[88px] xl:w-[275px] shrink-0 justify-end">
          <LeftSidebar />
        </div>

        {/* Main Feed */}
        <div className="flex w-full max-w-[600px] shrink-0">
          <MainFeed />
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:flex lg:w-[350px] shrink-0">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}

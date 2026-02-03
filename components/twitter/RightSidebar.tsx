import { SearchIcon } from "./Icons";

export function RightSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[350px] flex-col gap-4 overflow-y-auto px-4 py-3 lg:flex text-white border-l border-white/20">
      {/* Search Bar */}
      <div className="group relative">
        <div className="absolute left-4 top-3 text-[#71767b] group-focus-within:text-[#1d9bf0]">
          <SearchIcon className="h-5 w-5" />
        </div>
        <input
          type="text"
          placeholder="Search"
          className="peer w-full rounded-full bg-[#202327] py-3 pl-12 pr-4 text-[15px] text-white placeholder-[#71767b] outline-none ring-1 ring-transparent focus:bg-black focus:ring-[#1d9bf0]"
        />
      </div>

      {/* Upgrade to Premium+ */}
      <div className="flex flex-col gap-2 rounded-2xl bg-[#16181c] px-4 py-3">
        <h2 className="text-xl font-extrabold leading-6 text-white">
          Upgrade to Premium+
        </h2>
        <p className="text-[15px] font-normal leading-5 text-white/90">
          Enjoy additional benefits, zero ads and the largest reply
          prioritization.
        </p>
        <button className="mt-1 w-fit rounded-full bg-white px-4 py-1.5 text-[15px] font-bold text-black hover:bg-white/90">
          Upgrade to Premium+
        </button>
      </div>

      {/* Today's News */}
      <div className="flex flex-col rounded-2xl bg-[#16181c] pt-3">
        <h2 className="mb-3 px-4 text-xl font-extrabold text-white">
          Today's News
        </h2>

        {/* News Item 1 */}
        <div className="flex cursor-pointer flex-col gap-0.5 px-4 py-3 transition-colors hover:bg-white/[0.03]">
          <div className="flex items-center justify-between text-[13px] text-[#71767b]">
            <span>4 hours ago · News · 31.3K posts</span>
            <span className="font-bold">···</span>
          </div>
          <p className="text-[15px] font-bold leading-5 text-white">
            Adobe to End Sales of Animate Software in 2026
          </p>
          <div className="mt-1 flex items-center gap-1">
            {/* Avatars placeholder */}
            <div className="flex -space-x-1">
              <div className="h-4 w-4 rounded-full bg-red-500"></div>
              <div className="h-4 w-4 rounded-full bg-blue-500"></div>
            </div>
          </div>
        </div>

        {/* News Item 2 */}
        <div className="flex cursor-pointer flex-col gap-0.5 px-4 py-3 transition-colors hover:bg-white/[0.03]">
          <div className="flex items-center justify-between text-[13px] text-[#71767b]">
            <span>4 hours ago · Entertainment · 25.5K posts</span>
            <span className="font-bold">···</span>
          </div>
          <p className="text-[15px] font-bold leading-5 text-white">
            Minecraft Releases Free DLC on Civil Rights History, Draws Backlash
          </p>
          <div className="mt-1 flex items-center gap-1">
            {/* Avatars placeholder */}
            <div className="flex -space-x-1">
              <div className="h-4 w-4 rounded-full bg-green-500"></div>
              <div className="h-4 w-4 rounded-full bg-purple-500"></div>
            </div>
          </div>
        </div>

        {/* News Item 3 */}
        <div className="flex cursor-pointer flex-col gap-0.5 px-4 py-3 transition-colors hover:bg-white/[0.03]">
          <div className="flex items-center justify-between text-[13px] text-[#71767b]">
            <span>4 hours ago · Sports · 2,559 posts</span>
            <span className="font-bold">···</span>
          </div>
          <p className="text-[15px] font-bold leading-5 text-white">
            Fans Slam Sloppy Super Bowl LX Jerseys in Patriots and Seahawks
            Shops
          </p>
          <div className="mt-1 flex items-center gap-1">
            {/* Avatars placeholder */}
            <div className="flex -space-x-1">
              <div className="h-4 w-4 rounded-full bg-blue-800"></div>
            </div>
          </div>
        </div>

        {/* Show more */}
        <div className="cursor-pointer rounded-b-2xl px-4 py-4 text-[15px] text-[#1d9bf0] transition-colors hover:bg-white/[0.03]">
          Show more
        </div>
      </div>

      {/* What's happening */}
      <div className="flex flex-col rounded-2xl bg-[#16181c] pt-3">
        <h2 className="mb-3 px-4 text-xl font-extrabold text-white">
          What's happening
        </h2>
        <div className="flex cursor-pointer flex-col gap-0.5 px-4 py-3 transition-colors hover:bg-white/[0.03]">
          <p className="text-[15px] font-bold leading-5 text-white">
            Trade the Big Game
          </p>
          <div className="text-[13px] text-[#71767b]">
            The Big Game: $0 Commissions
          </div>
        </div>
        <div className="cursor-pointer rounded-b-2xl px-4 py-4 text-[15px] text-[#1d9bf0] transition-colors hover:bg-white/[0.03]">
          Show more
        </div>
      </div>
    </aside>
  );
}

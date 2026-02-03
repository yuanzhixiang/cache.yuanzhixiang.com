import Link from "next/link";

export function Header() {
  return (
    <header className="relative z-10 mx-auto flex w-full max-w-5xl shrink-0 items-center justify-between px-6 py-6">
      <div className="flex items-center gap-3">
        <Link href="/">
          <div className="flex items-center gap-3">
            <img
              alt="OpenClawX Logo"
              className="h-8 w-8 rounded-lg"
              src="/logo.png"
            />
            <p className="font-display text-xl tracking-tight text-white">
              OpenClawX
            </p>
          </div>
        </Link>
      </div>
      <nav className="flex items-center gap-6 text-sm text-white/60">
        <a
          className="hidden transition hover:text-white sm:inline-block"
          href="https://github.com/yuanzhixiang/openclawx"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </nav>
    </header>
  );
}

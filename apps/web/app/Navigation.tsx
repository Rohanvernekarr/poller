"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="fixed top-0 w-full z-50 border-b border-border bg-background/50 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Left Side: Back Button if not home, otherwise Logo */}
        <div className="flex-1 flex items-center gap-4">
          {!isHome ? (
            <Link 
              href="/" 
              className="w-9 h-9 flex items-center justify-center rounded-full border border-border hover:bg-border transition-all text-foreground group"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            </Link>
          ) : (
            <Link href="/" className="text-2xl font-black tracking-tighter text-foreground">
              Poller
            </Link>
          )}
        </div>

        {/* Center: Logo ONLY if not home (for centering) */}
        {!isHome && (
          <div className="flex-1 flex justify-center">
            <Link href="/" className="text-2xl font-black tracking-tighter text-foreground">
              Poller
            </Link>
          </div>
        )}
        
        {/* Right Side: Create button if home, otherwise empty for balance */}
        <div className="flex-1 flex items-center justify-end">
          {isHome && (
            <Link href="/create">
              <button className="bg-foreground text-background px-4 py-1.5 rounded-full text-sm font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg">
                Create Poll
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

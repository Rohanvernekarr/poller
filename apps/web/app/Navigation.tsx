"use client";

import Link from "next/link";
import { ArrowLeft, LogOut, User as UserIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Left Side: Back Button if not home, otherwise Logo */}
        <div className="flex-1 flex items-center gap-4">
          {!isHome ? (
            <Link 
              href={(session && pathname !== "/dashboard") ? "/dashboard" : "/"} 
              className="w-9 h-9 flex items-center justify-center rounded-full border border-border hover:bg-border transition-all text-foreground group"
              aria-label="Go back"
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
        
        {/* Right Side: Dashboard & User Menu */}
        <div className="flex-1 flex items-center justify-end gap-6 text-foreground">
          {session ? (
            <div className="flex items-center gap-6">
              <Link 
                href="/dashboard" 
                className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                title="My Dashboard"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Account</span>
                  <span className="text-xs font-medium text-white">{session.user?.email}</span>
                </div>
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 hover:bg-white hover:text-black transition-all text-zinc-500"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <Link href="/signin">
              <button className="text-sm font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
                Sign In
              </button>
            </Link>
          )}

          {isHome && (
            <Link href="/create">
              <button className="bg-foreground text-background px-6 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-black/20">
                Create Poll
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

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
    <header className="fixed top-0 w-full z-50 border-b border-border bg-background/50 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Left Side: Logo (Always) */}
        <div className="flex-1 flex items-center">
          <Link href="/" className="text-xl font-black uppercase tracking-tight text-foreground">
            Poller
          </Link>
        </div>
        
        {/* Right Side: Dashboard & User Menu */}
        <div className="flex-1 flex items-center justify-end gap-6 text-foreground">
          {session ? (
            <div className="flex items-center gap-6">
              <Link 
                href="/dashboard" 
                className="text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors"
                title="My Dashboard"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[9px] uppercase tracking-tighter text-foreground/30 font-black">Account</span>
                  <span className="text-[11px] font-black text-foreground max-w-[120px] truncate">{session.user?.email}</span>
                </div>
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-10 h-10 flex items-center justify-center rounded-2xl border border-border hover:bg-red-500 hover:text-white transition-all text-foreground/40"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <Link href="/signin">
              <button className="text-[10px] font-black text-foreground/40 hover:text-foreground transition-colors uppercase tracking-widest">
                Sign In
              </button>
            </Link>
          )}

          {isHome && (
            <Link href="/create">
              <button className="bg-foreground text-background px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-foreground/10">
                Create Poll
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

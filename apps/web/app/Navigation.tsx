"use client";

import Link from "next/link";
import { LogOut, Menu, Plus, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { MobileMenu } from "./components/MobileMenu";
import { SignOutModal } from "./components/SignOutModal";

export function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSignOutModalOpen(false);
  }, [pathname]);

  // Prevent scrolling when mobile menu or modal is open
  useEffect(() => {
    if (isMobileMenuOpen || isSignOutModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen, isSignOutModalOpen]);

  return (
    <header className="fixed top-0 w-full z-50 border-b border-border bg-background/50 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-black uppercase tracking-tight text-foreground transition-opacity hover:opacity-70">
            Poller
          </Link>
          {session && (
            <Link 
              href="/dashboard" 
              className={`hidden md:block text-[11px] font-black uppercase tracking-widest transition-all ${pathname === '/dashboard' ? 'text-foreground' : 'text-foreground/40 hover:text-foreground'}`}
              title="My Dashboard"
            >
              Dashboard
            </Link>
          )}
        </div>
        
        <div className="flex items-center gap-3 sm:gap-6">
          {session ? (
            <div className="flex items-center gap-3 sm:gap-6">
            
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[9px] uppercase tracking-tighter text-foreground/30 font-black">Account</span>
                <span className="text-[12px] font-black text-foreground max-w-[120px] truncate">{session.user?.email}</span>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                {isHome && (
                  <Link href="/create">
                    <button className="hidden sm:flex bg-foreground text-background px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-foreground/10">
                      Create Poll
                    </button>
                    
                  </Link>
                )}

                <button 
                  onClick={() => setIsSignOutModalOpen(true)}
                  className="hidden sm:flex w-10 h-10 items-center justify-center rounded-2xl border border-border hover:bg-red-500 hover:text-white transition-all text-foreground/40"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>

                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden w-10 h-10 flex items-center justify-center rounded-2xl border border-border text-foreground/60 transition-colors"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link href="/signin">
                <button className="text-[10px] font-black text-foreground/40 hover:text-foreground transition-colors uppercase tracking-widest">
                  Sign In
                </button>
              </Link>
              {isHome && (
                <Link href="/create">
                  <button className="bg-foreground text-background px-4 sm:px-6 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-foreground/10">
                    Create Poll
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <SignOutModal 
        isOpen={isSignOutModalOpen} 
        onClose={() => setIsSignOutModalOpen(false)} 
      />

      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        setIsOpen={setIsMobileMenuOpen}
        session={session}
        pathname={pathname}
        isHome={isHome}
        onSignOut={() => setIsSignOutModalOpen(true)}
      />
    </header>
  );
}

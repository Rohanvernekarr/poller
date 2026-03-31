"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { LogOut, Plus } from "lucide-react";
import { Session } from "next-auth";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  session: Session | null;
  pathname: string;
  isHome: boolean;
  onSignOut: () => void;
}

export function MobileMenu({ isOpen, setIsOpen, session, pathname, isHome, onSignOut }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
          />
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-14 left-0 w-full border-b border-border bg-background p-6 shadow-2xl z-40"
          >
            <div className="flex flex-col gap-8">
              {session ? (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-foreground/30 font-black italic">Active Session</span>
                    <span className="text-lg font-black text-foreground truncate">{session.user?.email}</span>
                  </div>
                  
                  <nav className="flex flex-col gap-4">
                    <Link 
                      href="/dashboard"
                      className="group flex items-center justify-between"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className={`text-2xl font-black uppercase tracking-tight ${pathname === '/dashboard' ? 'text-foreground' : 'text-foreground/40 group-hover:text-foreground'}`}>
                        My Dashboard
                      </span>
                      <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all">
                        <Plus className="w-4 h-4 rotate-45" />
                      </div>
                    </Link>
                    
                    {isHome && (
                      <Link 
                        href="/create"
                        className="group flex items-center justify-between"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="text-2xl font-black uppercase tracking-tight text-foreground/40 group-hover:text-foreground">
                          Create Poll
                        </span>
                        <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all">
                          <Plus className="w-4 h-4" />
                        </div>
                      </Link>
                    )}

                    <button 
                      onClick={() => {
                        setIsOpen(false);
                        onSignOut();
                      }}
                      className="flex items-center justify-between group mt-4 pt-4 border-t border-border"
                    >
                      <span className="text-2xl font-black uppercase tracking-tight text-red-500/60 group-hover:text-red-500">
                        Sign Out
                      </span>
                      <LogOut className="w-6 h-6 text-red-500/60 group-hover:text-red-500" />
                    </button>
                  </nav>
                </div>
              ) : (
                <nav className="flex flex-col gap-4">
                  <Link 
                    href="/signin" 
                    className="text-2xl font-black uppercase tracking-tight text-foreground/40 hover:text-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  {isHome && (
                    <Link 
                      href="/create" 
                      className="text-2xl font-black uppercase tracking-tight text-foreground/40 hover:text-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      Create Poll
                    </Link>
                  )}
                </nav>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

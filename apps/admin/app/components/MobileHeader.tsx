"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut, Globe, LayoutDashboard, Users, Vote, Database } from "lucide-react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/" },
  { id: "users", label: "Users", icon: Users, href: "/users" },
  { id: "polls", label: "Polls", icon: Vote, href: "/polls" },
  { id: "system", label: "System", icon: Database, href: "/system" },
];

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="lg:hidden h-16 fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between z-50">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1.5 transition-transform group-hover:scale-110">
            <div className="w-full h-full bg-black rounded-sm" />
          </div>
          <span className="text-xl font-black tracking-tight text-white uppercase">Poller</span>
        </Link>

        <button onClick={() => setIsOpen(true)} className="p-2 text-white bg-white/5 rounded-lg border border-white/10 shadow-lg">
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-black border-l border-white/10 z-[70] shadow-2xl p-8 flex flex-col"
            >
              <div className="flex justify-end mb-8">
                <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:text-white bg-white/5 rounded-lg border border-white/10 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 px-4 py-4 text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all font-bold text-lg border border-transparent hover:border-white/5"
                  >
                    <item.icon className="w-6 h-6" />
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="pt-8 border-t border-white/5 space-y-4">
                <Link 
                  href="http://localhost:3000" 
                  className="flex items-center gap-4 px-4 py-4 text-gray-500 hover:text-white font-bold text-lg"
                >
                  <Globe className="w-6 h-6" />
                  Back to Platform
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-4 px-4 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-bold text-lg"
                >
                  <LogOut className="w-6 h-6" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

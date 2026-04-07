"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Vote, Database, Globe, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/" },
  { id: "users", label: "Users", icon: Users, href: "/users" }, // Assuming we might want separate routes later
  { id: "polls", label: "Polls", icon: Vote, href: "/polls" },
  { id: "system", label: "System", icon: Database, href: "/system" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-white/5 bg-black z-50">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1.5 transition-transform group-hover:scale-110">
            <div className="w-full h-full bg-black rounded-sm" />
          </div>
          <span className="text-xl font-black tracking-tight text-white uppercase">Poller Admin</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                ? "bg-white/10 text-white border border-white/10 shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]" 
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "group-hover:text-white"}`} />
              <span className="font-bold text-sm">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto space-y-2 border-t border-white/5">
        <Link 
          href="https://poller-web.vercel.app" 
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all font-bold text-sm"
        >
          <Globe className="w-5 h-5" />
          Back to Website
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold text-sm"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

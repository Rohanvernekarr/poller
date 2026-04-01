"use client";

import { useSession } from "next-auth/react";
import { User } from "lucide-react";

export function UserNav() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div className="flex items-center gap-3 p-2 bg-white/5 rounded-xl border border-white/5 shadow-inner">
      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center p-1.5 border border-primary/20 transition-transform group-hover:scale-105">
        <User className="w-full h-full text-primary" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-black uppercase tracking-wider text-white truncate max-w-[120px]">
          {session.user.name || "Admin"}
        </span>
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
          {(session.user as any).role || "ADMIN"}
        </span>
      </div>
    </div>
  );
}

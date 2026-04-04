"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useState, useEffect, useRef } from "react";
import { Search, Filter, Loader2 } from "lucide-react";
import { Input } from "@repo/ui/input";

interface PollsSearchBarProps {
  defaultSearch: string;
  defaultFilter: boolean;
}

export function PollsSearchBar({ defaultSearch, defaultFilter }: PollsSearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(defaultSearch);
  const [suspiciousOnly, setSuspiciousOnly] = useState(defaultFilter);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) params.set("search", search);
      else params.delete("search");
      
      params.set("page", "1");
      
      if (suspiciousOnly) params.set("filter", "suspicious");
      else params.delete("filter");
      
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    }, 350);
    return () => clearTimeout(timeout);
  }, [search, suspiciousOnly, pathname, router]);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="relative w-full max-w-sm group">
        {isPending
          ? <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 animate-spin" />
          : <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
        }
        <Input
          placeholder="Search polls by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-white/5 border-white/5 text-white transition-all focus:bg-white/10"
        />
      </div>
      <button
        onClick={() => setSuspiciousOnly(!suspiciousOnly)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-xs font-black uppercase tracking-widest ${
          suspiciousOnly
            ? "bg-red-500/20 text-red-400 border-red-500/20"
            : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
        }`}
      >
        <Filter className="w-3.5 h-3.5" />
        {suspiciousOnly ? "Suspicious Only" : "Filter Suspicious"}
      </button>
    </div>
  );
}

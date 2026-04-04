"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  total: number;
  page: number;
  pageSize: number;
  paramName?: string;
}

export function Pagination({ total, page, pageSize, paramName = "page" }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / pageSize);

  const navigate = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramName, String(p));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">
        {total.toLocaleString()} total · page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => navigate(page - 1)}
          disabled={page === 1}
          className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-1 text-gray-600 text-xs">…</span>
          ) : (
            <button
              key={p}
              onClick={() => navigate(p as number)}
              className={`h-8 w-8 text-xs font-black rounded-lg border transition-all ${
                p === page
                  ? "bg-white text-black border-white"
                  : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => navigate(page + 1)}
          disabled={page === totalPages}
          className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

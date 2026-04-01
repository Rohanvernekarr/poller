"use client";

import { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@repo/ui/table";
import { Button } from "@repo/ui/button";
import { Trash2, AlertTriangle, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@repo/ui/input";

interface PollsManagerProps {
  initialPolls: any[];
}

export function PollsManager({ initialPolls }: PollsManagerProps) {
  const [polls, setPolls] = useState(initialPolls);
  const [search, setSearch] = useState("");
  const [suspiciousOnly, setSuspiciousOnly] = useState(false);

  const filteredPolls = polls.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const isSuspicious = !p.allowMultipleVotes && p.suspiciousScore > 20;
    return matchesSearch && (!suspiciousOnly || isSuspicious);
  });

  const handleDeletePoll = async (id: string) => {
    if (!confirm("Are you sure you want to delete this poll? All votes and comments will be lost.")) return;
    try {
      const res = await fetch(`/api/polls/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPolls(polls.filter((p: any) => p.id !== id));
      } else {
        alert("Failed to delete poll");
      }
    } catch (e) {
      alert("Error deleting poll");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full max-w-sm group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
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
          {suspiciousOnly ? "Suspicious Activity Active" : "Filter Suspicious"}
        </button>
      </div>

      <div className="glass-card overflow-hidden !p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead>Poll Title</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Votes</TableHead>
              <TableHead className="text-center">Security Status</TableHead>
              <TableHead className="text-right px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPolls.map((poll) => (
              <TableRow key={poll.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                <TableCell className="font-bold text-white max-w-[300px] truncate px-4">
                  {poll.title}
                </TableCell>
                <TableCell className="text-gray-500 font-medium whitespace-nowrap">
                  {format(new Date(poll.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right font-black text-white px-1">
                  {poll.totalVotes.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center items-center">
                    {!poll.allowMultipleVotes && poll.suspiciousScore > 20 ? (
                      <div className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full flex items-center gap-1.5 font-black text-[10px] uppercase">
                        <AlertTriangle className="w-3 h-3" />
                        {poll.suspiciousScore}% Duplicates
                      </div>
                    ) : (
                      <div className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-[10px] uppercase font-black">
                        Secure
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right px-6">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeletePoll(poll.id)}
                    className="h-9 w-9 p-0 bg-white/5 hover:bg-red-500/10 text-gray-500 hover:text-red-400 border border-white/5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredPolls.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-gray-500 font-medium italic">
                  No polls found matching your current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@repo/ui/table";
import { Button } from "@repo/ui/button";
import { Trash2, AlertTriangle, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { DeletePollModal } from "./DeletePollModal";
import Link from "next/link";

interface Poll {
  id: string;
  title: string;
  createdAt: Date;
  totalVotes: number;
  suspiciousScore: number;
  allowMultipleVotes: boolean;
}

interface PollsManagerProps {
  polls: Poll[];
}

export function PollsManager({ polls: initialPolls }: PollsManagerProps) {
  const [polls, setPolls] = useState(initialPolls);
  const [pollToDelete, setPollToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync state with server props
  useEffect(() => {
    setPolls(initialPolls);
  }, [initialPolls]);

  const confirmDelete = async () => {
    if (!pollToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/polls/${pollToDelete}`, { method: "DELETE" });
      if (res.ok) {
        setPolls(polls.filter((p) => p.id !== pollToDelete));
        setPollToDelete(null);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="glass-card overflow-hidden !p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead>Poll Title</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Votes</TableHead>
              <TableHead className="text-center">Security</TableHead>
              <TableHead className="text-right px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {polls.map((poll) => (
              <TableRow key={poll.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                <TableCell className="font-bold text-white max-w-[280px] truncate px-4">{poll.title}</TableCell>
                <TableCell className="text-gray-500 font-medium whitespace-nowrap">
                  {format(new Date(poll.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right font-black text-white px-1">
                  {poll.totalVotes.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    {!poll.allowMultipleVotes && poll.suspiciousScore > 20 ? (
                      <div className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full flex items-center gap-1.5 font-black text-[10px] uppercase">
                        <AlertTriangle className="w-3 h-3" />
                        {poll.suspiciousScore}% Dupe
                      </div>
                    ) : (
                      <div className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-[10px] uppercase font-black">
                        Secure
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right px-6">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/polls/${poll.id}`}>
                      <Button variant="ghost" size="sm" className="h-9 px-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 text-[10px] font-black uppercase tracking-widest gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5" /> View
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => setPollToDelete(poll.id)}
                      className="h-9 w-9 p-0 bg-white/5 hover:bg-red-500/10 text-gray-500 hover:text-red-400 border border-white/5">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {polls.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-gray-500 font-medium italic">
                  No polls found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DeletePollModal
        isOpen={!!pollToDelete}
        onClose={() => setPollToDelete(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}

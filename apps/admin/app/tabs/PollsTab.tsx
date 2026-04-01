"use client";

import { Button } from "@repo/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@repo/ui/table";
import { Trash2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface PollsTabProps {
  polls: any[];
  onDeletePoll: (id: string) => void;
}

export function PollsTab({ polls, onDeletePoll }: PollsTabProps) {
  return (
    <div className="glass rounded-xl overflow-hidden border border-white/10 shadow-xl animate-in slide-in-from-bottom-4 duration-300">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Poll Title</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Votes</TableHead>
            <TableHead className="text-center">Suspicious Score</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {polls.map((poll) => (
            <TableRow key={poll.id}>
              <TableCell className="font-bold text-white max-w-[250px] truncate">
                {poll.title}
              </TableCell>
              <TableCell className="text-gray-500 whitespace-nowrap">
                {format(new Date(poll.createdAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-right font-black text-white">
                {poll.totalVotes.toLocaleString()}
              </TableCell>
              <TableCell>
                <div className="flex justify-center items-center">
                  {!poll.allowMultipleVotes && poll.suspiciousScore > 20 ? (
                    <div className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full flex items-center gap-1.5 font-black text-[10px] uppercase">
                      <AlertTriangle className="w-3 h-3" />
                      {poll.suspiciousScore}% Duplicate IPs
                    </div>
                  ) : (
                    <span className="text-gray-500 text-xs text-center">Clean</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDeletePoll(poll.id)}
                  className="text-gray-500 hover:text-red-400 h-8 w-8 p-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {polls.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                No polls found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

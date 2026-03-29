"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { format } from "date-fns";
import { Trash2, AlertTriangle, Activity } from "lucide-react";

type Poll = {
  id: string;
  title: string;
  createdAt: Date;
  totalVotes: number;
  suspiciousScore: number;
  allowMultipleVotes: boolean;
};

export function DashboardClient({ 
  initialPolls, 
  totalVotes, 
  totalPolls 
}: { 
  initialPolls: Poll[], 
  totalVotes: number, 
  totalPolls: number 
}) {
  const [polls, setPolls] = useState<Poll[]>(initialPolls);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this poll? All votes will be lost.")) return;
    
    try {
      const res = await fetch(`/api/polls/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPolls(polls.filter(p => p.id !== id));
      } else {
        alert("Failed to delete poll");
      }
    } catch (e) {
      alert("Error deleting poll");
    }
  };

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="glass shadow-[0_0_30px_-5px_rgba(99,102,241,0.2)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-400">Total Polls</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-white">{polls.length}</div>
          </CardContent>
        </Card>
        
        <Card className="glass shadow-[0_0_30px_-5px_rgba(236,72,153,0.2)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-400">Total Votes Cast</CardTitle>
            <Activity className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-white">{polls.reduce((acc, p) => acc + p.totalVotes, 0).toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Polls Table */}
      <h2 className="text-xl font-bold mt-12 mb-4 tracking-tight">Recent Polls</h2>
      <div className="glass rounded-xl overflow-hidden border border-white/10 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 bg-white/5 uppercase border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Poll Title</th>
                <th className="px-6 py-4 font-semibold">Created</th>
                <th className="px-6 py-4 font-semibold text-right">Votes</th>
                <th className="px-6 py-4 font-semibold text-center">Suspicious Score</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {polls.map((poll) => (
                <tr key={poll.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white truncate max-w-[200px]">
                    {poll.title}
                  </td>
                  <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                    {format(new Date(poll.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold">
                    {poll.totalVotes.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 pb-2">
                    <div className="flex justify-center items-center">
                      {!poll.allowMultipleVotes && poll.suspiciousScore > 20 ? (
                        <div className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full flex items-center gap-1.5 font-medium text-xs">
                          <AlertTriangle className="w-3 h-3" />
                          {poll.suspiciousScore}% Duplicate IPs
                        </div>
                      ) : (
                        <span className="text-gray-500 text-xs">Clean</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(poll.id)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {polls.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No polls have been created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

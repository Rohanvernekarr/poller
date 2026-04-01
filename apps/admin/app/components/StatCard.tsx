"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: "blue" | "pink" | "indigo" | "amber";
}

export function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const colorMap = {
    blue: "shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)]",
    pink: "shadow-[0_0_30px_-5px_rgba(236,72,153,0.2)]",
    indigo: "shadow-[0_0_30px_-5px_rgba(99,102,241,0.2)]",
    amber: "shadow-[0_0_30px_-5px_rgba(245,158,11,0.2)]",
  };

  return (
    <Card className={`glass border-white/10 ${colorMap[color]}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-gray-400">
        <CardTitle className="text-xs font-black uppercase tracking-wider">{title}</CardTitle>
        <Icon className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black text-white">{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  );
}

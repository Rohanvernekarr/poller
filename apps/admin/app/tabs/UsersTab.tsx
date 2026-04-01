"use client";

import { Button } from "@repo/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@repo/ui/table";
import { Settings, ShieldAlert, ShieldCheck } from "lucide-react";

interface UsersTabProps {
  users: any[];
  onEditUser: (user: any) => void;
  onToggleBlock: (user: any) => void;
}

export function UsersTab({ users, onEditUser, onToggleBlock }: UsersTabProps) {
  return (
    <div className="glass rounded-xl overflow-hidden border border-white/10 shadow-xl animate-in slide-in-from-bottom-4 duration-300">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-center">Polls</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-bold text-white">{user.name || "Anonymous"}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  user.role === "ADMIN" ? "bg-primary/20 text-primary border border-primary/20" : "bg-white/10 text-gray-400 border border-white/10"
                }`}>
                  {user.role}
                </span>
              </TableCell>
              <TableCell className="text-center font-mono font-bold text-white">
                {user._count?.polls ?? 0}
              </TableCell>
              <TableCell>
                <div className={`flex items-center gap-1.5 text-xs font-medium ${user.isBlocked ? "text-red-400" : "text-green-400"}`}>
                  {user.isBlocked ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                  {user.isBlocked ? "Blocked" : "Active"}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEditUser(user)} className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onToggleBlock(user)} 
                    className={`h-8 px-2 text-xs font-bold ${user.isBlocked ? "text-green-400 hover:bg-green-400/10" : "text-red-400 hover:bg-red-400/10"}`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

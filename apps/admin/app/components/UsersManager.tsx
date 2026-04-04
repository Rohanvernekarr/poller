"use client";

import { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@repo/ui/table";
import { Button } from "@repo/ui/button";
import { Settings, ShieldAlert, ShieldCheck, ExternalLink } from "lucide-react";
import { EditUserModal } from "./EditUserModal";
import Link from "next/link";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  isBlocked: boolean;
  createdAt: Date;
  _count: { polls: number };
}

interface UsersManagerProps {
  users: User[];
}

export function UsersManager({ users: initialUsers }: UsersManagerProps) {
  const [users, setUsers] = useState(initialUsers);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const handleToggleBlock = async (user: User) => {
    const newStatus = !user.isBlocked;
    const res = await fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBlocked: newStatus }),
    });
    if (res.ok) {
      setUsers(users.map((u) => (u.id === user.id ? { ...u, isBlocked: newStatus } : u)));
    }
  };

  return (
    <>
      <div className="glass-card overflow-hidden !p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-center">Polls</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                <TableCell>
                  <div className="flex flex-col px-1">
                    <span className="font-bold text-white">{user.name || "Anonymous"}</span>
                    <span className="text-xs text-gray-500 font-medium">{user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    user.role === "ADMIN" ? "bg-primary/20 text-white border border-white/20" : "bg-white/10 text-gray-400 border border-white/10"
                  }`}>
                    {user.role}
                  </span>
                </TableCell>
                <TableCell className="text-center font-mono font-bold text-white">
                  {user._count?.polls ?? 0}
                </TableCell>
                <TableCell>
                  <div className={`flex items-center gap-2 text-xs font-bold ${user.isBlocked ? "text-red-400" : "text-green-400"}`}>
                    {user.isBlocked ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    <span className="uppercase tracking-tighter">{user.isBlocked ? "Blocked" : "Active"}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right px-6">
                  <div className="flex justify-end gap-2">
                    <Link href={`/users/${user.id}`}>
                       <Button variant="ghost" size="sm" className="h-9 px-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 text-[10px] font-black uppercase tracking-widest gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5" /> View
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => setEditingUser(user)}
                      className="h-9 w-9 p-0 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5">
                      <Settings className="w-4 h-4" />
                    </Button>
                    {/* <Button variant="ghost" size="sm" onClick={() => handleToggleBlock(user)}
                      className={`h-9 px-4 text-xs font-black uppercase tracking-widest border border-current/20 transition-all ${
                        user.isBlocked ? "text-green-400 hover:bg-green-400/10" : "text-red-400 hover:bg-red-400/10"
                      }`}>
                      {user.isBlocked ? "Unblock" : "Block"}
                    </Button> */}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-gray-500 font-medium italic">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <EditUserModal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser}
        onSave={(updated) => setUsers(users.map((u) => (u.id === updated.id ? updated : u)))}
      />
    </>
  );
}

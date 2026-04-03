"use client";

import { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@repo/ui/table";
import { Button } from "@repo/ui/button";
import { Settings, ShieldAlert, ShieldCheck, Search, Eye } from "lucide-react";
import { EditUserModal } from "./EditUserModal";
import Link from "next/link";
import { Input } from "@repo/ui/input";

interface UsersManagerProps {
  initialUsers: any[];
}

export function UsersManager({ initialUsers }: UsersManagerProps) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleBlock = async (user: any) => {
    const newStatus = !user.isBlocked;
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: newStatus })
      });
      if (res.ok) {
        setUsers(users.map((u: any) => u.id === user.id ? { ...u, isBlocked: newStatus } : u));
      } else {
        alert("Failed to update user status");
      }
    } catch (e) {
      alert("Error updating user status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full max-w-sm group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
          <Input 
            placeholder="Search users by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/5 text-white transition-all focus:bg-white/10"
          />
        </div>
      </div>

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
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                <TableCell>
                  <div className="flex flex-col px-1">
                    <span className="font-bold text-white selection:bg-white selection:text-black">
                      {user.name || "Anonymous"}
                    </span>
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
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-9 w-9 p-0 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => { setEditingUser(user); setIsEditModalOpen(true); }} 
                      className="h-9 w-9 p-0 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleToggleBlock(user)} 
                      className={`h-9 px-4 text-xs font-black uppercase tracking-widest border border-current/20 transition-all ${
                        user.isBlocked ? "text-green-400 hover:bg-green-400/10" : "text-red-400 hover:bg-red-400/10"
                      }`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-gray-500 font-medium italic">
                  No users found matching your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <EditUserModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        user={editingUser} 
        onSave={(updated) => setUsers(users.map((u: any) => u.id === updated.id ? updated : u))}
      />
    </div>
  );
}

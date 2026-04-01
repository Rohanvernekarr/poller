"use client";

import { useState } from "react";
import { Layers, Users, Vote, Database } from "lucide-react";
import { OverviewTab } from "./tabs/OverviewTab";
import { UsersTab } from "./tabs/UsersTab";
import { PollsTab } from "./tabs/PollsTab";
import { SystemTab } from "./tabs/SystemTab";
import { EditUserModal } from "./components/EditUserModal";

export function DashboardClient({ 
  initialPolls, 
  initialUsers,
  totalVotes, 
  totalPolls,
  totalUsers,
  totalAccounts,
  totalSessions
}: any) {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "polls" | "system">("overview");
  const [polls, setPolls] = useState(initialPolls);
  const [users, setUsers] = useState(initialUsers);
  
  // User Edit Modal State
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDeletePoll = async (id: string) => {
    if (!confirm("Are you sure you want to delete this poll? All votes and comments will be lost.")) return;
    try {
      const res = await fetch(`/api/polls/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPolls(polls.filter((p: any) => p.id !== id));
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || "Failed to delete poll. You may not have administrative permissions.");
      }
    } catch (e) { 
      console.error("Delete poll error:", e);
      alert("Network error: Could not complete the deletion.");
    }
  };

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
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || "Failed to update user status.");
      }
    } catch (e) { 
      console.error("Block user error:", e);
      alert("Network error: Could not update user status.");
    }
  };

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
        activeTab === id 
        ? "bg-white/10 text-white shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)] border border-white/10" 
        : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-xl border border-white/5 w-fit">
        <TabButton id="overview" label="Overview" icon={Layers} />
        <TabButton id="users" label="Users" icon={Users} />
        <TabButton id="polls" label="Polls" icon={Vote} />
        <TabButton id="system" label="System" icon={Database} />
      </div>

      {activeTab === "overview" && (
        <OverviewTab 
          polls={polls} users={users} totalVotes={totalVotes} 
          totalSessions={totalSessions} totalAccounts={totalAccounts} 
        />
      )}

      {activeTab === "users" && (
        <UsersTab 
          users={users} 
          onEditUser={(u) => { setEditingUser(u); setIsEditModalOpen(true); }} 
          onToggleBlock={handleToggleBlock} 
        />
      )}

      {activeTab === "polls" && (
        <PollsTab polls={polls} onDeletePoll={handleDeletePoll} />
      )}

      {activeTab === "system" && (
        <SystemTab 
          totalAccounts={totalAccounts} totalSessions={totalSessions} 
          totalUsers={totalUsers} totalPolls={totalPolls} totalVotes={totalVotes} 
        />
      )}

      <EditUserModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        user={editingUser} 
        onSave={(updated) => setUsers(users.map((u: any) => u.id === updated.id ? updated : u))}
      />
    </div>
  );
}

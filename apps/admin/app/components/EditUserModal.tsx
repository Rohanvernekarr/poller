"use client";

import { useEffect, useState } from "react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Dialog } from "@repo/ui/dialog";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSave: (updatedUser: any) => void;
}

export function EditUserModal({ isOpen, onClose, user, onSave }: EditUserModalProps) {
  const [form, setForm] = useState({ name: "", role: "", isBlocked: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        role: user.role,
        isBlocked: user.isBlocked
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      
      if (res.ok) {
        const updatedUser = await res.json();
        onSave(updatedUser);
        onClose();
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || "Failed to update user. Ensure you have administrative permissions.");
      }
    } catch (e) {
      console.error("Update user error:", e);
      alert("Network error: Could not complete the update.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose}
      title="Edit User Details"
      description="Update user profile information and administrative status."
    >
      <div className="space-y-6 pt-4">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-gray-500">Name</label>
          <Input 
            value={form.name} 
            onChange={(e) => setForm({...form, name: e.target.value})}
            className="bg-white/5 border-white/10 text-white font-medium"
            placeholder="User Name"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-gray-500">Role</label>
          <select 
            value={form.role} 
            onChange={(e) => setForm({...form, role: e.target.value})}
            className="w-full h-10 px-3 flex items-center bg-white/5 border border-white/10 rounded-lg text-white font-medium focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
          >
            <option value="USER" className="bg-gray-900">USER</option>
            <option value="ADMIN" className="bg-gray-900">ADMIN</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="space-y-0.5">
            <div className="text-sm font-bold text-white">Block Account</div>
            <div className="text-xs text-gray-500">Prevent this user from logging in.</div>
          </div>
          <button 
            onClick={() => setForm({...form, isBlocked: !form.isBlocked})}
            className={`w-12 h-6 rounded-full transition-colors relative ${form.isBlocked ? "bg-red-500" : "bg-white/10"}`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${form.isBlocked ? "translate-x-6" : ""}`} />
          </button>
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={onClose} variant="ghost" className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading} className="flex-1 bg-primary hover:bg-primary/90 text-white">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

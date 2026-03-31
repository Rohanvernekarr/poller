"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignOutModal({ isOpen, onClose }: SignOutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-sm glass rounded-[2.5rem] p-8 shadow-2xl border-border bg-background/50"
          >
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                <LogOut className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">Sign Out?</h3>
                <p className="text-foreground/40 font-medium leading-relaxed">
                  You'll need to sign back in to create more polls or view your dashboard.
                </p>
              </div>

              <div className="flex flex-col w-full gap-3">
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full bg-red-500 text-white h-14 rounded-2xl font-black uppercase tracking-widest hover:bg-red-600 transition-all active:scale-[0.98] shadow-xl shadow-red-500/20 px-6"
                >
                  Confirm Sign Out
                </button>
                <button 
                  onClick={onClose}
                  className="w-full bg-transparent text-foreground/40 h-14 rounded-2xl font-black uppercase tracking-widest hover:text-foreground transition-all px-6 border border-border"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

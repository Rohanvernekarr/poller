"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

interface DeletePollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeletePollModal({ isOpen, onClose, onConfirm, isDeleting }: DeletePollModalProps) {
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
                <Trash2 className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">Delete Poll?</h3>
                <p className="text-foreground/40 font-medium leading-relaxed text-sm">
                  This action is permanent. All votes, responses, and comments linked to this poll will be lost forever.
                </p>
              </div>

              <div className="flex flex-col w-full gap-3">
                <button 
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="w-full bg-red-500 text-white h-14 rounded-2xl font-black uppercase tracking-widest hover:bg-red-600 transition-all active:scale-[0.98] shadow-xl shadow-red-500/20 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </button>
                <button 
                  onClick={onClose}
                  disabled={isDeleting}
                  className="w-full bg-transparent text-foreground/40 h-14 rounded-2xl font-black uppercase tracking-widest hover:text-foreground transition-all px-6 border border-border disabled:opacity-50"
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

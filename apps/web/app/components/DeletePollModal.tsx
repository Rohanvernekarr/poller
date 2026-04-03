"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

interface DeletePollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeletePollModal({ isOpen, onClose, onConfirm, isDeleting }: DeletePollModalProps) {
  const [input, setInput] = useState("");
  const confirmed = input.toUpperCase() === "DELETE";

  // Reset input whenever modal opens
  useEffect(() => {
    if (isOpen) setInput("");
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isDeleting ? onClose : undefined}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-sm glass rounded-[2.5rem] p-8 shadow-2xl border border-border bg-background/50"
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

              {/* Confirmation input */}
              <div className="w-full space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30">
                  Type <span className="text-red-500 font-black">DELETE</span> to confirm
                </label>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="DELETE"
                  disabled={isDeleting}
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full h-12 px-4 rounded-2xl border border-foreground/10 bg-foreground/[0.03] text-foreground font-black uppercase tracking-widest text-sm focus:outline-none focus:border-red-500/30 transition-all placeholder:text-foreground/15 disabled:opacity-50"
                />
              </div>

              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={confirmed ? onConfirm : undefined}
                  disabled={!confirmed || isDeleting}
                  className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-xl px-6 ${
                    confirmed
                      ? "bg-red-500 text-white hover:bg-red-600 shadow-red-500/20"
                      : "bg-foreground/5 text-foreground/20 cursor-not-allowed shadow-none"
                  }`}
                >
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </button>
                <button
                  onClick={onClose}
                  disabled={isDeleting}
                  className="w-full bg-transparent text-foreground/40 h-12 rounded-2xl font-black uppercase tracking-widest hover:text-foreground transition-all px-6 border border-border disabled:opacity-50"
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

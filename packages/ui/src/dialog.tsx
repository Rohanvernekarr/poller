"use client";

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "./utils"

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: DialogProps) {
  // Prevent scrolling when dialog is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "relative w-full max-w-lg glass border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50",
              className
            )}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                {title && (
                  <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
                )}
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {description && (
                <p className="text-sm text-gray-400 mb-6">{description}</p>
              )}
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface TechnicalBackButtonProps {
  href: string;
  text: string;
}

export function TechnicalBackButton({ href, text }: TechnicalBackButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-4"
    >
      <Link 
        href={href}
        className="inline-flex items-center gap-2 text-foreground/40 hover:text-foreground transition-all group"
      >
        <div className="w-8 h-8 rounded-lg border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        </div>
        <span className="text-[11px] font-black uppercase tracking-widest italic">{text}</span>
      </Link>
    </motion.div>
  );
}

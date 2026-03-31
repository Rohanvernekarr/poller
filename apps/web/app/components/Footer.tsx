"use client";

import { Globe, Mail, MessageSquare, Zap } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-background pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-2 space-y-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-foreground flex items-center justify-center rounded-xl shadow-lg group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 text-background fill-background" />
            </div>
            <span className="text-2xl font-black uppercase tracking-tight italic">Poller</span>
          </Link>
          <p className="text-foreground/40 max-w-xs font-medium leading-relaxed">
            The simplest polling platform.
          </p>
          <div className="flex gap-4">
            <SocialLink icon={<Globe className="w-4 h-4" />} />
            <SocialLink icon={<Mail className="w-4 h-4" />} />
            <SocialLink icon={<MessageSquare className="w-4 h-4" />} />
          </div>
        </div>
        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground/30 italic">Platform</h4>
          <ul className="space-y-4">
            <FooterLink text="Create Poll" href="/create" />
            <FooterLink text="Dashboard" href="/dashboard" />
          </ul>
        </div>
        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground/30 italic">Legal</h4>
          <ul className="space-y-4">
            <FooterLink text="Privacy" href="/privacy" />
            <FooterLink text="Terms" href="/terms" />
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-border flex justify-between items-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-foreground/20 italic">
          © {new Date().getFullYear()} Poller.
        </p>
        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20 italic">
          v1.0.0
        </span>
      </div>
    </footer>
  );
}

function FooterLink({ text, href }: { text: string; href: string }) {
  return (
    <li>
      <Link href={href} className="text-sm font-black uppercase tracking-tight text-foreground/50 hover:text-foreground transition-all flex items-center group gap-2 italic">
        <span className="w-0 group-hover:w-2 h-px bg-foreground transition-all" />
        {text}
      </Link>
    </li>
  );
}

function SocialLink({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="p-3 rounded-xl bg-foreground/5 border border-border text-foreground/40 hover:text-foreground hover:bg-foreground/10 transition-all cursor-pointer">
      {icon}
    </div>
  );
}

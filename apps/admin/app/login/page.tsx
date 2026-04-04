"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@repo/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("admin@poller.com");
  const [password, setPassword] = useState("supersecret");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      username,
      password,
      redirect: true,
      callbackUrl: "/",
    });

    if (res?.error) {
      setError("Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 selection:bg-white selection:text-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[400px]"
      >
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)]">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">
              Poller<span className="text-zinc-600 not-italic">.admin</span>
            </h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">
              Secure Authentication Required
            </p>
          </div>

          <div className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-red-500 bg-red-500/5 border border-red-500/20 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center"
                >
                  {error}
                </motion.div>
              )}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Username / Email</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin@poller.com"
                    required
                    className="w-full h-14 bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-700 rounded-2xl px-6 focus:outline-none focus:border-zinc-500 focus:bg-zinc-800 transition-all font-bold text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Access Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-14 bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-700 rounded-2xl px-6 focus:outline-none focus:border-zinc-500 focus:bg-zinc-800 transition-all font-bold text-sm"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  isLoading={loading}
                  className="w-full h-14 bg-white text-black hover:bg-zinc-200 border-none rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all active:scale-[0.97]"
                >
                  Authorize Access
                </Button>
              </div>
            </form>
          </div>

          <div className="pt-12 border-t border-zinc-900 space-y-6">
             <p className="text-center text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed">
               By accessing the admin dashboard, you agree to our <Link href="/terms-of-use" className="underline hover:text-white transition-colors">Internal Usage Policy</Link> and <Link href="/privacy-policy" className="underline hover:text-white transition-colors">Privacy Standards</Link>.
             </p>
             <div className="flex justify-center items-center gap-4 text-zinc-700">
               <span className="h-px w-8 bg-zinc-800" />
               <p className="text-[10px] uppercase tracking-widest font-black">
                 Poller Admin System v4.0.2
               </p>
               <span className="h-px w-8 bg-zinc-800" />
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


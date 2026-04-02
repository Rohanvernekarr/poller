"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@repo/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const callbackUrlParam = searchParams.get("callbackUrl") || "/";
  
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push("/signin");
    }
  }, [email, router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || token.length < 6) return;

    setIsLoading(true);
    setError(null);
    try {
      const verifyUrl = `/api/auth/callback/email?email=${encodeURIComponent(email as string)}&token=${token}&callbackUrl=${encodeURIComponent(callbackUrlParam)}`;
      window.location.href = verifyUrl;
      setSuccess(true);
    } catch (err: any) {
      setError("Invalid or expired code.");
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 -mt-16 selection:bg-white selection:text-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[380px] text-center"
      >
        <div className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tighter text-white">Security Code</h1>
            <p className="text-zinc-500 text-sm font-medium tracking-tight">
              Enter the code sent to <br/>
              <span className="text-zinc-200 font-bold">{email}</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-8">
            <div className="relative group mx-auto max-w-[280px]">
              <input
                type="text"
                maxLength={6}
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-6 text-center text-3xl font-black tracking-[0.4rem] text-white focus:outline-none focus:border-zinc-500 focus:bg-zinc-800 transition-all placeholder:text-zinc-800"
                autoFocus
              />
              <div className="absolute inset-x-6 -bottom-px h-px bg-gradient-to-r from-transparent via-zinc-500 to-transparent opacity-0 group-focus-within:opacity-100 transition-all duration-500" />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            <Button 
              type="submit" 
              className="w-full h-14 bg-white text-black border-none font-black text-base rounded-2xl hover:bg-zinc-200 transition-all active:scale-[0.97]"
              isLoading={isLoading}
              disabled={isLoading || token.length < 6 || success}
            >
              Confirm
            </Button>
          </form>

          <Link href="/signin" className="inline-flex items-center gap-2 text-[10px] font-black text-zinc-600 hover:text-white transition-colors uppercase tracking-[0.3em] group">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Use a different email
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <VerifyContent />
    </Suspense>
  );
}

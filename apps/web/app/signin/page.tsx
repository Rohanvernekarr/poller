"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@repo/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await signIn("email", { email, redirect: false, callbackUrl });
      router.push(`/verify?email=${encodeURIComponent(email)}&callbackUrl=${encodeURIComponent(callbackUrl)}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 -mt-16 selection:bg-white selection:text-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[380px]"
      >
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-black tracking-tighter text-white">Poller</h1>
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-[0.3em]">Sign in to continue</p>
          </div>

          <div className="space-y-6">
            <Button 
              variant="outline" 
              className="w-full h-14 flex items-center justify-center gap-4 bg-white text-black hover:bg-zinc-200 border-none rounded-2xl font-black text-sm shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all active:scale-[0.97]"
              onClick={handleGoogleSignIn}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z" fill="currentColor"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/><path d="M0 0h24v24H0z" fill="none"/>
              </svg>
              Continue with Google
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-[8px] uppercase tracking-[0.4em] font-black">
                <span className="bg-black px-6 text-zinc-600">or use email</span>
              </div>
            </div>

            <form onSubmit={handleEmailSignIn} className="space-y-3">
              <div className="space-y-2">
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full h-12 bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 rounded-xl px-6 focus:outline-none focus:border-zinc-500 focus:bg-zinc-800 transition-all text-center font-bold text-sm tracking-tight"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 font-black text-sm rounded-xl bg-zinc-100 text-black border-none hover:bg-white transition-all active:scale-[0.97]"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Sign In
              </Button>
            </form>
          </div>
          
          <div className="pt-6 border-t border-zinc-900 space-y-4">
             <p className="text-center text-[11px] text-zinc-500 uppercase tracking-widest leading-relaxed">
               By signing in, you agree to our <Link href="/terms-of-use" className="underline hover:text-white transition-colors">Terms of Use</Link> and <Link href="/privacy-policy" className="underline hover:text-white transition-colors">Privacy Policy</Link>.
             </p>
             <p className="text-center text-[10px] text-zinc-700 uppercase tracking-widest font-bold">
               Private by Design • Privacy first
             </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <SignInForm />
    </Suspense>
  );
}

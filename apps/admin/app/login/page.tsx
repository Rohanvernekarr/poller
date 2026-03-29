"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@repo/ui/card";
import { motion } from "framer-motion";

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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] opacity-30 pointer-events-none blur-[100px]">
        <div className="absolute inset-0 bg-primary/5 rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md px-6 relative z-10"
      >
        <Card className="glass border-border shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-black mb-2">Poller Admin</CardTitle>
            <CardDescription>Secure login for platform administrators.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-red-400 bg-red-400/10 border border-red-400/20 p-3 rounded-xl text-sm font-medium text-center">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Username</label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@poller.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="pt-4">
                <Button type="submit" size="lg" className="w-full text-lg shadow-xl dark:shadow-white/10 shadow-black/10" isLoading={loading}>
                  Sign in
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

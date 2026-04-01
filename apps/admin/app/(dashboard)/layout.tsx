"use client";

import { AdminSidebar } from "../components/AdminSidebar";
import { MobileHeader } from "../components/MobileHeader";
import { SessionProvider } from "next-auth/react";
import { motion } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-black text-white">
        <AdminSidebar />
        <MobileHeader />

        <main className="lg:pl-64 pt-16 lg:pt-0 min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </SessionProvider>
  );
}

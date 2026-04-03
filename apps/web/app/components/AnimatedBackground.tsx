"use client";

import { motion } from "framer-motion";

const BLOBS = [
  {
    width: 800,
    height: 600,
    style: { top: "-10%", left: "-5%" },
    animate: { x: [0, 50, -30, 0], y: [0, 40, -20, 0] },
    duration: 28,
    delay: 0,
  },
  {
    width: 700,
    height: 700,
    style: { bottom: "-15%", right: "-10%" },
    animate: { x: [0, -40, 20, 0], y: [0, -30, 25, 0] },
    duration: 34,
    delay: 5,
  },
  {
    width: 500,
    height: 400,
    style: { top: "30%", right: "15%" },
    animate: { x: [0, 30, -20, 0], y: [0, -30, 20, 0] },
    duration: 22,
    delay: 10,
  },
];

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {BLOBS.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: blob.width,
            height: blob.height,
            ...blob.style,
            background:
              "radial-gradient(ellipse at center, hsl(var(--foreground) / 0.07) 0%, hsl(var(--foreground) / 0.02) 45%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={blob.animate}
          transition={{
            duration: blob.duration,
            delay: blob.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

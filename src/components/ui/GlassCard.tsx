"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  variant?: "default" | "strong" | "subtle";
  hover?: boolean;
  className?: string;
}

const variantStyles = {
  default: "glass-card",
  strong: "glass-card-strong",
  subtle: "bg-white/60 backdrop-blur-md border border-white/20 rounded-3xl",
};

export default function GlassCard({
  children,
  variant = "default",
  hover = true,
  className = "",
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={`${variantStyles[variant]} ${className}`}
      whileHover={hover ? { y: -4, boxShadow: "0 32px 64px -16px rgba(37,99,235,0.15)" } : undefined}
      transition={{ duration: 0.25, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

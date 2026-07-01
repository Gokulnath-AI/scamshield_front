"use client";

import { type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

interface GlassPanelProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  variant?: "default" | "strong" | "subtle";
  hover?: boolean;
  className?: string;
  noise?: boolean;
}

const variantClass = {
  default: "glass",
  strong: "glass-strong",
  subtle: "glass-subtle",
};

export default function GlassPanel({
  children,
  variant = "default",
  hover = true,
  className = "",
  noise = false,
  ...props
}: GlassPanelProps) {
  return (
    <motion.div
      className={`${variantClass[variant]} ${noise ? "noise relative" : ""} ${className}`}
      whileHover={
        hover
          ? { y: -4, boxShadow: "0 20px 48px rgba(37,99,235,0.12)" }
          : undefined
      }
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      {...props}
    >
      {noise && <div className="relative z-10">{children}</div>}
      {!noise && children}
    </motion.div>
  );
}

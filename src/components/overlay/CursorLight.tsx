"use client";

import { useAppStore } from "@/stores/useAppStore";

export default function CursorLight() {
  const { x, y } = useAppStore((s) => s.cursorPosition);

  return (
    <div
      className="cursor-light hidden md:block"
      style={{ left: x, top: y }}
    />
  );
}

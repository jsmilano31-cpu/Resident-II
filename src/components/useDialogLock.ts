"use client";
import { useEffect } from "react";
export function useDialogLock(open: boolean) {
 useEffect(() => {
  if (!open) return;
  const previous = document.documentElement.style.overflow;
  document.documentElement.style.overflow = "hidden";
  return () => { document.documentElement.style.overflow = previous; };
 }, [open]);
}

"use client";
import { useEffect, useState } from "react";

/** Delay visual feedback, never execution or duplicate-submission protection. */
export function useDelayedPending(pending: boolean, delay = 600) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!pending) return;
    const timer = setTimeout(() => setVisible(true), delay);
    return () => { clearTimeout(timer); setVisible(false); };
  }, [pending, delay]);
  return pending && visible;
}

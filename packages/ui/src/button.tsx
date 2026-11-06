"use client";
import type { ComponentProps } from "react";
import { useDelayedPending } from "./use-delayed-pending";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
  loading?: boolean;
  loadingLabel?: string;
};

export function Button({ variant = "secondary", loading = false, loadingLabel = "Working…",
  type = "button", disabled, className = "", children, ...props }: ButtonProps) {
  const visible = useDelayedPending(loading);
  return <button {...props} type={type} className={`ui-button ${className}`} data-variant={variant}
    data-progress={visible || undefined} disabled={disabled || loading} aria-busy={loading || undefined}>
    <span className="ui-button-label">{children}</span>
    {visible ? <span className="ui-button-progress" aria-hidden="true">{loadingLabel}</span> : null}
  </button>;
}

"use client";

import { useOptionalDictionary } from "@/lib/i18n/dictionary-context";
import { useState } from "react";

const stripeFallback = {
  checkoutError: "Could not start checkout",
  networkError: "Network error. Please try again later.",
  loading: "Redirecting to payment…",
} as const;

type StripeCheckoutButtonProps = {
  type: string;
  amount?: number;
  projectId?: string;
  label: string;
  className?: string;
  variant?: "primary" | "secondary";
};

export function StripeCheckoutButton({
  type,
  amount,
  projectId,
  label,
  className = "",
  variant = "primary",
}: StripeCheckoutButtonProps) {
  const dict = useOptionalDictionary();
  const t = dict?.billing.stripe ?? stripeFallback;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseClass =
    variant === "primary"
      ? "rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
      : "rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50";

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, amount, projectId }),
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setError(data.error ?? t.checkoutError);
    } catch {
      setError(t.networkError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {error && (
        <p className="mb-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`${baseClass} ${className}`}
      >
        {loading ? t.loading : label}
      </button>
    </div>
  );
}

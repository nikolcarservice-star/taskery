"use client";

import { useEffect } from "react";

type ExternalLeaveAutoRedirectProps = {
  targetUrl: string;
  label: string;
};

export function ExternalLeaveAutoRedirect({
  targetUrl,
  label,
}: ExternalLeaveAutoRedirectProps) {
  useEffect(() => {
    window.location.replace(targetUrl);
  }, [targetUrl]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
      <p className="mt-4 text-sm text-zinc-600">{label}</p>
    </div>
  );
}

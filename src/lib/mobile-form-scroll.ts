"use client";

import type { FocusEvent } from "react";

export function scrollFieldIntoView(event: FocusEvent<HTMLElement>) {
  window.requestAnimationFrame(() => {
    event.target.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  });
}

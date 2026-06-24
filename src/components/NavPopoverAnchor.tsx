"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const CLOSE_DELAY_MS = 250;

type NavPopoverAnchorProps = {
  children: ReactNode;
  panel: ReactNode;
  /** When false, children handle clicks (e.g. navigate to inbox). Popover opens on hover only. */
  toggleOnClick?: boolean;
};

export function NavPopoverAnchor({
  children,
  panel,
  toggleOnClick = true,
}: NavPopoverAnchorProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const show = useCallback(() => {
    cancelClose();
    setOpen(true);
  }, [cancelClose]);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
    }, CLOSE_DELAY_MS);
  }, [cancelClose]);

  const toggle = useCallback(() => {
    setOpen((value) => !value);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={scheduleClose}
    >
      <div
        onClick={toggleOnClick ? toggle : undefined}
        aria-expanded={open}
      >
        {children}
      </div>

      {open ? (
        <div
          className="absolute right-0 top-[calc(100%-2px)] z-[60] w-[min(360px,calc(100vw-2rem))] pt-1"
          onMouseEnter={show}
          onMouseLeave={scheduleClose}
        >
          {panel}
        </div>
      ) : null}
    </div>
  );
}

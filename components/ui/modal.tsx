"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { X } from "lucide-react";

import { transitionPremium } from "@/lib/motion";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  widthClassName?: string;
}

const panelVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

/**
 * Wraps the native <dialog> element: free focus trap, Escape-to-close, and
 * backdrop dismissal, with no extra dependency. Rendered through a portal to
 * document.body so a <form> inside the modal never ends up nested inside an
 * ancestor <form> (invalid HTML — the proposal page itself is one big form).
 */
export function Modal({ open, onClose, title, description, children, widthClassName }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // document.body only exists on the client; this is the standard
    // SSR-safe gate before portaling, not derived/computed state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, mounted]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose, mounted]);

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) {
      onClose();
    }
  }

  if (!mounted) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="m-auto max-h-[85vh] w-[calc(100vw-2rem)] rounded-2xl border border-border-strong bg-transparent p-0 backdrop:bg-black/70 backdrop:backdrop-blur-sm open:flex open:flex-col"
    >
      <motion.div
        initial="hidden"
        animate={open ? "visible" : "hidden"}
        variants={panelVariants}
        transition={transitionPremium}
        className={`flex max-h-[85vh] w-full flex-col overflow-hidden rounded-2xl border border-border-strong bg-[#131115]/95 shadow-[var(--shadow-elevated)] backdrop-blur-2xl ${widthClassName ?? "sm:w-[38rem]"}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold tracking-tight text-foreground">{title}</h2>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          <button
            type="button"
            aria-label="Fermer"
            onClick={onClose}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-white/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </motion.div>
    </dialog>,
    document.body
  );
}

"use client";

import { ArrowDown, ArrowUp, ChevronUp, Pencil, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

import { IconButton } from "@/components/ui/icon-button";

interface CollapsibleRowProps {
  summary: ReactNode;
  isOpen: boolean;
  onToggleOpen: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  editLabel?: string;
  removeLabel?: string;
  moveUpLabel?: string;
  moveDownLabel?: string;
  children: ReactNode;
}

export function CollapsibleRow({
  summary,
  isOpen,
  onToggleOpen,
  onMoveUp,
  onMoveDown,
  onRemove,
  canMoveUp,
  canMoveDown,
  editLabel = "Modifier",
  removeLabel = "Supprimer",
  moveUpLabel = "Monter",
  moveDownLabel = "Descendre",
  children,
}: CollapsibleRowProps) {
  return (
    <div className="rounded-lg border border-border">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">{summary}</div>
        <div className="flex shrink-0 items-center gap-1">
          <IconButton type="button" label={moveUpLabel} onClick={onMoveUp} disabled={!canMoveUp}>
            <ArrowUp className="h-4 w-4" />
          </IconButton>
          <IconButton
            type="button"
            label={moveDownLabel}
            onClick={onMoveDown}
            disabled={!canMoveDown}
          >
            <ArrowDown className="h-4 w-4" />
          </IconButton>
          <IconButton
            type="button"
            label={editLabel}
            onClick={onToggleOpen}
            aria-expanded={isOpen}
          >
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          </IconButton>
          <IconButton type="button" label={removeLabel} variant="danger" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </div>
      </div>
      {isOpen && <div className="border-t border-border px-4 py-4">{children}</div>}
    </div>
  );
}

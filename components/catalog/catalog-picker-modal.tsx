"use client";

import { useState } from "react";

import { CatalogItemChecklist } from "@/components/catalog/catalog-item-checklist";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { CatalogItem } from "@/features/catalog/types";

interface CatalogPickerModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  items: CatalogItem[];
  categories: readonly string[];
  onConfirm: (selected: CatalogItem[]) => void;
  confirmLabelPrefix: string;
}

export function CatalogPickerModal({
  open,
  onClose,
  title,
  description,
  items,
  categories,
  onConfirm,
  confirmLabelPrefix,
}: CatalogPickerModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [wasOpen, setWasOpen] = useState(open);

  // Reset the selection whenever the modal transitions to open, following
  // React's "adjust state during render" pattern instead of an effect.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setSelectedIds([]);
  }

  function toggle(id: string) {
    setSelectedIds((previous) =>
      previous.includes(id) ? previous.filter((existing) => existing !== id) : [...previous, id]
    );
  }

  function handleConfirm() {
    const selected = items.filter((item) => selectedIds.includes(item.id));
    onConfirm(selected);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={title} description={description}>
      <div className="flex flex-col gap-4">
        <CatalogItemChecklist
          items={items}
          categories={categories}
          selectedIds={selectedIds}
          onToggle={toggle}
          emptyLabel="Aucun élément actif dans la bibliothèque."
        />
        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={selectedIds.length === 0}>
            {confirmLabelPrefix} ({selectedIds.length})
          </Button>
        </div>
      </div>
    </Modal>
  );
}

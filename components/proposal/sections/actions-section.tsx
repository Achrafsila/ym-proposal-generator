"use client";

import { AlertTriangle, Eye, FileDown, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/section-card";

interface ActionsSectionProps {
  isGenerating: boolean;
  error: string | null;
  overflowWarning: string | null;
  onPreview: () => void;
  onReset: () => void;
}

export function ActionsSection({
  isGenerating,
  error,
  overflowWarning,
  onPreview,
  onReset,
}: ActionsSectionProps) {
  return (
    <SectionCard title="Actions">
      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={onPreview}>
          <Eye className="h-4 w-4" />
          Prévisualiser
        </Button>
        <Button type="submit" disabled={isGenerating}>
          <FileDown className="h-4 w-4" />
          {isGenerating ? "Génération en cours…" : "Générer le PDF"}
        </Button>
        <Button type="button" variant="outline" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
          Réinitialiser
        </Button>
      </div>
      {overflowWarning && (
        <p
          className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800"
          role="alert"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          {overflowWarning}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </SectionCard>
  );
}

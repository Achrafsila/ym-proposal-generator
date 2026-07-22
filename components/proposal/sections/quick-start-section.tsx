"use client";

import { Save } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import type { ProposalTemplate } from "@/features/templates/types";

interface QuickStartSectionProps {
  templates: ProposalTemplate[];
  selectedTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
  loadedTemplateName: string | null;
  onSaveAsTemplate: (name: string, sector: string) => void;
}

export function QuickStartSection({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  loadedTemplateName,
  onSaveAsTemplate,
}: QuickStartSectionProps) {
  const [isSaveModalOpen, setSaveModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");

  function handleSaveSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !sector.trim()) return;
    onSaveAsTemplate(name.trim(), sector.trim());
    setSaveModalOpen(false);
    setName("");
    setSector("");
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <FormField
          label="Démarrer à partir d'un modèle"
          htmlFor="quick-start-template"
          className="sm:max-w-sm sm:flex-1"
        >
          <Select
            id="quick-start-template"
            value={selectedTemplateId}
            onChange={(event) => onSelectTemplate(event.target.value)}
          >
            <option value="">Proposition vide</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name} ({template.sector})
              </option>
            ))}
          </Select>
        </FormField>
        <Button type="button" variant="outline" onClick={() => setSaveModalOpen(true)}>
          <Save className="h-4 w-4" />
          Enregistrer comme modèle
        </Button>
      </div>

      {loadedTemplateName && (
        <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-foreground">
          Modèle « {loadedTemplateName} » chargé — les informations du client restent vides.
        </p>
      )}

      <Modal
        open={isSaveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        title="Enregistrer comme modèle"
        description="Les informations du client ne seront pas enregistrées."
      >
        <form onSubmit={handleSaveSubmit} className="flex flex-col gap-4">
          <FormField label="Nom du modèle" htmlFor="save-template-name" required>
            <Input
              id="save-template-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoFocus
            />
          </FormField>
          <FormField label="Secteur" htmlFor="save-template-sector" required>
            <Input
              id="save-template-sector"
              value={sector}
              onChange={(event) => setSector(event.target.value)}
            />
          </FormField>
          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={() => setSaveModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

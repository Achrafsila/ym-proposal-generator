"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { ProposalDocument } from "@/components/proposal/proposal-document";
import { ProposalPreviewFrame } from "@/components/proposal/proposal-preview-frame";
import { ActionsSection } from "@/components/proposal/sections/actions-section";
import { ClientSection } from "@/components/proposal/sections/client-section";
import { FinancialSection } from "@/components/proposal/sections/financial-section";
import { OfferSection } from "@/components/proposal/sections/offer-section";
import { OptionsSection } from "@/components/proposal/sections/options-section";
import { ProjectSection } from "@/components/proposal/sections/project-section";
import { QuickStartSection } from "@/components/proposal/sections/quick-start-section";
import { TermsSection } from "@/components/proposal/sections/terms-section";
import { Button } from "@/components/ui/button";
import { buildProposalValuesFromTemplate } from "@/features/proposal/apply-template";
import {
  clearDraft,
  loadDraft,
  saveDraft,
} from "@/features/proposal/services/proposal-draft-storage";
import { buildTemplateInputFromProposal } from "@/features/proposal/save-as-template";
import { templateStorage } from "@/features/templates/services/template-storage";
import { useTemplateStorage } from "@/features/templates/use-template-storage";
import { buildDocumentData } from "@/lib/build-document-data";
import { createDefaultProposalValues } from "@/lib/default-values";
import { buildProposalFilename } from "@/lib/filename";
import { countOverflowingPages } from "@/lib/measure-overflow";
import type { ProposalFormValues } from "@/lib/proposal-schema";
import { proposalSchema } from "@/lib/proposal-schema";
import { generateReference } from "@/lib/reference";

function ProposalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { templates } = useTemplateStorage();

  const [reference, setReference] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [loadedTemplateName, setLoadedTemplateName] = useState<string | null>(null);
  const [overflowingPages, setOverflowingPages] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewMeasureRef = useRef<HTMLDivElement>(null);

  const methods = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: createDefaultProposalValues(),
    mode: "onBlur",
  });

  const { handleSubmit, watch, reset, getValues } = methods;
  const values = watch();

  const documentData = useMemo(
    () => buildDocumentData(values, reference),
    [values, reference]
  );

  // Initial load: a `?useTemplate=` link from the Templates page takes
  // priority over any saved draft (explicit intent to start fresh from a
  // template). Otherwise, restore the last draft if there is one.
  useEffect(() => {
    setReference(generateReference());

    const templateId = searchParams.get("useTemplate");
    if (templateId) {
      const template = templateStorage.getById(templateId);
      if (template) {
        reset(buildProposalValuesFromTemplate(template));
        setSelectedTemplateId(template.id);
        setLoadedTemplateName(template.name);
      }
      router.replace("/");
      return;
    }

    const draft = loadDraft();
    if (draft) reset(draft);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => saveDraft(values), 400);
    return () => clearTimeout(timeout);
  }, [values]);

  useEffect(() => {
    const container = previewMeasureRef.current;
    if (!container) return;

    const measure = () => setOverflowingPages(countOverflowingPages(container));
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  function handleSelectTemplate(templateId: string) {
    if (!templateId) {
      reset(createDefaultProposalValues());
      setSelectedTemplateId("");
      setLoadedTemplateName(null);
      return;
    }
    const template = templateStorage.getById(templateId);
    if (!template) return;
    reset(buildProposalValuesFromTemplate(template));
    setSelectedTemplateId(template.id);
    setLoadedTemplateName(template.name);
  }

  function handleSaveAsTemplate(name: string, sector: string) {
    const input = buildTemplateInputFromProposal(getValues(), name, sector);
    templateStorage.add(input);
    window.alert(`Modèle « ${name} » enregistré.`);
  }

  async function handlePreview() {
    await methods.trigger();
    previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleReset() {
    const confirmed = window.confirm(
      "Réinitialiser le formulaire ? Toutes les données saisies seront perdues."
    );
    if (!confirmed) return;
    clearDraft();
    reset(createDefaultProposalValues());
    setSelectedTemplateId("");
    setLoadedTemplateName(null);
    setGenerationError(null);
  }

  async function onGenerate(data: ProposalFormValues) {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values: data, reference }),
      });

      if (!response.ok) {
        throw new Error("La génération du PDF a échoué. Veuillez réessayer.");
      }

      const blob = await response.blob();
      const filename = buildProposalFilename(data.client.name, data.client.quoteDate);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : "Erreur inconnue.");
    } finally {
      setIsGenerating(false);
    }
  }

  const overflowWarning =
    overflowingPages > 0
      ? `Le contenu dépasse la taille d'une page A4 sur ${overflowingPages} section${
          overflowingPages > 1 ? "s" : ""
        } : le PDF généré comportera probablement plus de 4 pages.`
      : null;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onGenerate)}
        className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start lg:gap-10"
      >
        <div className="flex flex-col gap-6">
          <QuickStartSection
            templates={templates}
            selectedTemplateId={selectedTemplateId}
            onSelectTemplate={handleSelectTemplate}
            loadedTemplateName={loadedTemplateName}
            onSaveAsTemplate={handleSaveAsTemplate}
          />
          <ClientSection />
          <ProjectSection />
          <OfferSection />
          <OptionsSection />
          <FinancialSection totals={documentData.totals} />
          <TermsSection />
          <ActionsSection
            isGenerating={isGenerating}
            error={generationError}
            overflowWarning={overflowWarning}
            onPreview={handlePreview}
            onReset={handleReset}
          />
        </div>

        <div ref={previewRef} className="flex flex-col gap-4 lg:sticky lg:top-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                Aperçu de la proposition
              </h2>
              <p className="text-xs text-muted-foreground">
                Ce rendu correspond fidèlement au PDF généré (4 pages A4 maximum).
              </p>
            </div>
            <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent-soft sm:inline-flex">
              Aperçu en direct
            </span>
          </div>
          <div
            ref={previewMeasureRef}
            className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-elevated)] backdrop-blur-xl sm:p-6"
          >
            <ProposalPreviewFrame>
              <ProposalDocument data={documentData} />
            </ProposalPreviewFrame>
          </div>

          <Button
            type="submit"
            disabled={isGenerating}
            className="fixed bottom-6 right-6 z-40 hidden shadow-[0_16px_40px_-12px_rgba(212,175,106,0.6)] lg:inline-flex"
          >
            <FileDown className="h-4 w-4" />
            {isGenerating ? "Génération…" : "Générer le PDF"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <ProposalPage />
    </Suspense>
  );
}

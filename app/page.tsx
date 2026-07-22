"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { ProposalDocument } from "@/components/proposal/proposal-document";
import { ProposalPreviewFrame } from "@/components/proposal/proposal-preview-frame";
import { ActionsSection } from "@/components/proposal/sections/actions-section";
import { ClientSection } from "@/components/proposal/sections/client-section";
import { FinancialSection } from "@/components/proposal/sections/financial-section";
import { OptionsSection } from "@/components/proposal/sections/options-section";
import { ProjectSection } from "@/components/proposal/sections/project-section";
import { ServicesSection } from "@/components/proposal/sections/services-section";
import { TermsSection } from "@/components/proposal/sections/terms-section";
import { Monogram } from "@/components/ui/monogram";
import { buildDocumentData } from "@/lib/build-document-data";
import { createDefaultProposalValues } from "@/lib/default-values";
import { buildProposalFilename } from "@/lib/filename";
import type { ProposalFormValues } from "@/lib/proposal-schema";
import { proposalSchema } from "@/lib/proposal-schema";
import { generateReference } from "@/lib/reference";
import { siteConfig } from "@/config/site";

const DRAFT_STORAGE_KEY = "ym-proposal-draft";

function loadDraft(): ProposalFormValues | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ProposalFormValues;
  } catch {
    return null;
  }
}

export default function Home() {
  const [reference, setReference] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const methods = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: createDefaultProposalValues(),
    mode: "onBlur",
  });

  const { handleSubmit, watch, reset } = methods;
  const values = watch();

  const documentData = useMemo(
    () => buildDocumentData(values, reference),
    [values, reference]
  );

  useEffect(() => {
    setReference(generateReference());
    const draft = loadDraft();
    if (draft) reset(draft);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(values));
    }, 400);
    return () => clearTimeout(timeout);
  }, [values]);

  async function handlePreview() {
    await methods.trigger();
    previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleReset() {
    const confirmed = window.confirm(
      "Réinitialiser le formulaire ? Toutes les données saisies seront perdues."
    );
    if (!confirmed) return;
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    reset(createDefaultProposalValues());
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

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/60 px-4 py-4 sm:px-6 lg:px-10">
          <div className="mx-auto flex max-w-7xl items-center gap-3">
            <Monogram />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">{siteConfig.name}</span>
              <span className="text-xs text-muted-foreground">{siteConfig.productName}</span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
          <form
            onSubmit={handleSubmit(onGenerate)}
            className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start lg:gap-10"
          >
            <div className="flex flex-col gap-6">
              <ClientSection />
              <ProjectSection />
              <ServicesSection />
              <OptionsSection />
              <FinancialSection totals={documentData.totals} />
              <TermsSection />
              <ActionsSection
                isGenerating={isGenerating}
                error={generationError}
                onPreview={handlePreview}
                onReset={handleReset}
              />
            </div>

            <div ref={previewRef} className="flex flex-col gap-4 lg:sticky lg:top-8">
              <div className="flex flex-col gap-1">
                <h2 className="text-sm font-semibold text-foreground">
                  Aperçu de la proposition
                </h2>
                <p className="text-xs text-muted-foreground">
                  Ce rendu correspond fidèlement au PDF généré (4 pages A4 maximum).
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                <ProposalPreviewFrame>
                  <ProposalDocument data={documentData} />
                </ProposalPreviewFrame>
              </div>
            </div>
          </form>
        </main>
      </div>
    </FormProvider>
  );
}

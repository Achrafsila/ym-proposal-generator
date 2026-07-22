import { DEFAULT_TEMPLATES } from "@/features/templates/default-templates";
import type { ProposalTemplate } from "@/features/templates/types";

export const TEMPLATE_STORAGE_KEY = "ym-proposal-templates-v1";

type NewTemplateInput = Omit<ProposalTemplate, "id" | "createdAt" | "updatedAt">;

function nowISO(): string {
  return new Date().toISOString();
}

function generateId(): string {
  const random = Math.random().toString(36).slice(2, 8);
  return `template-${Date.now().toString(36)}-${random}`;
}

function readAll(): ProposalTemplate[] {
  if (typeof window === "undefined") return DEFAULT_TEMPLATES;
  try {
    const raw = window.localStorage.getItem(TEMPLATE_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(DEFAULT_TEMPLATES));
      return DEFAULT_TEMPLATES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_TEMPLATES;
    return parsed as ProposalTemplate[];
  } catch {
    return DEFAULT_TEMPLATES;
  }
}

function writeAll(templates: ProposalTemplate[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
}

function getAll(): ProposalTemplate[] {
  return [...readAll()];
}

function getById(id: string): ProposalTemplate | undefined {
  return getAll().find((template) => template.id === id);
}

function add(input: NewTemplateInput): ProposalTemplate {
  const timestamp = nowISO();
  const template: ProposalTemplate = {
    ...input,
    id: generateId(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  writeAll([...getAll(), template]);
  return template;
}

function update(id: string, patch: Partial<NewTemplateInput>): ProposalTemplate | undefined {
  let updated: ProposalTemplate | undefined;
  const next = getAll().map((template) => {
    if (template.id !== id) return template;
    updated = { ...template, ...patch, updatedAt: nowISO() };
    return updated;
  });
  writeAll(next);
  return updated;
}

function duplicate(id: string): ProposalTemplate | undefined {
  const source = getById(id);
  if (!source) return undefined;
  return add({
    name: `${source.name} (copie)`,
    sector: source.sector,
    projectTitle: source.projectTitle,
    projectContext: source.projectContext,
    projectObjectives: source.projectObjectives,
    timeline: source.timeline,
    serviceIds: [...source.serviceIds],
    optionIds: [...source.optionIds],
    terms: { ...source.terms },
    financialDefaults: { ...source.financialDefaults },
  });
}

function remove(id: string): void {
  writeAll(getAll().filter((template) => template.id !== id));
}

function resetToDefaults(): void {
  writeAll(DEFAULT_TEMPLATES);
}

export const templateStorage = {
  getAll,
  getById,
  add,
  update,
  duplicate,
  remove,
  resetToDefaults,
};

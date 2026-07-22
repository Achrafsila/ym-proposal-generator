import type { ProposalFormValues } from "@/lib/proposal-schema";

export const DRAFT_STORAGE_KEY = "ym-proposal-draft-v1";
const LEGACY_DRAFT_STORAGE_KEY = "ym-proposal-draft";

/**
 * v1 stored the draft under `ym-proposal-draft` (unversioned). The proposal
 * schema hasn't changed shape, so a straight copy into the versioned key is
 * safe. Runs once per session, only when the new key is still empty.
 */
function migrateLegacyDraftIfNeeded(): void {
  if (typeof window === "undefined") return;
  try {
    const current = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (current) return;
    const legacy = window.localStorage.getItem(LEGACY_DRAFT_STORAGE_KEY);
    if (!legacy) return;
    window.localStorage.setItem(DRAFT_STORAGE_KEY, legacy);
  } catch {
    // Storage unavailable — nothing to migrate.
  }
}

export function loadDraft(): ProposalFormValues | null {
  if (typeof window === "undefined") return null;
  migrateLegacyDraftIfNeeded();
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ProposalFormValues;
  } catch {
    return null;
  }
}

export function saveDraft(values: ProposalFormValues): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(values));
  } catch {
    // Storage unavailable — draft simply won't persist.
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DRAFT_STORAGE_KEY);
}

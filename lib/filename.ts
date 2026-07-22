const COMBINING_DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");

export function slugifyForFilename(input: string): string {
  return input
    .normalize("NFD")
    .replace(COMBINING_DIACRITICS, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function buildProposalFilename(clientName: string, quoteDate: string): string {
  const namePart = slugifyForFilename(clientName || "") || "Client";
  const datePart = /^\d{4}-\d{2}-\d{2}$/.test(quoteDate)
    ? quoteDate
    : new Date().toISOString().slice(0, 10);
  return `YM-Studio-Proposition-${namePart}-${datePart}.pdf`;
}

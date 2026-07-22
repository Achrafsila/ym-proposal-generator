import fs from "node:fs";
import path from "node:path";

import type { ProposalDocumentData } from "@/lib/build-document-data";
import { buildProposalDocumentHtml } from "@/lib/proposal-html-template";

const CSS_PATH = path.join(
  process.cwd(),
  "components/proposal/proposal-document.css"
);

export function renderProposalHtml(data: ProposalDocumentData): string {
  const markup = buildProposalDocumentHtml(data);
  const css = fs.readFileSync(CSS_PATH, "utf-8");

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>Proposition YM Studio</title>
    <style>${css}</style>
  </head>
  <body>${markup}</body>
</html>`;
}

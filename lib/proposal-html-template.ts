import type { ProposalDocumentData } from "@/lib/build-document-data";
import { escapeHtml } from "@/lib/escape-html";
import { formatCurrency, formatDateFR } from "@/lib/format";
import { YM_LOGO_BLACK_DATA_URI, YM_LOGO_WHITE_DATA_URI } from "@/lib/proposal-logo-assets";

const APPROACH_COPY =
  "Chez YM Studio, nous concevons des expériences digitales sur mesure, en alliant un design premium, une exécution technique soignée et un accompagnement personnalisé à chaque étape du projet. Notre objectif est de livrer un résultat à la hauteur de votre image de marque, dans les délais convenus.";

const COVER_FONT_STACK =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

function coverArtHtml(): string {
  return `
    <svg class="proposal-cover-art" viewBox="0 0 210 297" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <radialGradient id="coverGlowGold" cx="82%" cy="18%" r="55%">
          <stop offset="0%" stop-color="#c9a45c" stop-opacity="0.22" />
          <stop offset="45%" stop-color="#c9a45c" stop-opacity="0.08" />
          <stop offset="100%" stop-color="#c9a45c" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="coverGlowAmber" cx="12%" cy="88%" r="50%">
          <stop offset="0%" stop-color="#7c5a2a" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#7c5a2a" stop-opacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="210" height="297" fill="#0a0a0c" />
      <rect x="0" y="0" width="210" height="297" fill="url(#coverGlowGold)" />
      <rect x="0" y="0" width="210" height="297" fill="url(#coverGlowAmber)" />

      <line x1="-20" y1="95" x2="230" y2="30" stroke="#c9a45c" stroke-opacity="0.14" stroke-width="0.6" />

      <line x1="18" y1="0" x2="18" y2="297" stroke="#c9a45c" stroke-opacity="0.08" stroke-width="0.15" />
      <line x1="192" y1="0" x2="192" y2="297" stroke="#c9a45c" stroke-opacity="0.08" stroke-width="0.15" />
      <line x1="0" y1="24" x2="210" y2="24" stroke="#c9a45c" stroke-opacity="0.08" stroke-width="0.15" stroke-dasharray="1 2" />
      <line x1="0" y1="273" x2="210" y2="273" stroke="#c9a45c" stroke-opacity="0.08" stroke-width="0.15" stroke-dasharray="1 2" />

      <g stroke="#c9a45c" stroke-opacity="0.22" stroke-width="0.25" fill="none">
        <path d="M12,20 L12,12 L20,12" />
        <path d="M190,12 L198,12 L198,20" />
        <path d="M198,277 L198,285 L190,285" />
        <path d="M20,285 L12,285 L12,277" />
      </g>

      <text x="150" y="215" text-anchor="middle" font-family="${COVER_FONT_STACK}" font-weight="700" font-size="150" fill="#f5efe3" fill-opacity="0.05">YM</text>
    </svg>`;
}

function esc(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === "") return "";
  return escapeHtml(String(value));
}

function fallback(value: string | undefined | null): string {
  const escaped = esc(value);
  return escaped || "—";
}

/**
 * Official YM Studio logo — white-on-transparent on dark backgrounds
 * (the cover), black-on-transparent everywhere else (interior pages,
 * headers, footers, signatures). `height: auto` and no other sizing keep
 * the original proportions intact; only `width` varies by context, and
 * `object-fit: contain` (in CSS) guarantees it's never stretched.
 */
function logoMarkHtml(variant: "white" | "black", widthPx: number): string {
  const src = variant === "white" ? YM_LOGO_WHITE_DATA_URI : YM_LOGO_BLACK_DATA_URI;
  return `<img src="${src}" alt="YM Studio" class="proposal-logo" style="width:${widthPx}px" />`;
}

function brandHeader(dark = false): string {
  return `
    <div class="proposal-header">
      ${dark ? logoMarkHtml("white", 210) : logoMarkHtml("black", 110)}
    </div>`;
}

function coverPageHtml(data: ProposalDocumentData): string {
  const { client, project, reference } = data;

  const validityRow = client.validityPeriod
    ? `<div>
        <p class="proposal-cover-meta-label">Validité de l'offre</p>
        <p class="proposal-cover-meta-value">${esc(client.validityPeriod)}</p>
      </div>`
    : "";

  return `
  <section class="proposal-page proposal-cover">
    ${coverArtHtml()}
    <div class="proposal-cover-content">
      ${brandHeader(true)}
      <div class="proposal-cover-title">
        <p class="proposal-eyebrow">Proposition commerciale</p>
        <h1 class="proposal-cover-project">${fallback(project.title) === "—" ? "Projet à définir" : esc(project.title)}</h1>
        <p class="proposal-cover-for-label proposal-muted">Préparé exclusivement pour</p>
        <p class="proposal-cover-for-company">${fallback(client.company)}</p>
        <p class="proposal-cover-for-name proposal-muted">${fallback(client.name)}</p>
      </div>
      <div class="proposal-cover-meta">
        <div>
          <p class="proposal-cover-meta-label">Client</p>
          <p class="proposal-cover-meta-value">${fallback(client.name)}</p>
        </div>
        <div>
          <p class="proposal-cover-meta-label">Société / Cabinet</p>
          <p class="proposal-cover-meta-value">${fallback(client.company)}</p>
        </div>
        <div>
          <p class="proposal-cover-meta-label">Date</p>
          <p class="proposal-cover-meta-value">${esc(formatDateFR(client.quoteDate))}</p>
        </div>
        <div>
          <p class="proposal-cover-meta-label">Référence</p>
          <p class="proposal-cover-meta-value">${esc(reference)}</p>
        </div>
        ${validityRow}
      </div>
      <p class="proposal-cover-footer">YM Studio — Proposition commerciale confidentielle</p>
    </div>
  </section>`;
}

function missionPageHtml(data: ProposalDocumentData): string {
  const { project } = data;

  return `
  <section class="proposal-page">
    ${brandHeader()}
    <hr class="proposal-rule" />
    <h2 class="proposal-heading">Présentation de la mission</h2>

    <p class="proposal-subheading">Besoin du client</p>
    <p class="proposal-prewrap">${fallback(project.context)}</p>

    <p class="proposal-subheading">Objectifs</p>
    <p class="proposal-prewrap">${fallback(project.objectives)}</p>

    <p class="proposal-subheading">Notre approche</p>
    <div class="proposal-approach">
      <p class="proposal-muted">${esc(APPROACH_COPY)}</p>
    </div>

    <div class="proposal-info-grid">
      <div class="proposal-info-box">
        <p class="proposal-cover-meta-label">Délai estimatif</p>
        <p class="proposal-cover-meta-value">${fallback(project.timeline)}</p>
      </div>
    </div>

    <div class="proposal-page-footer">
      <hr class="proposal-rule proposal-footer-rule" />
      <div class="proposal-page-footer-row">
        ${logoMarkHtml("black", 80)}
        <span>Référence ${esc(data.reference)}</span>
      </div>
    </div>
  </section>`;
}

function offerPageHtml(data: ProposalDocumentData): string {
  const { services, financial, totals } = data;

  const servicesBlock = financial.showPriceDetails
    ? `
    <table class="proposal-table">
      <thead>
        <tr>
          <th>Prestation</th>
          <th class="num">Qté</th>
          <th class="num">P.U.</th>
          <th class="num">Total</th>
        </tr>
      </thead>
      <tbody>
        ${services
          .map(
            (service) => `
        <tr>
          <td>
            <div>${fallback(service.name)}</div>
            ${
              service.description
                ? `<div class="proposal-muted" style="font-size:9pt">${esc(service.description)}</div>`
                : ""
            }
          </td>
          <td class="num">${esc(service.quantity)}</td>
          <td class="num">${esc(formatCurrency(service.unitPrice))}</td>
          <td class="num">${esc(formatCurrency(service.quantity * service.unitPrice))}</td>
        </tr>`
          )
          .join("")}
        <!-- Kept in tbody, not tfoot: a <tfoot> repeats at the bottom of
             every page a table spans, which would show this grand total
             prematurely before the last rows. -->
        <tr class="proposal-table-total-row">
          <td colspan="3">Total de l'offre principale</td>
          <td class="num">${esc(formatCurrency(totals.servicesSubtotal))}</td>
        </tr>
      </tbody>
    </table>`
    : `
    <div class="proposal-global-amount">
      <span>Offre principale</span>
      <span class="value">${esc(formatCurrency(totals.servicesSubtotal))}</span>
    </div>`;

  return `
  <section class="proposal-page">
    ${brandHeader()}
    <hr class="proposal-rule" />
    <h2 class="proposal-heading">Offre proposée</h2>
    ${servicesBlock}

    <div class="proposal-page-footer">
      <hr class="proposal-rule proposal-footer-rule" />
      <div class="proposal-page-footer-row">
        ${logoMarkHtml("black", 80)}
        <span>Référence ${esc(data.reference)}</span>
      </div>
    </div>
  </section>`;
}

function optionsAndTermsPageHtml(data: ProposalDocumentData): string {
  const { financial, terms, totals, reference, options } = data;
  const includedOptions = options.filter((option) => option.selected);
  const futureOptions = options.filter((option) => !option.selected);

  const includedOptionsBlock =
    includedOptions.length > 0
      ? `
    <table class="proposal-table">
      <thead>
        <tr>
          <th>Option</th>
          <th class="num">Prix</th>
        </tr>
      </thead>
      <tbody>
        ${includedOptions
          .map(
            (option) => `
        <tr>
          <td>
            <div>${fallback(option.name)}</div>
            ${
              option.description
                ? `<div class="proposal-muted" style="font-size:9pt">${esc(option.description)}</div>`
                : ""
            }
          </td>
          <td class="num">${esc(formatCurrency(option.price))}</td>
        </tr>`
          )
          .join("")}
        <tr class="proposal-table-total-row">
          <td>Total options incluses</td>
          <td class="num">${esc(formatCurrency(totals.optionsTotal))}</td>
        </tr>
      </tbody>
    </table>`
      : `<p class="proposal-muted">Aucune option incluse dans cette proposition.</p>`;

  const futureOptionsBlock =
    financial.showFutureOptionsInPdf && futureOptions.length > 0
      ? `
    <p class="proposal-subheading">Options non incluses (possibilités futures)</p>
    <table class="proposal-table">
      <thead>
        <tr>
          <th>Option</th>
          <th class="num">Prix indicatif</th>
        </tr>
      </thead>
      <tbody>
        ${futureOptions
          .map(
            (option) => `
        <tr>
          <td>
            <div>${fallback(option.name)}</div>
            ${
              option.description
                ? `<div class="proposal-muted" style="font-size:9pt">${esc(option.description)}</div>`
                : ""
            }
          </td>
          <td class="num">${esc(formatCurrency(option.price))}</td>
        </tr>`
          )
          .join("")}
      </tbody>
    </table>`
      : "";

  const discountRow =
    totals.discountAmount > 0
      ? `
    <div class="proposal-recap-row">
      <span class="proposal-muted">Remise</span>
      <span>- ${esc(formatCurrency(totals.discountAmount))}</span>
    </div>`
      : "";

  const notesBlock = terms.additionalNotes
    ? `
    <p class="proposal-subheading">Remarques complémentaires</p>
    <p class="proposal-prewrap">${esc(terms.additionalNotes)}</p>`
    : "";

  return `
  <section class="proposal-page">
    ${brandHeader()}
    <hr class="proposal-rule" />
    <h2 class="proposal-heading">Options et conditions</h2>

    <p class="proposal-subheading">Options incluses</p>
    ${includedOptionsBlock}
    ${futureOptionsBlock}

    <div class="proposal-recap">
      ${discountRow}
      <div class="proposal-recap-row emphasis">
        <span>Total HT</span>
        <span>${esc(formatCurrency(totals.totalHT))}</span>
      </div>
      <div class="proposal-recap-row">
        <span class="proposal-muted">TVA (${esc(financial.tvaRate)}%)</span>
        <span>${esc(formatCurrency(totals.tvaAmount))}</span>
      </div>
      <div class="proposal-recap-row emphasis">
        <span>Total TTC</span>
        <span class="proposal-accent">${esc(formatCurrency(totals.totalTTC))}</span>
      </div>
      <div class="proposal-recap-row">
        <span class="proposal-muted">Acompte</span>
        <span>${esc(formatCurrency(totals.depositAmount))}</span>
      </div>
      <div class="proposal-recap-row emphasis">
        <span>Solde restant</span>
        <span>${esc(formatCurrency(totals.balanceDue))}</span>
      </div>
    </div>

    <p class="proposal-subheading">Modalités de paiement</p>
    <p class="proposal-prewrap">${fallback(terms.paymentTerms)}</p>

    <p class="proposal-subheading">Conditions commerciales</p>
    <dl class="proposal-terms-grid">
      <div>
        <dt>Délai de réalisation</dt>
        <dd>${fallback(terms.completionTime)}</dd>
      </div>
      <div>
        <dt>Modifications incluses</dt>
        <dd>${fallback(terms.revisionsIncluded)}</dd>
      </div>
      <div>
        <dt>Durée de l'hébergement</dt>
        <dd>${fallback(terms.hostingDuration)}</dd>
      </div>
      <div>
        <dt>Maintenance et support</dt>
        <dd>${fallback(terms.maintenanceSupport)}</dd>
      </div>
    </dl>
    ${notesBlock}

    <div class="proposal-signatures">
      <div class="proposal-signature-box">
        <span class="proposal-signature-label">Client</span>
        <span class="proposal-signature-line">Date et signature précédées de « Bon pour accord »</span>
      </div>
      <div class="proposal-signature-box">
        <span class="proposal-signature-label">YM Studio</span>
        <span class="proposal-signature-line">Date et signature</span>
      </div>
    </div>

    <div class="proposal-page-footer">
      <hr class="proposal-rule proposal-footer-rule" />
      <div class="proposal-page-footer-row">
        ${logoMarkHtml("black", 80)}
        <span>Référence ${esc(reference)}</span>
      </div>
    </div>
  </section>`;
}

export function buildProposalDocumentHtml(data: ProposalDocumentData): string {
  return `<div class="proposal-document">${coverPageHtml(data)}${missionPageHtml(
    data
  )}${offerPageHtml(data)}${optionsAndTermsPageHtml(data)}</div>`;
}

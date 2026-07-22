import type { ProposalDocumentData } from "@/lib/build-document-data";
import { escapeHtml } from "@/lib/escape-html";
import { formatCurrency, formatDateFR } from "@/lib/format";

const APPROACH_COPY =
  "Chez YM Studio, nous concevons des expériences digitales sur mesure, en alliant un design premium, une exécution technique soignée et un accompagnement personnalisé à chaque étape du projet. Notre objectif est de livrer un résultat à la hauteur de votre image de marque, dans les délais convenus.";

function esc(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === "") return "";
  return escapeHtml(String(value));
}

function fallback(value: string | undefined | null): string {
  const escaped = esc(value);
  return escaped || "—";
}

function brandHeader(): string {
  return `
    <div class="proposal-header">
      <span class="proposal-monogram">YM</span>
      <span class="proposal-wordmark">YM Studio</span>
    </div>`;
}

function coverPageHtml(data: ProposalDocumentData): string {
  const { client, project, reference } = data;

  const preparedFor = `Préparée pour ${fallback(client.name)}${
    client.company ? ` · ${esc(client.company)}` : ""
  }`;

  const validityRow = client.validityPeriod
    ? `<div>
        <p class="proposal-cover-meta-label">Validité de l'offre</p>
        <p class="proposal-cover-meta-value">${esc(client.validityPeriod)}</p>
      </div>`
    : "";

  return `
  <section class="proposal-page proposal-cover">
    ${brandHeader()}
    <div class="proposal-cover-title">
      <p class="proposal-eyebrow">Proposition commerciale</p>
      <h1 class="proposal-cover-project">${fallback(project.title) === "—" ? "Projet à définir" : esc(project.title)}</h1>
      <p class="proposal-muted">${preparedFor}</p>
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
  </section>`;
}

function projectPageHtml(data: ProposalDocumentData): string {
  const { project } = data;

  return `
  <section class="proposal-page">
    ${brandHeader()}
    <hr class="proposal-rule" />
    <h2 class="proposal-heading">Présentation du projet</h2>

    <p class="proposal-subheading">Contexte</p>
    <p class="proposal-prewrap">${fallback(project.context)}</p>

    <p class="proposal-subheading">Objectifs</p>
    <p class="proposal-prewrap">${fallback(project.objectives)}</p>

    <div class="proposal-info-grid">
      <div class="proposal-info-box">
        <p class="proposal-cover-meta-label">Délai estimatif</p>
        <p class="proposal-cover-meta-value">${fallback(project.timeline)}</p>
      </div>
    </div>

    <p class="proposal-subheading">Notre approche</p>
    <div class="proposal-approach">
      <p class="proposal-muted">${esc(APPROACH_COPY)}</p>
    </div>
  </section>`;
}

function servicesPageHtml(data: ProposalDocumentData): string {
  const { services, options, financial, totals } = data;
  const selectedOptions = options.filter((option) => option.selected);
  const futureOptions = options.filter((option) => !option.selected);

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
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3">Sous-total prestations</td>
          <td class="num">${esc(formatCurrency(totals.servicesSubtotal))}</td>
        </tr>
      </tfoot>
    </table>`
    : `
    <div class="proposal-global-amount">
      <span>Offre principale</span>
      <span class="value">${esc(formatCurrency(totals.servicesSubtotal))}</span>
    </div>`;

  const selectedOptionsBlock =
    selectedOptions.length > 0
      ? `
    <table class="proposal-table">
      <thead>
        <tr>
          <th>Option</th>
          <th class="num">Prix</th>
        </tr>
      </thead>
      <tbody>
        ${selectedOptions
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
      <tfoot>
        <tr>
          <td>Total options sélectionnées</td>
          <td class="num">${esc(formatCurrency(totals.optionsTotal))}</td>
        </tr>
      </tfoot>
    </table>`
      : `<p class="proposal-muted">Aucune option sélectionnée pour cette proposition.</p>`;

  const futureOptionsBlock =
    financial.showFutureOptionsInPdf && futureOptions.length > 0
      ? `
    <p class="proposal-subheading">Évolutions futures possibles (non incluses)</p>
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

  return `
  <section class="proposal-page">
    ${brandHeader()}
    <hr class="proposal-rule" />
    <h2 class="proposal-heading">Prestations</h2>
    ${servicesBlock}
    <p class="proposal-subheading">Options sélectionnées</p>
    ${selectedOptionsBlock}
    ${futureOptionsBlock}
  </section>`;
}

function investmentPageHtml(data: ProposalDocumentData): string {
  const { financial, terms, totals, reference } = data;

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
    <h2 class="proposal-heading">Investissement et conditions</h2>

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
    <p class="proposal-footer-note">Référence ${esc(reference)}</p>
  </section>`;
}

export function buildProposalDocumentHtml(data: ProposalDocumentData): string {
  return `<div class="proposal-document">${coverPageHtml(data)}${projectPageHtml(
    data
  )}${servicesPageHtml(data)}${investmentPageHtml(data)}</div>`;
}

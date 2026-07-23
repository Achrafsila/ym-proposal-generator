import type { ProposalDocumentData } from "@/lib/build-document-data";
import { formatCurrency, formatDateFR } from "@/lib/format";

const APPROACH_COPY =
  "Chez YM Studio, nous concevons des expériences digitales sur mesure, en alliant un design premium, une exécution technique soignée et un accompagnement personnalisé à chaque étape du projet. Notre objectif est de livrer un résultat à la hauteur de votre image de marque, dans les délais convenus.";

const COVER_FONT_STACK =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

/**
 * Official YM Studio logo — white-on-transparent on dark backgrounds
 * (the cover), black-on-transparent everywhere else (interior pages,
 * headers, footers, signatures). `height: auto` and no other sizing keep
 * the original proportions intact; only `width` varies by context, and
 * `object-fit: contain` (in CSS) guarantees it's never stretched.
 */
function LogoMark({ variant, width }: { variant: "white" | "black"; width: number }) {
  const src = variant === "white" ? "/branding/ym-logo-white.svg" : "/branding/ym-logo-black.svg";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="YM Studio" className="proposal-logo" style={{ width }} />
  );
}

function CoverArt() {
  return (
    <svg
      className="proposal-cover-art"
      viewBox="0 0 210 297"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="coverGlowGold" cx="82%" cy="18%" r="55%">
          <stop offset="0%" stopColor="#c9a45c" stopOpacity="0.22" />
          <stop offset="45%" stopColor="#c9a45c" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#c9a45c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="coverGlowAmber" cx="12%" cy="88%" r="50%">
          <stop offset="0%" stopColor="#7c5a2a" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#7c5a2a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="210" height="297" fill="#0a0a0c" />
      <rect x="0" y="0" width="210" height="297" fill="url(#coverGlowGold)" />
      <rect x="0" y="0" width="210" height="297" fill="url(#coverGlowAmber)" />

      {/* Single elegant diagonal crossing the page */}
      <line
        x1="-20"
        y1="95"
        x2="230"
        y2="30"
        stroke="#c9a45c"
        strokeOpacity="0.14"
        strokeWidth="0.6"
      />

      {/* Technical / blueprint hairlines */}
      <line x1="18" y1="0" x2="18" y2="297" stroke="#c9a45c" strokeOpacity="0.08" strokeWidth="0.15" />
      <line x1="192" y1="0" x2="192" y2="297" stroke="#c9a45c" strokeOpacity="0.08" strokeWidth="0.15" />
      <line
        x1="0"
        y1="24"
        x2="210"
        y2="24"
        stroke="#c9a45c"
        strokeOpacity="0.08"
        strokeWidth="0.15"
        strokeDasharray="1 2"
      />
      <line
        x1="0"
        y1="273"
        x2="210"
        y2="273"
        stroke="#c9a45c"
        strokeOpacity="0.08"
        strokeWidth="0.15"
        strokeDasharray="1 2"
      />

      {/* Corner registration marks */}
      <g stroke="#c9a45c" strokeOpacity="0.22" strokeWidth="0.25" fill="none">
        <path d="M12,20 L12,12 L20,12" />
        <path d="M190,12 L198,12 L198,20" />
        <path d="M198,277 L198,285 L190,285" />
        <path d="M20,285 L12,285 L12,277" />
      </g>

      {/* Giant background monogram — low opacity, never over the text block */}
      <text
        x="150"
        y="215"
        textAnchor="middle"
        fontFamily={COVER_FONT_STACK}
        fontWeight="700"
        fontSize="150"
        fill="#f5efe3"
        fillOpacity="0.05"
      >
        YM
      </text>
    </svg>
  );
}

function CoverPage({ data }: { data: ProposalDocumentData }) {
  return (
    <section className="proposal-page proposal-cover">
      <CoverArt />
      <div className="proposal-cover-content">
        <div className="proposal-header">
          <LogoMark variant="white" width={210} />
        </div>

        <div className="proposal-cover-title">
          <p className="proposal-eyebrow">Proposition commerciale</p>
          <h1 className="proposal-cover-project">{data.project.title || "Projet à définir"}</h1>
          <p className="proposal-cover-for-label proposal-muted">Préparé exclusivement pour</p>
          <p className="proposal-cover-for-company">{data.client.company || "—"}</p>
          <p className="proposal-cover-for-name proposal-muted">{data.client.name || "—"}</p>
        </div>

        <div className="proposal-cover-meta">
          <div>
            <p className="proposal-cover-meta-label">Client</p>
            <p className="proposal-cover-meta-value">{data.client.name || "—"}</p>
          </div>
          <div>
            <p className="proposal-cover-meta-label">Société / Cabinet</p>
            <p className="proposal-cover-meta-value">{data.client.company || "—"}</p>
          </div>
          <div>
            <p className="proposal-cover-meta-label">Date</p>
            <p className="proposal-cover-meta-value">{formatDateFR(data.client.quoteDate)}</p>
          </div>
          <div>
            <p className="proposal-cover-meta-label">Référence</p>
            <p className="proposal-cover-meta-value">{data.reference}</p>
          </div>
          {data.client.validityPeriod && (
            <div>
              <p className="proposal-cover-meta-label">Validité de l&apos;offre</p>
              <p className="proposal-cover-meta-value">{data.client.validityPeriod}</p>
            </div>
          )}
        </div>

        <p className="proposal-cover-footer">YM Studio — Proposition commerciale confidentielle</p>
      </div>
    </section>
  );
}

function MissionPage({ data }: { data: ProposalDocumentData }) {
  return (
    <section className="proposal-page">
      <div className="proposal-header">
        <LogoMark variant="black" width={110} />
      </div>
      <hr className="proposal-rule" />

      <h2 className="proposal-heading">Présentation de la mission</h2>

      <p className="proposal-subheading">Besoin du client</p>
      <p className="proposal-prewrap">{data.project.context || "—"}</p>

      <p className="proposal-subheading">Objectifs</p>
      <p className="proposal-prewrap">{data.project.objectives || "—"}</p>

      <p className="proposal-subheading">Notre approche</p>
      <div className="proposal-approach">
        <p className="proposal-muted">{APPROACH_COPY}</p>
      </div>

      <div className="proposal-info-grid">
        <div className="proposal-info-box">
          <p className="proposal-cover-meta-label">Délai estimatif</p>
          <p className="proposal-cover-meta-value">{data.project.timeline || "—"}</p>
        </div>
      </div>

      <div className="proposal-page-footer">
        <hr className="proposal-rule proposal-footer-rule" />
        <div className="proposal-page-footer-row">
          <LogoMark variant="black" width={80} />
          <span>Référence {data.reference}</span>
        </div>
      </div>
    </section>
  );
}

function OfferPage({ data }: { data: ProposalDocumentData }) {
  return (
    <section className="proposal-page">
      <div className="proposal-header">
        <LogoMark variant="black" width={110} />
      </div>
      <hr className="proposal-rule" />

      <h2 className="proposal-heading">Offre proposée</h2>

      {data.financial.showPriceDetails ? (
        <table className="proposal-table">
          <thead>
            <tr>
              <th>Prestation</th>
              <th className="num">Qté</th>
              <th className="num">P.U.</th>
              <th className="num">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.services.map((service, index) => (
              <tr key={index}>
                <td>
                  <div>{service.name || "—"}</div>
                  {service.description && (
                    <div className="proposal-muted" style={{ fontSize: "9pt" }}>
                      {service.description}
                    </div>
                  )}
                </td>
                <td className="num">{service.quantity}</td>
                <td className="num">{formatCurrency(service.unitPrice)}</td>
                <td className="num">{formatCurrency(service.quantity * service.unitPrice)}</td>
              </tr>
            ))}
            {/* Kept in tbody (not tfoot): a <tfoot> repeats at the bottom of
                every page a table spans, which would show this grand total
                prematurely before the last rows. */}
            <tr className="proposal-table-total-row">
              <td colSpan={3}>Total de l&apos;offre principale</td>
              <td className="num">{formatCurrency(data.totals.servicesSubtotal)}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <div className="proposal-global-amount">
          <span>Offre principale</span>
          <span className="value">{formatCurrency(data.totals.servicesSubtotal)}</span>
        </div>
      )}

      <div className="proposal-page-footer">
        <hr className="proposal-rule proposal-footer-rule" />
        <div className="proposal-page-footer-row">
          <LogoMark variant="black" width={80} />
          <span>Référence {data.reference}</span>
        </div>
      </div>
    </section>
  );
}

function OptionsAndTermsPage({ data }: { data: ProposalDocumentData }) {
  const { totals } = data;
  const includedOptions = data.options.filter((option) => option.selected);
  const futureOptions = data.options.filter((option) => !option.selected);

  return (
    <section className="proposal-page">
      <div className="proposal-header">
        <LogoMark variant="black" width={110} />
      </div>
      <hr className="proposal-rule" />

      <h2 className="proposal-heading">Options et conditions</h2>

      <p className="proposal-subheading">Options incluses</p>
      {includedOptions.length > 0 ? (
        <table className="proposal-table">
          <thead>
            <tr>
              <th>Option</th>
              <th className="num">Prix</th>
            </tr>
          </thead>
          <tbody>
            {includedOptions.map((option, index) => (
              <tr key={index}>
                <td>
                  <div>{option.name || "—"}</div>
                  {option.description && (
                    <div className="proposal-muted" style={{ fontSize: "9pt" }}>
                      {option.description}
                    </div>
                  )}
                </td>
                <td className="num">{formatCurrency(option.price)}</td>
              </tr>
            ))}
            <tr className="proposal-table-total-row">
              <td>Total options incluses</td>
              <td className="num">{formatCurrency(data.totals.optionsTotal)}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p className="proposal-muted">Aucune option incluse dans cette proposition.</p>
      )}

      {data.financial.showFutureOptionsInPdf && futureOptions.length > 0 && (
        <>
          <p className="proposal-subheading">Options non incluses (possibilités futures)</p>
          <table className="proposal-table">
            <thead>
              <tr>
                <th>Option</th>
                <th className="num">Prix indicatif</th>
              </tr>
            </thead>
            <tbody>
              {futureOptions.map((option, index) => (
                <tr key={index}>
                  <td>
                    <div>{option.name || "—"}</div>
                    {option.description && (
                      <div className="proposal-muted" style={{ fontSize: "9pt" }}>
                        {option.description}
                      </div>
                    )}
                  </td>
                  <td className="num">{formatCurrency(option.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <div className="proposal-recap">
        {totals.discountAmount > 0 && (
          <div className="proposal-recap-row">
            <span className="proposal-muted">Remise</span>
            <span>- {formatCurrency(totals.discountAmount)}</span>
          </div>
        )}
        <div className="proposal-recap-row emphasis">
          <span>Total HT</span>
          <span>{formatCurrency(totals.totalHT)}</span>
        </div>
        <div className="proposal-recap-row">
          <span className="proposal-muted">TVA ({data.financial.tvaRate}%)</span>
          <span>{formatCurrency(totals.tvaAmount)}</span>
        </div>
        <div className="proposal-recap-row emphasis">
          <span>Total TTC</span>
          <span className="proposal-accent">{formatCurrency(totals.totalTTC)}</span>
        </div>
        <div className="proposal-recap-row">
          <span className="proposal-muted">Acompte</span>
          <span>{formatCurrency(totals.depositAmount)}</span>
        </div>
        <div className="proposal-recap-row emphasis">
          <span>Solde restant</span>
          <span>{formatCurrency(totals.balanceDue)}</span>
        </div>
      </div>

      <p className="proposal-subheading">Modalités de paiement</p>
      <p className="proposal-prewrap">{data.terms.paymentTerms || "—"}</p>

      <p className="proposal-subheading">Conditions commerciales</p>
      <dl className="proposal-terms-grid">
        <div>
          <dt>Délai de réalisation</dt>
          <dd>{data.terms.completionTime || "—"}</dd>
        </div>
        <div>
          <dt>Modifications incluses</dt>
          <dd>{data.terms.revisionsIncluded || "—"}</dd>
        </div>
        <div>
          <dt>Durée de l&apos;hébergement</dt>
          <dd>{data.terms.hostingDuration || "—"}</dd>
        </div>
        <div>
          <dt>Maintenance et support</dt>
          <dd>{data.terms.maintenanceSupport || "—"}</dd>
        </div>
      </dl>
      {data.terms.additionalNotes && (
        <>
          <p className="proposal-subheading">Remarques complémentaires</p>
          <p className="proposal-prewrap">{data.terms.additionalNotes}</p>
        </>
      )}

      <div className="proposal-signatures">
        <div className="proposal-signature-box">
          <span className="proposal-signature-label">Client</span>
          <span className="proposal-signature-line">
            Date et signature précédées de « Bon pour accord »
          </span>
        </div>
        <div className="proposal-signature-box">
          <span className="proposal-signature-label">YM Studio</span>
          <span className="proposal-signature-line">Date et signature</span>
        </div>
      </div>

      <div className="proposal-page-footer">
        <hr className="proposal-rule proposal-footer-rule" />
        <div className="proposal-page-footer-row">
          <LogoMark variant="black" width={80} />
          <span>Référence {data.reference}</span>
        </div>
      </div>
    </section>
  );
}

export function ProposalDocument({ data }: { data: ProposalDocumentData }) {
  return (
    <div className="proposal-document">
      <CoverPage data={data} />
      <MissionPage data={data} />
      <OfferPage data={data} />
      <OptionsAndTermsPage data={data} />
    </div>
  );
}

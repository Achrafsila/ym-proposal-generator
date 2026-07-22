import type { ProposalDocumentData } from "@/lib/build-document-data";
import { formatCurrency, formatDateFR } from "@/lib/format";

const APPROACH_COPY =
  "Chez YM Studio, nous concevons des expériences digitales sur mesure, en alliant un design premium, une exécution technique soignée et un accompagnement personnalisé à chaque étape du projet. Notre objectif est de livrer un résultat à la hauteur de votre image de marque, dans les délais convenus.";

function CoverPage({ data }: { data: ProposalDocumentData }) {
  return (
    <section className="proposal-page proposal-cover">
      <div className="proposal-header">
        <span className="proposal-monogram">YM</span>
        <span className="proposal-wordmark">YM Studio</span>
      </div>

      <div className="proposal-cover-title">
        <p className="proposal-eyebrow">Proposition commerciale</p>
        <h1 className="proposal-cover-project">{data.project.title || "Projet à définir"}</h1>
        <p className="proposal-muted">
          Préparée pour {data.client.name || "—"}
          {data.client.company ? ` · ${data.client.company}` : ""}
        </p>
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
    </section>
  );
}

function MissionPage({ data }: { data: ProposalDocumentData }) {
  return (
    <section className="proposal-page">
      <div className="proposal-header">
        <span className="proposal-monogram">YM</span>
        <span className="proposal-wordmark">YM Studio</span>
      </div>
      <hr className="proposal-rule" />

      <h2 className="proposal-heading">Présentation de la mission</h2>

      <p className="proposal-subheading">Besoin du client</p>
      <p className="proposal-prewrap">{data.project.context || "—"}</p>

      <p className="proposal-subheading">Objectifs</p>
      <p className="proposal-prewrap">{data.project.objectives || "—"}</p>

      <div className="proposal-info-grid">
        <div className="proposal-info-box">
          <p className="proposal-cover-meta-label">Délai estimatif</p>
          <p className="proposal-cover-meta-value">{data.project.timeline || "—"}</p>
        </div>
      </div>

      <p className="proposal-subheading">Notre approche</p>
      <div className="proposal-approach">
        <p className="proposal-muted">{APPROACH_COPY}</p>
      </div>
    </section>
  );
}

function OfferPage({ data }: { data: ProposalDocumentData }) {
  return (
    <section className="proposal-page">
      <div className="proposal-header">
        <span className="proposal-monogram">YM</span>
        <span className="proposal-wordmark">YM Studio</span>
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
        <span className="proposal-monogram">YM</span>
        <span className="proposal-wordmark">YM Studio</span>
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
      <p className="proposal-footer-note">Référence {data.reference}</p>
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

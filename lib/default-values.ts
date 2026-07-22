import type { ProposalFormValues } from "@/lib/proposal-schema";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Prestations and options are no longer prefilled here — they're picked
 * from the reusable catalog (see features/catalog) or loaded from a
 * template (see features/templates), so a blank proposal starts empty.
 */
export function createDefaultProposalValues(): ProposalFormValues {
  return {
    client: {
      name: "",
      company: "",
      email: "",
      phone: "",
      address: "",
      quoteDate: todayISO(),
      validityPeriod: "30 jours",
    },
    project: {
      title: "",
      context: "",
      objectives: "",
      timeline: "",
    },
    services: [],
    options: [],
    financial: {
      discountType: "percent",
      discountValue: 0,
      tvaRate: 20,
      depositAmount: 0,
      showPriceDetails: true,
      showFutureOptionsInPdf: true,
    },
    terms: {
      completionTime: "",
      paymentTerms:
        "50 % à la validation de la proposition et 50 % avant la mise en ligne.",
      revisionsIncluded: "",
      hostingDuration: "",
      maintenanceSupport: "",
      additionalNotes: "",
    },
  };
}

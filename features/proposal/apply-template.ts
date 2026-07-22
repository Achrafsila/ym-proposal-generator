import { optionLibraryStorage } from "@/features/catalog/services/option-library-storage";
import { serviceLibraryStorage } from "@/features/catalog/services/service-library-storage";
import {
  catalogItemToOptionItem,
  catalogItemToServiceItem,
} from "@/features/proposal/catalog-to-proposal-item";
import type { ProposalTemplate } from "@/features/templates/types";
import { computeTotals, type FinancialLike } from "@/lib/calculations";
import { createDefaultProposalValues } from "@/lib/default-values";
import type { ProposalFormValues } from "@/lib/proposal-schema";

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Resolves a template's service/option references against the CURRENT
 * catalog state (so prices/descriptions stay up to date) and converts the
 * template's percent-or-amount deposit recommendation into the proposal's
 * absolute `depositAmount`, reusing computeTotals — no financial logic is
 * duplicated here. Client information is intentionally left untouched.
 */
export function buildProposalValuesFromTemplate(template: ProposalTemplate): ProposalFormValues {
  const base = createDefaultProposalValues();

  const services = serviceLibraryStorage.getByIds(template.serviceIds).map(catalogItemToServiceItem);
  // Template options are recommendations, not automatic inclusions — they
  // load unchecked ("non incluses dans l'offre principale") and the user
  // opts in per option, consistent with the rule that only explicitly
  // selected options ever count toward the total.
  const options = optionLibraryStorage
    .getByIds(template.optionIds)
    .map((item) => catalogItemToOptionItem(item, false));

  const financialWithoutDeposit: FinancialLike = {
    discountType: base.financial.discountType,
    discountValue: base.financial.discountValue,
    tvaRate: template.financialDefaults.tvaRate,
    depositAmount: 0,
  };

  const totals = computeTotals(services, options, financialWithoutDeposit);
  const depositAmount =
    template.financialDefaults.depositType === "percent"
      ? round2((totals.totalTTC * template.financialDefaults.depositValue) / 100)
      : Math.min(template.financialDefaults.depositValue, totals.totalTTC);

  return {
    ...base,
    project: {
      title: template.projectTitle,
      context: template.projectContext,
      objectives: template.projectObjectives,
      timeline: template.timeline,
    },
    services,
    options,
    financial: {
      discountType: financialWithoutDeposit.discountType,
      discountValue: financialWithoutDeposit.discountValue,
      tvaRate: template.financialDefaults.tvaRate,
      depositAmount,
      showPriceDetails: template.financialDefaults.showPriceDetails,
      showFutureOptionsInPdf: base.financial.showFutureOptionsInPdf,
    },
    terms: {
      completionTime: base.terms.completionTime,
      paymentTerms: template.terms.paymentTerms,
      revisionsIncluded: template.terms.revisionsIncluded,
      hostingDuration: template.terms.hostingDuration,
      maintenanceSupport: template.terms.maintenanceSupport,
      additionalNotes: template.terms.additionalNotes,
    },
  };
}

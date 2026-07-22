import type { ProposalTemplate } from "@/features/templates/types";
import type { ProposalFormValues } from "@/lib/proposal-schema";

type NewTemplateInput = Omit<ProposalTemplate, "id" | "createdAt" | "updatedAt">;

/**
 * Builds a template from the current proposal state. Client information is
 * never included. Only lines that were added from the catalog (i.e. carry a
 * `catalogId`) can be captured as `serviceIds`/`optionIds` — fully custom,
 * hand-typed lines have no catalog reference and are simply skipped.
 */
export function buildTemplateInputFromProposal(
  values: ProposalFormValues,
  name: string,
  sector: string
): NewTemplateInput {
  return {
    name,
    sector,
    projectTitle: values.project.title,
    projectContext: values.project.context,
    projectObjectives: values.project.objectives,
    timeline: values.project.timeline,
    serviceIds: values.services
      .map((service) => service.catalogId)
      .filter((id): id is string => Boolean(id)),
    optionIds: values.options
      .map((option) => option.catalogId)
      .filter((id): id is string => Boolean(id)),
    terms: {
      paymentTerms: values.terms.paymentTerms,
      revisionsIncluded: values.terms.revisionsIncluded,
      hostingDuration: values.terms.hostingDuration,
      maintenanceSupport: values.terms.maintenanceSupport,
      additionalNotes: values.terms.additionalNotes,
    },
    financialDefaults: {
      tvaRate: values.financial.tvaRate,
      depositType: "amount",
      depositValue: values.financial.depositAmount,
      showPriceDetails: values.financial.showPriceDetails,
    },
  };
}

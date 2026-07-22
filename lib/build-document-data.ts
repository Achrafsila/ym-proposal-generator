import { computeTotals, type ProposalTotals } from "@/lib/calculations";
import type {
  ClientValues,
  FinancialValues,
  OptionItem,
  ProjectValues,
  ProposalFormValues,
  ServiceItem,
  TermsValues,
} from "@/lib/proposal-schema";

export interface ProposalDocumentData {
  reference: string;
  client: ClientValues;
  project: ProjectValues;
  services: ServiceItem[];
  options: OptionItem[];
  financial: FinancialValues;
  terms: TermsValues;
  totals: ProposalTotals;
}

export function buildDocumentData(
  values: ProposalFormValues,
  reference: string
): ProposalDocumentData {
  const totals = computeTotals(values.services, values.options, values.financial);

  return {
    reference,
    client: values.client,
    project: values.project,
    services: values.services,
    options: values.options,
    financial: values.financial,
    terms: values.terms,
    totals,
  };
}

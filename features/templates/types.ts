export interface ProposalTemplate {
  id: string;
  name: string;
  sector: string;
  projectTitle: string;
  projectContext: string;
  projectObjectives: string;
  timeline: string;
  serviceIds: string[];
  optionIds: string[];
  terms: {
    paymentTerms: string;
    revisionsIncluded: string;
    hostingDuration: string;
    maintenanceSupport: string;
    additionalNotes: string;
  };
  financialDefaults: {
    tvaRate: number;
    depositType: "amount" | "percent";
    depositValue: number;
    showPriceDetails: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

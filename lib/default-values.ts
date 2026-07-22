import type { ProposalFormValues } from "@/lib/proposal-schema";

const DEFAULT_SERVICE_NAMES = [
  "Conception graphique sur mesure",
  "Développement d'un site web premium",
  "Animations Parallax",
  "Vidéos en arrière-plan",
  "Intégration Calendly",
  "Intégration WhatsApp",
  "Optimisation SEO",
  "Nom de domaine",
  "Hébergement",
  "Certificat SSL",
  "Mise en ligne",
];

const DEFAULT_OPTION_NAMES = [
  "Page supplémentaire",
  "Article de blog",
  "Galerie photos",
  "Galerie vidéos",
  "Intégration d'une vidéo supplémentaire",
  "Création de contenu",
  "Retouche photo",
  "Montage vidéo",
  "Référencement local",
  "Google Business Profile",
  "Maintenance annuelle",
];

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

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
    services: DEFAULT_SERVICE_NAMES.map((name) => ({
      name,
      description: "",
      quantity: 1,
      unitPrice: 0,
    })),
    options: DEFAULT_OPTION_NAMES.map((name) => ({
      selected: false,
      name,
      description: "",
      price: 0,
    })),
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

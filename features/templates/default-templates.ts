import type { ProposalTemplate } from "@/features/templates/types";

const SEED_TIMESTAMP = "2026-01-01T00:00:00.000Z";

const DEFAULT_TERMS = {
  paymentTerms: "50 % à la validation de la proposition et 50 % avant la mise en ligne.",
  revisionsIncluded: "2 séries de modifications",
  hostingDuration: "1 an inclus",
  maintenanceSupport: "Support par email pendant 30 jours",
  additionalNotes: "",
};

const DEFAULT_FINANCIALS = {
  tvaRate: 20,
  depositType: "percent" as const,
  depositValue: 50,
  showPriceDetails: true,
};

interface SeedTemplateInput {
  id: string;
  name: string;
  sector: string;
  projectTitle: string;
  projectContext: string;
  projectObjectives: string;
  timeline: string;
  serviceIds: string[];
  optionIds: string[];
  /** Overrides DEFAULT_TERMS field by field; existing templates omit this
   * and keep using the shared defaults unchanged. */
  terms?: Partial<typeof DEFAULT_TERMS>;
}

function buildSeed(items: SeedTemplateInput[]): ProposalTemplate[] {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    sector: item.sector,
    projectTitle: item.projectTitle,
    projectContext: item.projectContext,
    projectObjectives: item.projectObjectives,
    timeline: item.timeline,
    serviceIds: item.serviceIds,
    optionIds: item.optionIds,
    terms: { ...DEFAULT_TERMS, ...item.terms },
    financialDefaults: { ...DEFAULT_FINANCIALS },
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
  }));
}

export const DEFAULT_TEMPLATES: ProposalTemplate[] = buildSeed([
  {
    id: "template-cabinet-medical",
    name: "Cabinet médical",
    sector: "Santé",
    projectTitle: "Site vitrine pour cabinet médical",
    projectContext:
      "Le cabinet souhaite une présence en ligne claire et rassurante permettant aux patients de prendre rendez-vous facilement.",
    projectObjectives:
      "Faciliter la prise de rendez-vous en ligne et présenter l'équipe et les spécialités du cabinet.",
    timeline: "4 à 6 semaines",
    serviceIds: [
      "service-audit-cadrage",
      "service-conception-graphique",
      "service-dev-site-premium",
      "service-responsive",
      "service-integration-calendly",
      "service-seo-locale",
      "service-nom-domaine",
      "service-hebergement",
      "service-certificat-ssl",
      "service-mise-en-ligne",
    ],
    optionIds: ["option-google-business", "option-referencement-local", "option-maintenance-mensuelle"],
  },
  {
    id: "template-avocat",
    name: "Avocat ou cabinet juridique",
    sector: "Juridique",
    projectTitle: "Site vitrine pour cabinet d'avocats",
    projectContext:
      "Le cabinet souhaite renforcer sa crédibilité en ligne et présenter clairement ses domaines d'expertise.",
    projectObjectives: "Générer des prises de contact qualifiées et asseoir la notoriété du cabinet.",
    timeline: "4 à 6 semaines",
    serviceIds: [
      "service-audit-cadrage",
      "service-conception-graphique",
      "service-dev-site-premium",
      "service-responsive",
      "service-seo-technique",
      "service-nom-domaine",
      "service-hebergement",
      "service-certificat-ssl",
      "service-mise-en-ligne",
    ],
    optionIds: ["option-article-blog", "option-google-business", "option-maintenance-annuelle"],
  },
  {
    id: "template-restaurant",
    name: "Restaurant",
    sector: "Restauration",
    projectTitle: "Site vitrine pour restaurant",
    projectContext:
      "L'établissement souhaite présenter sa carte et son ambiance, et faciliter les réservations.",
    projectObjectives: "Augmenter les réservations et la visibilité locale.",
    timeline: "3 à 5 semaines",
    serviceIds: [
      "service-conception-graphique",
      "service-dev-site-premium",
      "service-responsive",
      "service-animations-parallax",
      "service-integration-whatsapp",
      "service-seo-locale",
      "service-nom-domaine",
      "service-hebergement",
      "service-mise-en-ligne",
    ],
    optionIds: ["option-galerie-photos", "option-google-business", "option-referencement-local"],
  },
  {
    id: "template-hotel",
    name: "Hôtel ou maison d'hôtes",
    sector: "Hôtellerie",
    projectTitle: "Site vitrine pour hôtel",
    projectContext:
      "L'établissement souhaite valoriser son cadre et simplifier les demandes de réservation directe.",
    projectObjectives: "Réduire la dépendance aux plateformes de réservation tierces.",
    timeline: "5 à 7 semaines",
    serviceIds: [
      "service-conception-graphique",
      "service-dev-site-premium",
      "service-responsive",
      "service-animations-parallax",
      "service-videos-arriere-plan",
      "service-seo-locale",
      "service-nom-domaine",
      "service-hebergement",
      "service-mise-en-ligne",
    ],
    optionIds: ["option-galerie-photos", "option-galerie-videos", "option-google-business", "option-multilingue"],
  },
  {
    id: "template-ecole",
    name: "École ou centre de formation",
    sector: "Éducation",
    projectTitle: "Site vitrine pour centre de formation",
    projectContext:
      "L'établissement souhaite présenter son catalogue de formations et simplifier les inscriptions.",
    projectObjectives: "Augmenter le nombre de demandes d'inscription qualifiées.",
    timeline: "6 à 8 semaines",
    serviceIds: [
      "service-audit-cadrage",
      "service-conception-graphique",
      "service-dev-site-premium",
      "service-responsive",
      "service-integration-calendly",
      "service-seo-technique",
      "service-nom-domaine",
      "service-hebergement",
      "service-mise-en-ligne",
      "service-formation",
    ],
    optionIds: ["option-article-blog", "option-formulaire-avance", "option-maintenance-annuelle"],
  },
  {
    id: "template-consultant",
    name: "Consultant indépendant",
    sector: "Conseil",
    projectTitle: "Site vitrine pour consultant indépendant",
    projectContext:
      "Le consultant souhaite une vitrine professionnelle présentant son expertise et facilitant la prise de rendez-vous.",
    projectObjectives: "Générer des demandes de rendez-vous qualifiées.",
    timeline: "3 à 4 semaines",
    serviceIds: [
      "service-conception-graphique",
      "service-dev-site-premium",
      "service-responsive",
      "service-integration-calendly",
      "service-seo-technique",
      "service-nom-domaine",
      "service-hebergement",
      "service-mise-en-ligne",
    ],
    optionIds: ["option-article-blog", "option-google-business"],
  },
  {
    id: "template-agence-immobiliere",
    name: "Agence immobilière",
    sector: "Immobilier",
    projectTitle: "Site vitrine pour agence immobilière",
    projectContext:
      "L'agence souhaite présenter ses biens et faciliter la prise de contact avec les prospects.",
    projectObjectives: "Générer des contacts qualifiés pour la vente et la location.",
    timeline: "5 à 7 semaines",
    serviceIds: [
      "service-conception-graphique",
      "service-dev-site-premium",
      "service-responsive",
      "service-seo-locale",
      "service-nom-domaine",
      "service-hebergement",
      "service-mise-en-ligne",
      "service-google-analytics",
    ],
    optionIds: [
      "option-galerie-photos",
      "option-formulaire-avance",
      "option-google-business",
      "option-referencement-local",
    ],
  },
  {
    id: "template-entreprise-services",
    name: "Entreprise de services",
    sector: "Services",
    projectTitle: "Site vitrine pour entreprise de services",
    projectContext:
      "L'entreprise souhaite présenter clairement son offre de services et générer des demandes de devis.",
    projectObjectives: "Augmenter le nombre de demandes de devis qualifiées.",
    timeline: "4 à 6 semaines",
    serviceIds: [
      "service-audit-cadrage",
      "service-conception-graphique",
      "service-dev-site-premium",
      "service-responsive",
      "service-seo-technique",
      "service-nom-domaine",
      "service-hebergement",
      "service-mise-en-ligne",
    ],
    optionIds: ["option-article-blog", "option-formulaire-avance", "option-maintenance-mensuelle"],
  },
  {
    id: "template-artisan",
    name: "Artisan ou commerce local",
    sector: "Commerce local",
    projectTitle: "Site vitrine pour artisan",
    projectContext:
      "L'artisan souhaite une vitrine simple présentant ses réalisations et facilitant la prise de contact locale.",
    projectObjectives: "Développer la visibilité locale et générer des demandes de devis.",
    timeline: "3 à 4 semaines",
    serviceIds: [
      "service-conception-graphique",
      "service-dev-site-premium",
      "service-responsive",
      "service-seo-locale",
      "service-nom-domaine",
      "service-hebergement",
      "service-mise-en-ligne",
    ],
    optionIds: ["option-galerie-photos", "option-google-business", "option-referencement-local"],
  },
  {
    id: "template-general",
    name: "Modèle général",
    sector: "Tous secteurs",
    projectTitle: "Création d'une présence digitale professionnelle",
    projectContext:
      "Le client souhaite développer une présence en ligne claire, moderne et professionnelle afin de mieux présenter son activité, ses services et ses points forts. La solution proposée doit également faciliter la prise de contact avec les prospects et renforcer la crédibilité de l'entreprise.",
    projectObjectives:
      "Valoriser l'image de l'entreprise, améliorer sa visibilité en ligne, présenter clairement ses services et faciliter la génération de nouvelles demandes de contact.",
    timeline: "4 à 6 semaines",
    serviceIds: [
      "service-audit-cadrage",
      "service-conception-graphique",
      "service-dev-site-premium",
      "service-responsive",
      "service-integration-whatsapp",
      "service-formulaire-contact",
      "service-seo-technique",
      "service-nom-domaine",
      "service-hebergement",
      "service-certificat-ssl",
      "service-mise-en-ligne",
    ],
    optionIds: [
      "option-page-supplementaire",
      "option-galerie-photos",
      "option-galerie-videos",
      "option-creation-contenu",
      "option-google-business",
      "option-referencement-local",
      "option-multilingue",
      "option-maintenance-annuelle",
      "option-email-pro",
    ],
    terms: {
      revisionsIncluded: "2 séries de modifications incluses",
      maintenanceSupport: "Support technique par email pendant 30 jours après la mise en ligne.",
      additionalNotes:
        "Toute demande supplémentaire non prévue dans la présente proposition pourra faire l'objet d'un devis complémentaire.",
    },
  },
]);

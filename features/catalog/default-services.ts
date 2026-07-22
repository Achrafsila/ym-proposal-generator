import type { CatalogItem, CatalogItemUnit } from "@/features/catalog/types";

const SEED_TIMESTAMP = "2026-01-01T00:00:00.000Z";

interface SeedInput {
  id: string;
  name: string;
  category: string;
  unit?: CatalogItemUnit;
}

function buildSeed(items: SeedInput[]): CatalogItem[] {
  return items.map((item, index) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    shortDescription: "",
    pdfDescription: "",
    recommendedPrice: 0,
    unit: item.unit ?? "fixed",
    isActive: true,
    order: index,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
  }));
}

/**
 * Added after the initial catalog seed — kept as a standalone constant (full
 * shape, not just the narrow SeedInput used for the array below) so it can
 * also be passed to `ensureItem()` to backfill libraries that were already
 * seeded before this service existed, without ever duplicating it.
 */
export const CONTACT_FORM_SERVICE_SEED: Omit<CatalogItem, "order" | "createdAt" | "updatedAt"> = {
  id: "service-formulaire-contact",
  name: "Formulaire de contact",
  category: "Développement",
  shortDescription: "",
  pdfDescription: "",
  recommendedPrice: 0,
  unit: "fixed",
  isActive: true,
};

export const DEFAULT_SERVICES: CatalogItem[] = buildSeed([
  { id: "service-audit-cadrage", name: "Audit et cadrage du projet", category: "Stratégie" },
  { id: "service-conception-graphique", name: "Conception graphique sur mesure", category: "Design" },
  { id: "service-dev-site-premium", name: "Développement d'un site web premium", category: "Développement" },
  { id: "service-responsive", name: "Responsive mobile et tablette", category: "Développement" },
  { id: "service-animations-parallax", name: "Animations Parallax", category: "Développement" },
  { id: "service-videos-arriere-plan", name: "Intégration de vidéos en arrière-plan", category: "Développement" },
  { id: "service-integration-whatsapp", name: "Intégration WhatsApp", category: "Intégrations" },
  { id: "service-integration-calendly", name: "Intégration Calendly", category: "Intégrations" },
  CONTACT_FORM_SERVICE_SEED,
  { id: "service-seo-technique", name: "Optimisation SEO technique", category: "Référencement" },
  { id: "service-seo-locale", name: "Optimisation SEO locale", category: "Référencement" },
  { id: "service-nom-domaine", name: "Nom de domaine", category: "Hébergement", unit: "year" },
  { id: "service-hebergement", name: "Hébergement", category: "Hébergement", unit: "year" },
  { id: "service-certificat-ssl", name: "Certificat SSL", category: "Hébergement", unit: "year" },
  { id: "service-google-analytics", name: "Configuration Google Analytics", category: "Intégrations" },
  { id: "service-mise-en-ligne", name: "Mise en ligne", category: "Développement" },
  { id: "service-formation", name: "Formation à l'utilisation du site", category: "Maintenance" },
  { id: "service-personnalise", name: "Prestation personnalisée", category: "Autre" },
]);

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

export const DEFAULT_OPTIONS: CatalogItem[] = buildSeed([
  { id: "option-page-supplementaire", name: "Page supplémentaire", category: "Développement", unit: "page" },
  { id: "option-article-blog", name: "Article de blog", category: "Contenu", unit: "item" },
  { id: "option-galerie-photos", name: "Galerie photos", category: "Contenu" },
  { id: "option-galerie-videos", name: "Galerie vidéos", category: "Contenu" },
  { id: "option-video-supplementaire", name: "Vidéo supplémentaire", category: "Contenu", unit: "item" },
  { id: "option-creation-contenu", name: "Création de contenu", category: "Contenu" },
  { id: "option-retouche-photo", name: "Retouche photo", category: "Contenu" },
  { id: "option-montage-video", name: "Montage vidéo", category: "Contenu" },
  { id: "option-shooting-photo", name: "Shooting photo", category: "Contenu" },
  { id: "option-creation-logo", name: "Création de logo", category: "Design" },
  { id: "option-charte-graphique", name: "Charte graphique", category: "Design" },
  { id: "option-google-business", name: "Google Business Profile", category: "Référencement" },
  { id: "option-referencement-local", name: "Référencement local", category: "Référencement" },
  { id: "option-maintenance-mensuelle", name: "Maintenance mensuelle", category: "Maintenance", unit: "month" },
  { id: "option-maintenance-annuelle", name: "Maintenance annuelle", category: "Maintenance", unit: "year" },
  { id: "option-support-prioritaire", name: "Support prioritaire", category: "Maintenance", unit: "month" },
  { id: "option-email-pro", name: "Adresse email professionnelle", category: "Hébergement", unit: "year" },
  { id: "option-multilingue", name: "Version multilingue", category: "Développement" },
  { id: "option-integration-paiement", name: "Intégration de paiement", category: "Intégrations" },
  { id: "option-formulaire-avance", name: "Formulaire avancé", category: "Intégrations" },
  { id: "option-personnalise", name: "Module personnalisé", category: "Autre" },
]);

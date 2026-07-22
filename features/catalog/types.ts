export type CatalogItemUnit = "fixed" | "page" | "month" | "year" | "item";

export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  pdfDescription: string;
  recommendedPrice: number;
  unit: CatalogItemUnit;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

/** Prestations and complementary modules share exactly the same shape. */
export type CatalogService = CatalogItem;
export type CatalogOption = CatalogItem;

export const SERVICE_CATEGORIES = [
  "Stratégie",
  "Design",
  "Développement",
  "Contenu",
  "Référencement",
  "Intégrations",
  "Hébergement",
  "Maintenance",
  "Autre",
] as const;

export const OPTION_CATEGORIES = SERVICE_CATEGORIES;

export const UNIT_LABELS: Record<CatalogItemUnit, string> = {
  fixed: "Forfait",
  page: "Par page",
  month: "Par mois",
  year: "Par an",
  item: "À l'unité",
};

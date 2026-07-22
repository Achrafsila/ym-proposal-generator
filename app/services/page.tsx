"use client";

import { CatalogManager } from "@/components/catalog/catalog-manager";
import { serviceLibraryStorage } from "@/features/catalog/services/service-library-storage";
import { SERVICE_CATEGORIES } from "@/features/catalog/types";

export default function ServicesPage() {
  return (
    <CatalogManager
      storage={serviceLibraryStorage}
      categories={SERVICE_CATEGORIES}
      title="Prestations"
      description="Gérez les prestations réutilisables proposées par YM Studio."
      itemLabel="une prestation"
      addButtonLabel="Ajouter une prestation"
    />
  );
}

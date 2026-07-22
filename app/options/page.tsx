"use client";

import { CatalogManager } from "@/components/catalog/catalog-manager";
import { optionLibraryStorage } from "@/features/catalog/services/option-library-storage";
import { OPTION_CATEGORIES } from "@/features/catalog/types";

export default function OptionsPage() {
  return (
    <CatalogManager
      storage={optionLibraryStorage}
      categories={OPTION_CATEGORIES}
      title="Modules complémentaires"
      description="Gérez les options et évolutions proposées en complément de l'offre principale."
      itemLabel="un module complémentaire"
      addButtonLabel="Ajouter un module"
    />
  );
}

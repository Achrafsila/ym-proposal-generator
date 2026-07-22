import { CONTACT_FORM_SERVICE_SEED, DEFAULT_SERVICES } from "@/features/catalog/default-services";
import { createCatalogStorage } from "@/features/catalog/services/catalog-storage";

export const SERVICE_LIBRARY_STORAGE_KEY = "ym-proposal-services-v1";

export const serviceLibraryStorage = createCatalogStorage(
  SERVICE_LIBRARY_STORAGE_KEY,
  DEFAULT_SERVICES,
  "service"
);

// Backfills "Formulaire de contact" into libraries that were already seeded
// before it existed. Idempotent — no-op once the item is present, and a
// no-op on the server (guarded internally by ensureItem/localStorage access).
serviceLibraryStorage.ensureItem(CONTACT_FORM_SERVICE_SEED);

import { DEFAULT_OPTIONS } from "@/features/catalog/default-options";
import { createCatalogStorage } from "@/features/catalog/services/catalog-storage";

export const OPTION_LIBRARY_STORAGE_KEY = "ym-proposal-options-v1";

export const optionLibraryStorage = createCatalogStorage(
  OPTION_LIBRARY_STORAGE_KEY,
  DEFAULT_OPTIONS,
  "option"
);
